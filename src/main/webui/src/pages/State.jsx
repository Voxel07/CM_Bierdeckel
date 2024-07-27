import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Divider from "@mui/material/Divider";
import { Stack, Typography  } from "@mui/material";
import StateItem from '../components/state/StateItem';
import StateRowHeader from "../components/state/StateRowHeader";
import StateRowSubHeader from "../components/state/StateRowSubHeader";
import { AlertsManager , AlertsContext } from '../utils/AlertsManager';
import { summarizeOrderItems, summarizeOrder } from "../components/order/orderUtils";
import { StateOverviewItem }from "../components/state/StateOverviewItem";

import "../components/state/state.css"

function State() {

  const titles = ["ORDERED", "IN_PROGRESS", "DELIVERED"];
  const [selectedItems, setSelectedItems] = useState([]);
  const [ordered, setOrdered ] = useState([])
  const [processing, setProcessing] = useState([]);
  const [done, setDone] = useState([]);
  const alertsManagerRef =  useRef(AlertsContext);
  // const [displayItems, setDisplayItems] = useState([]); // Items sorted to have a quantity
  const [overviewOrderd, setOvervieOrderd] = useState([]);
  const [overviewprocessing, setOvervieprocessing] = useState([]);
  const [overviewDone, setOvervieDone] = useState([]);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
      axios.get("/order", {params:{category: "Food"}})
      .then(response =>{
        // setDisplayItems(summarizeOrder(response.data))
        const { o, p, d } = distributeOrders(response.data);
        setTrigger( trigger + 1)
        setOrdered(o);
        setProcessing(p);
        setDone(d);
      }).catch(error =>{
        console.log(error)
        alertsManagerRef.current.showAlert('error', "Fehler bei der der Datenabfrage. ");
      })

  }, []);

  useEffect(()=>{
    setOvervieOrderd(summarizeOrderItems(ordered))
    setOvervieprocessing(summarizeOrderItems(processing))
    setOvervieDone(summarizeOrderItems(done))
  }, [trigger])

  function distributeOrders(orders) {
    const o = [];
    const p = [];
    const d = [];
  // Loop through each order
  for (const order of orders) {
    // Loop through each orderItem in the order
    for (const orderItem of order.orderItems) {
      if(orderItem.product.category != "Food") continue;

      const orderItemWithId = {...orderItem, userId: order.user.id}
      const status = orderItemWithId.orderStatus;

      // Distribute items based on their orderStatus
      switch (status) {
        case titles[0]:
          o.push(orderItemWithId);
          break;
        case titles[1]:
          p.push(orderItemWithId);
          break;
        case titles[2]:
          d.push(orderItemWithId);
          break;
        default:
          alertsManagerRef.current.showAlert('warning', "Unbekannter Status in einer Bestellposition. "+ status);
          console.warn("Unknown orderItem status:", status);
        }
      }
    }     
    return { o, p, d };
  }

  const [sortOrders, setSortOrders] = useState({
    user: 'asc',
    description: 'asc',
    extras: 'asc'
  });

function sortByKey(data, key) {
  const reverse = sortOrders[key] === 'desc';
  const newOrder = sortOrders[key] === 'asc' ? 'desc' : 'asc';
  setSortOrders({
    ...sortOrders,
    [key]: newOrder
  });

  return [...data].sort((a, b) => {
    let aValue, bValue;

    if (key === 'userId') {
      aValue = a.userId;
      bValue = b.userId;
    } else if (key === 'description') {
      aValue = a.product.name;
      bValue = b.product.name;
    } else if (key === 'extras') {
      aValue = a.extraItems.map(item => item.name).join(',');
      bValue = b.extraItems.map(item => item.name).join(',');
    }

    if (aValue < bValue) return reverse ? 1 : -1;
    if (aValue > bValue) return reverse ? -1 : 1;
    return 0;
  });
}

const handleSetSelectedITems = (item) => {
  const existingIndex = selectedItems.findIndex(i => i.id === item.id);

  if (existingIndex !== -1) {
    // Item found - remove it
    const updatedItems = selectedItems.filter(i => i.id !== item.id);
    setSelectedItems(updatedItems);
    
    // Update the item's selected status in its respective array
    updateItemInArray(item.id, false);
  } else {
    // Item not found - add it
    setSelectedItems([...selectedItems, { ...item, selected: true }]);
    
    // Update the item's selected status in its respective array
    updateItemInArray(item.id, true);
  }
}

const updateItemInArray = (itemId, selectedStatus) => {
  const updateArray = (array, setArray) => {
    const updatedArray = array.map(i => 
      i.id === itemId ? { ...i, selected: selectedStatus } : i
    );
    setArray(updatedArray);
  };

  updateArray(ordered, setOrdered);
  updateArray(processing, setProcessing);
  updateArray(done, setDone);
}

const handleNext = (item) => {
  console.log(updateOrderItemState(item, "progress"))
  // if (updateOrderItemState(item, "progress") == false) 
  // {
  //   console.log("weg damit")
  //   return false;
  // }
 
  switch (item.orderStatus) {
    case titles[0]: //orderd
      setOrdered(ordered.filter((i) => i.id !== item.id));
      item.orderStatus = titles[1];
      setProcessing([...processing, item]);
      break;
    case titles[1]: //Processing
      setProcessing(processing.filter((i) => i.id !== item.id));
      item.orderStatus = titles[2];
      setDone([...done, item]);
      break;
    // No default needed if 'done' is the final state
  }
  setTrigger( trigger + 1)
};
  
const handlePrevious = (item) => {
  if (updateOrderItemState(item, "retrogress") == false)  return false;

  switch (item.orderStatus) {
    case titles[1]: //Processing
      setProcessing(processing.filter((i) => i.id !== item.id));
      item.orderStatus = titles[0];
      setOrdered([...ordered, item]);
      break;
    case titles[2]: //Done
      setDone(done.filter((i) => i.id !== item.id));
      item.orderStatus = titles[1];
      setProcessing([...processing, item]);
      break;
  }
  setTrigger( trigger + 1)
};

const handleSort = (arrayToSort, option) => {
  switch (arrayToSort) {
    case "Bestellt":
      setOrdered(sortByKey(ordered, option));
      break;
    case "In Bearbeitung":
      setProcessing(sortByKey(processing, option));
      break;
    case "Fertig":
      setDone(sortByKey(done, option));
      break;
    default:
      console.log("no valid state selected");
      break;
  }
}

  const handleMassSort = (arrayToSort, option) => {
    console.log(arrayToSort)
    console.log(option)
    // Filter for items which don't belong in the current arrayToSort
    const filteredItems = selectedItems.filter(item => item.orderStatus === arrayToSort);
    updateOrderItemsState(filteredItems, option)
    
    console.log(filteredItems)
  
    // Build updates for each state array
    const newOrdered = ordered.slice();  // Make a copy to modify
    const newProcessing = processing.slice();
    const newDone = done.slice();
    const newSelectedItems = selectedItems.slice();
  
    for (let index = 0; index < filteredItems.length; index++) {
      const item = filteredItems[index];
  
      // 1. Remove item from corresponding array (modify the copies)
      switch (item.orderStatus) {
        case titles[0]: //Orderd
          newOrdered.splice(newOrdered.findIndex(i => i.id === item.id), 1);
          break;
        case titles[1]: //Processing
          newProcessing.splice(newProcessing.findIndex(i => i.id === item.id), 1);
          break;
        case titles[2]: //Done
          newDone.splice(newDone.findIndex(i => i.id === item.id), 1);
          break;
      }
  
      // 2. Update state of item
      item.state = option; 
      item.selected = false;
  
      // 3. Add item to the correct array (modify the copies)
      switch (option) {
        case titles[0]: //Orderd
          newOrdered.push(item);
          break;
        case titles[1]: //Processing
          newProcessing.push(item);
          break;
        case titles[2]: //Done
          newDone.push(item);
          break;
      }
  
      // 4. Remove from selectedItems array (modify the copy)
      newSelectedItems.splice(newSelectedItems.findIndex(i => i.id === item.id), 1);
    }
  
    // Update state in a single operation (for efficiency)
    setOrdered(newOrdered);
    setProcessing(newProcessing);
    setDone(newDone);
    setSelectedItems(newSelectedItems);
    
    setTrigger( trigger + 1)

  };

  // Update one Item
  function updateOrderItemState (item, direction){
    const items = [item];
    console.log(items)
    var errorState;
    
    axios.put("orderItem", items, {params:{
      action: direction
    },
    headers:{
      'Content-Type': 'application/json'
    }})
    .then(response =>{
      alertsManagerRef.current.showAlert('success', response.data);
      errorState =  true;
    })
    .catch(error =>{
      alertsManagerRef.current.showAlert('error', error.response.data);
      errorState = false;
    });
    return errorState;
  }

  // Update a list of items
  function updateOrderItemsState (items, target){
    console.log(items)
    var errorState;
    
    axios.put("orderItem", items, {params:{
      state: target
    },
    headers:{
      'Content-Type': 'application/json'
    }})
    .then(response =>{
      alertsManagerRef.current.showAlert('success', response.data);
      errorState =  true;
    })
    .catch(error =>{
      alertsManagerRef.current.showAlert('error', error.response.data);
      errorState = false;
    });
    return errorState;
  }

  // const handleMultiSelect = (array) => {


  // switch (array) {
  //   case titles[0]: //orderd

  //     break;
  //   case titles[1]: //Processing
      
  //   break;
  //   case titles[2]: //done

  //   break;

  // }

  return (
    <Grid sx={{ flexGrow: 1 }} container direction="column" >
      <AlertsManager ref={alertsManagerRef} />

      {/* overview */}
      {/* <Grid item xs={8} >
        <Grid container justifyContent="center" >
          <StateOverviewItem displayItems={displayItems} />
          </Grid>
      </Grid> */}
    
      {/* State */}
      <Grid item>

      <Grid container justifyContent="center" spacing={3}>
        
        <Grid item >
          <StateOverviewItem displayItems={overviewOrderd} />
          <Paper className='itemContainer'  variant="elevation" elevation={2}>
          <StateRowHeader pHandleSort={handleSort} displayState={"Bestellt"} state={titles[0]} color={"error"} number = {ordered?.length} />
          <StateRowSubHeader  pHandleSort={handleMassSort} state={titles[0]} 
                              number = {selectedItems.filter(item => item.orderStatus  === titles[0]).length} 
                              titles={titles} 
                              pHandleMultiSelect={handleMultiSelect}/>
            { ordered?.length
            ? ordered.map((product, key) => (
            <Grid key={key} item><StateItem data={product} next={handleNext} previous={handlePrevious} pHandleSetSelectedITems={handleSetSelectedITems}/></Grid>
            )):null}
          </Paper>
        </Grid>
        
        <Grid item >
          <StateOverviewItem displayItems={overviewprocessing} />
          <Paper className='itemContainer' variant="elevation" elevation={2}>
          <StateRowHeader pHandleSort={handleSort} displayState={"In Bearbeitung"} state={titles[1]} color={"warning"} number = {processing?.length}/>
          <StateRowSubHeader pHandleSort={handleMassSort} state={titles[1]} number = {selectedItems.filter(item => item.orderStatus  === titles[1]).length}  titles={titles}/>
            { processing?.length
            ? processing.map((product, key) => (
            <Grid key={key} item><StateItem data={product} next={handleNext} previous={handlePrevious} pHandleSetSelectedITems={handleSetSelectedITems}/></Grid>
            )):null}
          </Paper>
        </Grid>

        <Grid item >
          <StateOverviewItem displayItems={overviewDone} />
          <Paper className='itemContainer' variant="elevation" elevation={2}>
          <StateRowHeader pHandleSort={handleSort} displayState={"Fertig"} state={titles[2]} color={"success"} number = {done?.length}/>
          <StateRowSubHeader pHandleSort={handleMassSort} state={titles[2]} number = {selectedItems.filter(item => item.orderStatus  === titles[2]).length}  titles={titles}/>
            { done?.length
            ? done.map((product, key) => (
            <Grid key={key} item><StateItem data={product} next={handleNext} previous={handlePrevious} pHandleSetSelectedITems={handleSetSelectedITems}/></Grid>
            )):null}
          </Paper>
        </Grid>

      </Grid>
      {/* <pre style={{ color: "white" }}>{JSON.stringify(selectedItems, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(ordered, null, 2)}</pre>
      <pre>{JSON.stringify(processing, null, 2)}</pre>
      <pre>{JSON.stringify(done, null, 2)}</pre> */}
    </Grid>
    </Grid>
  )
};

export default State;