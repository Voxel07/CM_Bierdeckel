import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import StateItem from '../components/state/StateItem';
import StateRowHeader from "../components/state/StateRowHeader";
import StateRowSubHeader from "../components/state/StateRowSubHeader";
import { AlertsManager, AlertsContext } from '../utils/AlertsManager';
import { StateOverviewItem } from "../components/state/StateOverviewItem";

function State() {
  const titles = ["ORDERED", "IN_PROGRESS", "DELIVERED"];
  const [selectedItems, setSelectedItems] = useState([]);
  const [ordered, setOrdered] = useState([]);
  const [processing, setProcessing] = useState([]);
  const [done, setDone] = useState([]);
  const alertsManagerRef = useRef(AlertsContext);
  
  const [overviewOrdered, setOverviewOrdered] = useState([]);
  const [overviewProcessing, setOverviewProcessing] = useState([]);
  const [overviewDone, setOverviewDone] = useState([]);
  const [trigger, setTrigger] = useState(0);

  const fetchOrders = () => {
    axios.get("/order", { params: { category: "Food" } })
      .then(response => {
        const { o, p, d } = distributeOrders(response.data);
        setOrdered(o);
        setProcessing(p);
        setDone(d);
        setTrigger(prev => prev + 1);
      })
      .catch(error => {
        console.error("Error fetching state data:", error);
        alertsManagerRef.current.showAlert('error', "Fehler bei der Datenabfrage.");
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Compute product summary counts regardless of the user and extras
  function summarizeProductTotals(groupedList) {
    const totals = {};
    for (const group of groupedList) {
      const productId = group.product.id;
      if (totals[productId]) {
        totals[productId].quantity += group.quantity;
      } else {
        totals[productId] = {
          productId,
          productName: group.product.name,
          quantity: group.quantity
        };
      }
    }
    return Object.values(totals);
  }

  useEffect(() => {
    setOverviewOrdered(summarizeProductTotals(ordered));
    setOverviewProcessing(summarizeProductTotals(processing));
    setOverviewDone(summarizeProductTotals(done));
  }, [trigger, ordered, processing, done]);

  // Group individual OrderItem database objects globally across all orders
  // strictly by userId and productId (ignoring extras)
  function distributeOrders(orders) {
    const o = {};
    const p = {};
    const d = {};

    for (const order of orders) {
      const userId = order.user.id;
      for (const item of order.orderItems) {
        if (item.product.category !== "Food") continue;

        const key = `${userId}_${item.product.id}`;
        const status = item.orderStatus;

        let targetMap;
        if (status === titles[0]) targetMap = o;
        else if (status === titles[1]) targetMap = p;
        else if (status === titles[2]) targetMap = d;

        if (targetMap) {
          if (targetMap[key]) {
            targetMap[key].quantity += 1;
            targetMap[key].items.push(item);
          } else {
            targetMap[key] = {
              key,
              id: item.id,
              userId,
              product: item.product,
              orderStatus: status,
              quantity: 1,
              items: [item], // original database orderItem entities
              selected: false
            };
          }
        }
      }
    }

    return {
      o: Object.values(o),
      p: Object.values(p),
      d: Object.values(d)
    };
  }

  const [sortOrders, setSortOrders] = useState({
    userId: 'asc',
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
      }

      if (aValue < bValue) return reverse ? 1 : -1;
      if (aValue > bValue) return reverse ? -1 : 1;
      return 0;
    });
  }

  const handleSetSelectedItems = (item) => {
    const existingIndex = selectedItems.findIndex(i => i.key === item.key);

    if (existingIndex !== -1) {
      // Remove selection
      const updatedItems = selectedItems.filter(i => i.key !== item.key);
      setSelectedItems(updatedItems);
      updateItemInArray(item.key, false);
    } else {
      // Add selection
      setSelectedItems([...selectedItems, { ...item, selected: true }]);
      updateItemInArray(item.key, true);
    }
  };

  const updateItemInArray = (itemKey, selectedStatus) => {
    const updateArray = (array, setArray) => {
      const updatedArray = array.map(i => 
        i.key === itemKey ? { ...i, selected: selectedStatus } : i
      );
      setArray(updatedArray);
    };

    updateArray(ordered, setOrdered);
    updateArray(processing, setProcessing);
    updateArray(done, setDone);
  };

  const handleNext = (group) => {
    const itemToProgress = group.items[0];
    if (!itemToProgress) return;

    // Single progression updates ONLY one item on the backend
    updateOrderItemState([itemToProgress], "progress");

    const currentStatus = group.orderStatus;
    let nextStatus = "";
    if (currentStatus === titles[0]) nextStatus = titles[1];
    else if (currentStatus === titles[1]) nextStatus = titles[2];

    if (!nextStatus) return;

    // A. Remove from the current column list (or decrement quantity)
    let updatedSourceList = [];
    const sourceList = currentStatus === titles[0] ? ordered : processing;
    
    for (const g of sourceList) {
      if (g.key === group.key) {
        if (g.quantity > 1) {
          updatedSourceList.push({
            ...g,
            quantity: g.quantity - 1,
            items: g.items.filter(i => i.id !== itemToProgress.id)
          });
        }
      } else {
        updatedSourceList.push(g);
      }
    }

    if (currentStatus === titles[0]) setOrdered(updatedSourceList);
    else setProcessing(updatedSourceList);

    // B. Add to the target column list (merge or create new group)
    const targetList = nextStatus === titles[1] ? processing : done;
    const setTargetList = nextStatus === titles[1] ? setProcessing : setDone;

    const updatedItem = { ...itemToProgress, orderStatus: nextStatus };
    const targetGroupKey = group.key;

    let merged = false;
    let updatedTargetList = targetList.map(g => {
      if (g.key === targetGroupKey) {
        merged = true;
        return {
          ...g,
          quantity: g.quantity + 1,
          items: [...g.items, updatedItem]
        };
      }
      return g;
    });

    if (!merged) {
      const newGroup = {
        key: targetGroupKey,
        id: updatedItem.id,
        userId: group.userId,
        product: group.product,
        orderStatus: nextStatus,
        quantity: 1,
        items: [updatedItem],
        selected: false
      };
      updatedTargetList.push(newGroup);
    }

    setTargetList(updatedTargetList);
    setTrigger(prev => prev + 1);
  };

  const handlePrevious = (group) => {
    const itemToRegress = group.items[0];
    if (!itemToRegress) return;

    updateOrderItemState([itemToRegress], "retrogress");

    const currentStatus = group.orderStatus;
    let prevStatus = "";
    if (currentStatus === titles[1]) prevStatus = titles[0];
    else if (currentStatus === titles[2]) prevStatus = titles[1];

    if (!prevStatus) return;

    // A. Remove from the current column list (or decrement quantity)
    let updatedSourceList = [];
    const sourceList = currentStatus === titles[1] ? processing : done;

    for (const g of sourceList) {
      if (g.key === group.key) {
        if (g.quantity > 1) {
          updatedSourceList.push({
            ...g,
            quantity: g.quantity - 1,
            items: g.items.filter(i => i.id !== itemToRegress.id)
          });
        }
      } else {
        updatedSourceList.push(g);
      }
    }

    if (currentStatus === titles[1]) setProcessing(updatedSourceList);
    else setDone(updatedSourceList);

    // B. Add to the target column list (merge or create new group)
    const targetList = prevStatus === titles[0] ? ordered : processing;
    const setTargetList = prevStatus === titles[0] ? setOrdered : setProcessing;

    const updatedItem = { ...itemToRegress, orderStatus: prevStatus };
    const targetGroupKey = group.key;

    let merged = false;
    let updatedTargetList = targetList.map(g => {
      if (g.key === targetGroupKey) {
        merged = true;
        return {
          ...g,
          quantity: g.quantity + 1,
          items: [...g.items, updatedItem]
        };
      }
      return g;
    });

    if (!merged) {
      const newGroup = {
        key: targetGroupKey,
        id: updatedItem.id,
        userId: group.userId,
        product: group.product,
        orderStatus: prevStatus,
        quantity: 1,
        items: [updatedItem],
        selected: false
      };
      updatedTargetList.push(newGroup);
    }

    setTargetList(updatedTargetList);
    setTrigger(prev => prev + 1);
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
        break;
    }
  };

  const handleMassSort = (arrayToSort, option) => {
    const filteredItems = selectedItems.filter(item => item.orderStatus === arrayToSort);
    const flatItems = filteredItems.flatMap(group => group.items);
    updateOrderItemsState(flatItems, option);

    const newOrdered = ordered.slice();
    const newProcessing = processing.slice();
    const newDone = done.slice();
    const newSelectedItems = selectedItems.slice();

    for (const item of filteredItems) {
      switch (item.orderStatus) {
        case titles[0]:
          newOrdered.splice(newOrdered.findIndex(i => i.key === item.key), 1);
          break;
        case titles[1]:
          newProcessing.splice(newProcessing.findIndex(i => i.key === item.key), 1);
          break;
        case titles[2]:
          newDone.splice(newDone.findIndex(i => i.key === item.key), 1);
          break;
        default:
          break;
      }

      item.orderStatus = option;
      item.selected = false;

      switch (option) {
        case titles[0]:
          newOrdered.push(item);
          break;
        case titles[1]:
          newProcessing.push(item);
          break;
        case titles[2]:
          newDone.push(item);
          break;
        default:
          break;
      }

      newSelectedItems.splice(newSelectedItems.findIndex(i => i.key === item.key), 1);
    }

    setOrdered(newOrdered);
    setProcessing(newProcessing);
    setDone(newDone);
    setSelectedItems(newSelectedItems);
    setTrigger(prev => prev + 1);
  };

  function updateOrderItemState(itemsList, direction) {
    axios.put("orderItem", itemsList, {
      params: { action: direction },
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
      alertsManagerRef.current.showAlert('success', response.data);
    })
    .catch(error => {
      alertsManagerRef.current.showAlert('error', error.response?.data || "Aktion fehlgeschlagen");
    });
  }

  function updateOrderItemsState(itemsList, target) {
    axios.put("orderItem", itemsList, {
      params: { state: target },
      headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
      alertsManagerRef.current.showAlert('success', response.data);
    })
    .catch(error => {
      alertsManagerRef.current.showAlert('error', error.response?.data || "Aktion fehlgeschlagen");
    });
  }

  const handleMultiSelect = (columnState, checked) => {
    let columnItems = [];
    if (columnState === titles[0]) columnItems = ordered;
    else if (columnState === titles[1]) columnItems = processing;
    else if (columnState === titles[2]) columnItems = done;

    const updatedColumnItems = columnItems.map(item => ({ ...item, selected: checked }));

    if (columnState === titles[0]) setOrdered(updatedColumnItems);
    else if (columnState === titles[1]) setProcessing(updatedColumnItems);
    else if (columnState === titles[2]) setDone(updatedColumnItems);

    if (checked) {
      setSelectedItems(prev => {
        const otherColumns = prev.filter(item => item.orderStatus !== columnState);
        return [...otherColumns, ...updatedColumnItems];
      });
    } else {
      setSelectedItems(prev => prev.filter(item => item.orderStatus !== columnState));
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <AlertsManager ref={alertsManagerRef} />

      {/* Modern Dashboard CSS Grid Layout for Guaranteed Equal Width Columns */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
        gap: 3,
        width: '100%',
        boxSizing: 'border-box'
      }}>
        
        {/* Column 1: Ordered */}
        <Box sx={{
          p: 2,
          borderRadius: '16px',
          background: "linear-gradient(135deg, rgba(8, 48, 54, 0.4) 0%, rgba(9, 12, 17, 0.6) 100%)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(25, 152, 161, 0.15)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          width: '100%'
        }}>
          <StateRowHeader 
            pHandleSort={handleSort} 
            displayState={"Bestellt"} 
            state={titles[0]} 
            color="error" 
            number={ordered?.length || 0} 
          />
          <StateRowSubHeader 
            pHandleSort={handleMassSort} 
            state={titles[0]} 
            number={selectedItems.filter(item => item.orderStatus === titles[0]).length} 
            totalItems={ordered?.length || 0}
            titles={titles} 
            pHandleMultiSelect={handleMultiSelect}
          />
          <StateOverviewItem displayItems={overviewOrdered} />
          
          <Box sx={{ flexGrow: 1, overflowY: 'auto', mt: 0.5, width: '100%', boxSizing: 'border-box', pr: 0.5 }}>
            {ordered?.length ? (
              ordered.map((group) => (
                <StateItem 
                  key={group.key} 
                  data={group} 
                  next={handleNext} 
                  previous={handlePrevious} 
                  pHandleSetSelectedITems={handleSetSelectedItems}
                />
              ))
            ) : (
              <Typography variant="body2" sx={{ color: '#8898a5', textAlign: 'center', py: 4 }}>
                Keine Bestellungen
              </Typography>
            )}
          </Box>
        </Box>

        {/* Column 2: In Bearbeitung */}
        <Box sx={{
          p: 2,
          borderRadius: '16px',
          background: "linear-gradient(135deg, rgba(8, 48, 54, 0.4) 0%, rgba(9, 12, 17, 0.6) 100%)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(25, 152, 161, 0.15)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          width: '100%'
        }}>
          <StateRowHeader 
            pHandleSort={handleSort} 
            displayState={"In Bearbeitung"} 
            state={titles[1]} 
            color="warning" 
            number={processing?.length || 0} 
          />
          <StateRowSubHeader 
            pHandleSort={handleMassSort} 
            state={titles[1]} 
            number={selectedItems.filter(item => item.orderStatus === titles[1]).length} 
            totalItems={processing?.length || 0}
            titles={titles} 
            pHandleMultiSelect={handleMultiSelect}
          />
          <StateOverviewItem displayItems={overviewProcessing} />

          <Box sx={{ flexGrow: 1, overflowY: 'auto', mt: 0.5, width: '100%', boxSizing: 'border-box', pr: 0.5 }}>
            {processing?.length ? (
              processing.map((group) => (
                <StateItem 
                  key={group.key} 
                  data={group} 
                  next={handleNext} 
                  previous={handlePrevious} 
                  pHandleSetSelectedITems={handleSetSelectedItems}
                />
              ))
            ) : (
              <Typography variant="body2" sx={{ color: '#8898a5', textAlign: 'center', py: 4 }}>
                Keine Bearbeitungen
              </Typography>
            )}
          </Box>
        </Box>

        {/* Column 3: Fertig */}
        <Box sx={{
          p: 2,
          borderRadius: '16px',
          background: "linear-gradient(135deg, rgba(8, 48, 54, 0.4) 0%, rgba(9, 12, 17, 0.6) 100%)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(25, 152, 161, 0.15)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          width: '100%'
        }}>
          <StateRowHeader 
            pHandleSort={handleSort} 
            displayState={"Fertig"} 
            state={titles[2]} 
            color="success" 
            number={done?.length || 0} 
            />
          <StateRowSubHeader 
            pHandleSort={handleMassSort} 
            state={titles[2]} 
            number={selectedItems.filter(item => item.orderStatus === titles[2]).length} 
            totalItems={done?.length || 0}
            titles={titles} 
            pHandleMultiSelect={handleMultiSelect}
          />
          <StateOverviewItem displayItems={overviewDone} />

          <Box sx={{ flexGrow: 1, overflowY: 'auto', mt: 0.5, width: '100%', boxSizing: 'border-box', pr: 0.5 }}>
            {done?.length ? (
              done.map((group) => (
                <StateItem 
                  key={group.key} 
                  data={group} 
                  next={handleNext} 
                  previous={handlePrevious} 
                  pHandleSetSelectedITems={handleSetSelectedItems}
                />
              ))
            ) : (
              <Typography variant="body2" sx={{ color: '#8898a5', textAlign: 'center', py: 4 }}>
                Keine Fertiggestellten
              </Typography>
            )}
          </Box>
        </Box>

      </Box>
    </Container>
  );
}

export default State;