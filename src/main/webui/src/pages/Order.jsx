import React, { useState, useEffect, useCallback, useRef } from "react";

import axios from "axios";

import Box from "@mui/material/Box";
import { Tab } from "@mui/material";
import { TabList, TabPanel, TabContext } from '@mui/lab';
import Stack from "@mui/material/Stack";
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import SportsBarIcon from "@mui/icons-material/SportsBar";

import OrderFood from "../components/order/OrderFood";
import OrderDrinks from "../components/order/OrderDrinks";
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
        axios.get("products", { params: { category: "food" } }),
        axios.get("products", { params: { category: "drinks" } })
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
  }, [fetchProductsAndDrinks]);

  useEffect(() => {
    if (
      selectedUser == null ||
      typeof selectedUser.id === "undefined" ||
      selectedUser.id <= 0
    ) {
      clearShoppingcard(); // Reset shopping Card if no user is defined
      return;
    }
    console.log("selectedUser", selectedUser);
    axios
      .get("/order", {
        params: {
          userId: selectedUser.id,
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
            clearShoppingcard();
          }
        }, 0);
      })
      .catch((error) => {
        console.log(error);
        alertsManagerRef.current.showAlert('error', "Fehler beim Abfragen der Userdaten");

      });
  }, [selectedUser, orderDeleted]);

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

  const rmItemFromShoppingcard = (item) =>
  {
    const indexToRemove = userCardItems.findIndex((prod) => prod.product.id === item.id);
    if (indexToRemove !== -1) {
      const updatedNewItems = [...userCardItems]; // Create a copy
      updatedNewItems.splice(indexToRemove, 1); // Remove one item
      setUserCardItems(updatedNewItems);
      setCardMetadata((prevMetadata) => ({
        ...prevMetadata,
        total: Math.max(prevMetadata.total - item.price, 0),
        itemCount: prevMetadata.itemCount - 1
      }));
    }
  }

  const addItemToShoppingcard = (item) =>
  {
    let nextId = userCardItems.length > 0 ? userCardItems[userCardItems.length - 1].id + 1 : 1;
    const orderItem = {
      id: nextId,
      orderStatus: "ORDERED",
      paymentStatus: "UNPAID",
      product: item
    };
    setUserCardItems([...userCardItems, orderItem]);
    setCardMetadata((prevMetadata) => ({
      ...prevMetadata, // Keep existing properties
      total: prevMetadata.total + item.price,
      itemCount: prevMetadata.itemCount + 1
  }));
  }

  const clearShoppingcard2 = () => {
    // Loop through each item in the shopping cart
    userCardItems.forEach((item) => {
      // Find the product in the products array
      const indexToModify = products.findIndex((prod) => prod.id === item.product.id);
      if (indexToModify !== -1) {
        // Increment the stock of the product
        const productToModify = {...products[indexToModify]};
        productToModify.stock += 1;
        const newProducts = [...products];
        newProducts[indexToModify] = productToModify;
        setProducts(newProducts);
      }
    });

    // Clear the shopping cart
    setUserCardItems([]);
    setCardMetadata({
      total: 0,
      itemCount: 0
    });
  }

  const handleUserSelectionChange = (event, newValue) => {
    console.log("userChanged", newValue);
    setSelectedUser({ ...newValue });
  };

/**
 * Updates the shopping card based on the given action.
 *
 * @param {string} id - The ID of the product to add or remove.
 * @param {string} action - The action to perform ("add", "rm", or "clear").
 * @return {void} This function does not return anything.
 */
  function stockChange(id, action) {
    //Add dsiplay items
    if (action == "add") {
      const indexToModify = products.findIndex((prod) => prod.id === id);
      if (indexToModify !== -1) {
        const productToModify = {...products[indexToModify]};
        productToModify.stock -= 1;
        const newProducts = [...products];
        newProducts[indexToModify] = productToModify;
        setProducts(newProducts);
        addItemToShoppingcard(productToModify);
      }
    }
    else if (action == "rm") {
      const indexToModify = products.findIndex((prod) => prod.id === id);
      if (indexToModify !== -1) {
        const productToModify = {...products[indexToModify]};
        productToModify.stock += 1;
        const newProducts = [...products];
        newProducts[indexToModify] = productToModify;
        setProducts(newProducts);
        rmItemFromShoppingcard(productToModify);
      }
    }
    else if(action == "clear") {
        let totalPriceToRemove = 0;
        let itemsToRemoveCount = 0;

        const updatedNewItems = userCardItems.filter((prod) => {
            if (prod.product.id === id) {
                totalPriceToRemove += prod.product.price;
                itemsToRemoveCount++;
                return false; // Exclude
            } else {
                return true;  // Keep
            }
        });

        setUserCardItems(updatedNewItems);

        const indexToModify = products.findIndex((prod) => prod.id === id);
        if (indexToModify !== -1) {
          const productToModify = {...products[indexToModify]};
          productToModify.stock += itemsToRemoveCount;
          const newProducts = [...products];
          newProducts[indexToModify] = productToModify;
          setProducts(newProducts);
        }

        // Update cardMetadata
        setCardMetadata((prevMetadata) => ({
            ...prevMetadata, // Keep existing properties
            total: prevMetadata.total - totalPriceToRemove,
            itemCount: prevMetadata.itemCount - itemsToRemoveCount
        }));
    }
    else {
      console.log("nope");
    }
  }

  function placeOrder() {
    console.log("placing order", userCardItems);
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
    console.log(orderId);
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
          <OrderFood
            // currentUserId={selectedUser ? selectedUser.id : null}
            products={products}
            handleStockChange={stockChange}
            displayItems={displayItems}
          />
        </TabPanel>
        <TabPanel value="2">
          <OrderDrinks />
        </TabPanel>
      </TabContext>

      {/* <pre>{JSON.stringify(cardMetadata, null, 2)}</pre> */}
      {/* <pre style={{ color: 'white' }}>{JSON.stringify(userCardItems, null, 4)}</pre> */}
    </Box>
  );
}
