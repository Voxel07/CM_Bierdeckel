import React, { useState, useEffect, useCallback, useRef } from "react";

import axios from "axios";

import Box from "@mui/material/Box";
import { Tab } from "@mui/material";
import { TabList, TabPanel, TabContext } from '@mui/lab';
import Stack from "@mui/material/Stack";
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import SportsBarIcon from "@mui/icons-material/SportsBar";

import OrderItems from "../components/order/OrderItems";
import ShoppingCart from "../components/order/shoppingcard";
import Userselection from "../components/order/userSelection";
import { summarizeOrderItems } from "../components/order/orderUtils";
import { AlertsManager , AlertsContext } from '../utils/AlertsManager';


export default function Order() {
  const [tabValue, setTabValue] = React.useState("1");
  const [products, setProducts] = useState([]); // Raw data from DB
  const [drinks, setDrinks] = useState([]);
  const [selectedUser, setSelectedUser] = React.useState({label: "1", id: 1});
  const [userCardItems, setUserCardItems] = React.useState([]); // Raw DB data with items of the selected user
  const [orderId, setOrderId] = React.useState(0);
  const [orderDeleted, setOrderDeleted] = React.useState(false);
  const [cardMetadata, setCardMetadata] = React.useState({total: 0, itemCount: 0});
  const [displayItems, setDisplayItems] = useState([]); // Items sorted to have a quantity
  const alertsManagerRef =  useRef(AlertsContext);


  const fetchProductsAndDrinks = useCallback(async () => {
    try {
      const [productsResponse, drinksResponse] = await Promise.all([
        axios.get("products", { params: { category: "Food" } }),
        axios.get("products", { params: { category: "Drink" } })
      ]);

      setProducts(productsResponse.data);
      setDrinks(drinksResponse.data);
    } catch (error) {
      console.error("Error fetching products and drinks:", error);
      alertsManagerRef.current.showAlert('error', "Fehler bei der der Datenabfrage");
    }
  }, []);

  useEffect(() => {
    fetchProductsAndDrinks();
  }, [fetchProductsAndDrinks, orderDeleted]);


  //Fetch the oder of the selected user
  useEffect(() => {
    if (
      selectedUser == null ||
      typeof selectedUser.id === "undefined" ||
      selectedUser.id <= 0
    ) {
      clearShoppingcard(); // Reset shopping Card if no user is defined
      return;
    }
    axios
      .get("/order", {
        params: {
          userId: selectedUser.id,
          completed: false
        },
      })
      .then((response) => {
        setTimeout(() => {
          if (response.data && response.data.length) {
            setUserCardItems(response.data[0].orderItems);
            setOrderId(response.data[0].id);
            setCardMetadata({total: response.data[0].sum, itemCount: response.data[0].orderItems.length})
            setDisplayItems(
              summarizeOrderItems(response.data[0].orderItems)
            );
          } else {
            setOrderId(null);
            clearShoppingcard();
          }
        }, 0);
      })
      .catch((error) => {
        console.log(error);
        alertsManagerRef.current.showAlert('error', "Fehler beim Abfragen der Userdaten");

      });
  }, [selectedUser]);

  useEffect(() => {
    setDisplayItems(summarizeOrderItems(userCardItems));
  }, [userCardItems]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  //Reset card in case of new/invalide user withoud data
  const clearShoppingcard = () =>
  {
    setCardMetadata({total: 0, itemCount: 0});
    setUserCardItems([]);
  }

  const rmItemFromShoppingcard = (item, extraItem) => {
    const indexToRemove = userCardItems.findIndex((cartItem) => 
      cartItem.product.id === item.id && 
      ((cartItem.extraItem && extraItem && cartItem.extraItem.id === extraItem.id) || 
       (!cartItem.extraItem && !extraItem))
    );
    
    if (indexToRemove !== -1) {
      const updatedNewItems = [...userCardItems];
      updatedNewItems.splice(indexToRemove, 1);
      setUserCardItems(updatedNewItems);
      setCardMetadata((prevMetadata) => ({
        ...prevMetadata,
        total: Math.max(prevMetadata.total - item.price - (extraItem ? extraItem.price : 0), 0),
        itemCount: prevMetadata.itemCount - 1
      }));
    }
  };

  const addItemToShoppingcard = (item, extraItem) =>
  {
    let nextId = userCardItems.length > 0 ? userCardItems[userCardItems.length - 1].id + 1 : 1;
    const orderItem = {
      id: nextId,
      orderStatus: "ORDERED",
      paymentStatus: "UNPAID",
      product: item,
      ...(extraItem !== null && { extraItem })
    };
    setUserCardItems([...userCardItems, orderItem]);
    setCardMetadata((prevMetadata) => ({
      ...prevMetadata, // Keep existing properties
      total: prevMetadata.total + item.price + (extraItem ? extraItem.price : 0),
      itemCount: prevMetadata.itemCount + 1
  }));
  }

  const handleUserSelectionChange = (event, newValue) => {
    setSelectedUser({ ...newValue });
  };

/**
 * Updates the shopping card based on the given action.
 *
 * @param {string} id - The ID of the product to add or remove.
 * @param {string} action - The action to perform ("add", "rm", or "clear").
 * @return {void} This function does not return anything.
 */
function stockChange(id, action, category, extraItem) {
  console.log(extraItem);

  const isProduct = category === 'Food';
  const items = isProduct ? products : drinks;
  const setItems = isProduct ? setProducts : setDrinks;
  // const addItemToCart =  addItemToShoppingcard;
  // const rmItemFromCart =  rmItemFromShoppingcard;
  // const cartItems =  userCardItems;
  // const setCartItems =  setUserCardItems;

  if (action === "add") {
    const indexToModify = items.findIndex((item) => item.id === id);
    if (indexToModify !== -1) {
      const itemToModify = {...items[indexToModify]};
      itemToModify.stock -= 1;
      const newItems = [...items];
      newItems[indexToModify] = itemToModify;
      setItems(newItems);
      addItemToShoppingcard(itemToModify, extraItem);
    }
  }
  else if (action === "rm") {
    const indexToModify = items.findIndex((item) => item.id === id);
    if (indexToModify !== -1) {
      const itemToModify = {...items[indexToModify]};
      itemToModify.stock += 1;
      const newItems = [...items];
      newItems[indexToModify] = itemToModify;
      setItems(newItems);
      rmItemFromShoppingcard(itemToModify, extraItem);
    }
  }
  else if(action === "clear") {
    let totalPriceToRemove = 0;
    let itemsToRemoveCount = 0;

    const updatedCartItems = userCardItems.filter((item) => {
      if (cartItem.product.id === id && ((cartItem.extraItem && extraItem && cartItem.extraItem.id === extraItem.id) || (!cartItem.extraItem && !extraItem))){
          totalPriceToRemove += cartItem.product.price + (cartItem.extraItem ? cartItem.extraItem.price : 0);
          itemsToRemoveCount++;
          return false;
        } else {
        return true;
      }});

    setUserCardItems(updatedCartItems);

    const indexToModify = items.findIndex((item) => item.id === id);
    if (indexToModify !== -1) {
      const itemToModify = {...items[indexToModify]};
      itemToModify.stock += itemsToRemoveCount;
      const newItems = [...items];
      newItems[indexToModify] = itemToModify;
      setItems(newItems);
    }

    // Update cardMetadata
    setCardMetadata((prevMetadata) => ({
      ...prevMetadata,
      total: prevMetadata.total - totalPriceToRemove,
      itemCount: prevMetadata.itemCount - itemsToRemoveCount
    }));
  }
  else {
    console.log("nope");
  }
}

  function placeOrder() {
    axios.post("/order", JSON.stringify(userCardItems), {
      params: {
        userId: selectedUser.id
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        alertsManagerRef.current.showAlert('success', "Bestellung erfolgreich. "+ response.data);
      })
      .catch((error) => {
        console.log(error);
        alertsManagerRef.current.showAlert('error', "Fehler bei der Bestellung. "+ error.response.data);
      });
  }

  function updateOrder() {
    console.log("updating order", userCardItems);
    console.log("userId", selectedUser.id);
    axios.put("/order", JSON.stringify(userCardItems), {
      params: {
        userId: selectedUser.id
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        alertsManagerRef.current.showAlert('success', "Bestellung erfolgreich. "+ response.data);
      })
      .catch((error) => {
        console.log(error);
        alertsManagerRef.current.showAlert('error', "Fehler bei der Bestellung. "+ error.response.data);
      });
  }

  function deleteOrder() {
    axios.delete("/order", {
      data: { id: orderId }
    })
      .then((response) => {
        alertsManagerRef.current.showAlert('success', "Bestellung erfolgreich gelöscht. "+ response.data);
        setOrderDeleted(true);
      })
      .catch((error) => {
        console.log(error);
        alertsManagerRef.current.showAlert('error', "Fehler beim löschen. "+ orderId + error.response.data);
      });
  }

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <AlertsManager ref={alertsManagerRef} />
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        alignItems="center"
        sx={{ padding: 1 }}
      >
        <ShoppingCart
          cardData={cardMetadata}
          handleStockChange={stockChange}
          displayItems={displayItems}
          placeOrder={placeOrder}
          updateOrder={updateOrder}
          deleteOrder={deleteOrder}
          orderId={orderId}
        />
        <Userselection handleUserChange={handleUserSelectionChange} />
      </Stack>
      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            textColor="primary"
            indicatorColor="primary"
            onChange={handleTabChange}
            aria-label="lab API tabs example"
            centered
          >
            <Tab icon={<LunchDiningIcon />} value="1" label="Essen" />
            <Tab icon={<SportsBarIcon />} value="2" label="Trinken" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <OrderItems
            // currentUserId={selectedUser ? selectedUser.id : null}
            products={products}
            handleStockChange={stockChange}
            displayItems={displayItems}
          />
        </TabPanel>
        <TabPanel value="2">
        <OrderItems
            // currentUserId={selectedUser ? selectedUser.id : null}
            products={drinks}
            handleStockChange={stockChange}
            displayItems={displayItems}
          />
        </TabPanel>
      </TabContext>

      {/* <pre>{JSON.stringify(cardMetadata, null, 2)}</pre> */}
      {/* <pre style={{ color: 'white' }}>{JSON.stringify(userCardItems, null, 4)}</pre> */}
    </Box>
  );
}
