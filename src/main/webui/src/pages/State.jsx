import React, { useEffect, useState } from "react";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import StateItem from '../components/state/StateItem';
import StateRowHeader from "../components/state/StateRowHeader";
import StateRowSubHeader from "../components/state/StateRowSubHeader";
import { AlertsManager , AlertsContext } from '../utils/AlertsManager';

import axios from "axios";

import "../components/state/state.css"


function State() {

  const titles = ["ORDERED", "IN_PROGRESS", "DELIVERED"];
  const [selectedItems, setSelectedItems] = useState([]);
  const [ordered, setOrdered ] = useState([])
  const [processing, setProcessing] = useState([]);
  const [done, setDone] = useState([]);
  const alertsManagerRef =  useRef(AlertsContext);

  useEffect(() => {
      axios.get("orderItem")
      .then(response =>{
        const { o, p, d } = distributeOrders(response.data);
        setOrdered(o);
        setProcessing(p);
        setDone(d);
      }).catch(error =>{
        alertsManagerRef.current.showAlert('error', "Fehler bei der der Datenabfrage. "+ error.response.data);
      })

  }, []);

  function distributeOrders(orderItems) {
    const o = [];
    const p = [];
    const d = [];
  
    // Loop through each orderItem in the order
    for (const orderItem of orderItems) {
      console.log(orderItem)
      const status = orderItem.orderStatus;

      // Distribute items based on their orderStatus
      switch (status) {
        case titles[0]:
          o.push(orderItem);
          break;
        case titles[1]:
          p.push(orderItem);
          break;
        case titles[2]:
          d.push(orderItem);
          break;
        default:
          alertsManagerRef.current.showAlert('warning', "Unbekannter Status in einer Bestellposition. "+ status);
          console.warn("Unknown orderItem status:", status);
        }
    }
    return { o, p, d };
  }

  const [sortOrders, setSortOrders] = useState({
    user: 'asc', 
    description: 'asc',
    extras: 'asc'
});

function sortByPrimaryKey(data, primaryKey) {
  const reverse = sortOrders[primaryKey] === 'desc';  
  const newOrder = sortOrders[primaryKey] === 'asc' ? 'desc' : 'asc';

  setSortOrders({ 
    ...sortOrders,
    [primaryKey]: newOrder 
  });

  return data.sort((a, b) => {
        if (a[primaryKey] < b[primaryKey]) return reverse ? 1 : -1;
        if (a[primaryKey] > b[primaryKey]) return reverse ? -1 : 1;
        return 0; 
    });
}

const handleSetSelectedITems = (item) => {
  const existingIndex = selectedItems.findIndex(i => i.id === item.id);

  if (existingIndex !== -1) {
    // Item found - remove it
    item.selected = false;
    setSelectedItems([
      ...selectedItems.slice(0, existingIndex),
      ...selectedItems.slice(existingIndex + 1)
    ]);
  } else {
    // Item not found - add it
    item.selected = true;

    setSelectedItems([...selectedItems, item]);
  }
}

  
  const handleNext = (item) => {
    switch (item.state) { // Assuming you add a 'state' attribute to items
      case titles[0]: //orderd
        setOrdered(ordered.filter((i) => i.id !== item.id));
        item.state = titles[1];
        setProcessing([...processing, item]);
        break;
      case titles[1]: //Processing
        setProcessing(processing.filter((i) => i.id !== item.id));
        item.state = titles[2];
        setDone([...done, item]);
        break;
      // No default needed if 'done' is the final state
    }
  };
  
  const handlePrevious = (item) => {
    switch (item.state) {
      case titles[1]: //Processing
        setProcessing(processing.filter((i) => i.id !== item.id));
        item.state = titles[0];
        setOrdered([...ordered, item]);
        break;
      case titles[2]: //Done
        setDone(done.filter((i) => i.id !== item.id));
        item.state = titles[1];
        setProcessing([...processing, item]);
        break;
      // No default needed if 'ordered' is the initial state
    }
  };

  const handleSort = (arrayToSort, option) => {
    // console.log(arrayToSort, option)

    switch (arrayToSort) {
      case "Bestellt":
          setOrdered(sortByPrimaryKey(ordered.slice(), option)); 
        break;
        case "In Bearbeitung":
          setProcessing(sortByPrimaryKey(processing.slice(), option)); 
        break;
      case "Fertig":
          setDone(sortByPrimaryKey(done.slice(), option)); 
        break;
    
      default:
        console.log("no valid state selected")
        break;
    }
    // console.log(arrayToSort, option);
  }

  const handleMassSort = (arrayToSort, option) => {
    // Filter for items which don't belong in the current arrayToSort
    const filteredItems = selectedItems.filter(item => item.state === arrayToSort);
  
    // Build updates for each state array
    const newOrdered = ordered.slice();  // Make a copy to modify
    const newProcessing = processing.slice();
    const newDone = done.slice();
    const newSelectedItems = selectedItems.slice();
  
    for (let index = 0; index < filteredItems.length; index++) {
      const item = filteredItems[index];
  
      // 1. Remove item from corresponding array (modify the copies)
      switch (item.state) {
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
  };


  return (
    <Grid container direction="row" justifyContent="center" alignItems="flex-start" spacing={2}>
    <Grid item  justifyContent="center" alignItems="center" >
      <Paper className='itemContainer'  variant="elevation" elevation={2} sx={{ backgroundColor: '#010409'}} >
      <StateRowHeader pHandleSort={handleSort} state={"Bestellt"} color={"error"} number= {ordered?.length} />
      <StateRowSubHeader pHandleSort={handleMassSort} state={titles[0]} number = {selectedItems.filter(item => item.state === titles[0]).length} titles={titles} />
        { ordered?.length
        ? ordered.map((product) => (
        <Grid item><StateItem data={product} next={handleNext} previous={handlePrevious} pHandleSetSelectedITems={handleSetSelectedITems}/></Grid>
         )):null}
      </Paper>
    </Grid>
    <Grid item>
      <Paper className='itemContainer' variant="elevation" elevation={2} sx={{ backgroundColor: '#010409'}}>
      <StateRowHeader pHandleSort={handleSort} state={"In Bearbeitung"} color={"warning"} number= {processing?.length}/>
      <StateRowSubHeader pHandleSort={handleMassSort} state={titles[1]} number = {selectedItems.filter(item => item.state === titles[1]).length}  titles={titles}/>

        { processing?.length
        ? processing.map((product) => (
        <Grid item><StateItem data={product} next={handleNext} previous={handlePrevious} pHandleSetSelectedITems={handleSetSelectedITems}/></Grid>
         )):null}
      </Paper>
    </Grid>
    <Grid item>
      <Paper className='itemContainer' variant="elevation" elevation={2} sx={{ backgroundColor: '#010409'}}>
      <StateRowHeader pHandleSort={handleSort} state={"Fertig"} color={"success"} number= {done?.length}/>
      <StateRowSubHeader pHandleSort={handleMassSort} state={titles[2]} number = {selectedItems.filter(item => item.state === titles[2]).length}  titles={titles}/>

        { done?.length
        ? done.map((product) => (
        <Grid item><StateItem data={product} next={handleNext} previous={handlePrevious} pHandleSetSelectedITems={handleSetSelectedITems}/></Grid>
         )):null}
      </Paper>
    </Grid>
    <pre>{JSON.stringify(selectedItems, null, 2)}</pre>
    <pre>{JSON.stringify(ordered, null, 2)}</pre>
    <pre>{JSON.stringify(processing, null, 2)}</pre>
    <pre>{JSON.stringify(done, null, 2)}</pre>
  </Grid>
  )
};

export default State;