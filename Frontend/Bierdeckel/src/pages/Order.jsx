import React, { useState, useEffect, useCallback, useRef } from "react";

import axios from "axios";

import Box from "@mui/material/Box";
import { Tab } from "@mui/material";
import { TabList, TabPanel, TabContext } from '@mui/lab';
import Stack from "@mui/material/Stack";
import RestaurantIcon from "@mui/icons-material/Restaurant";
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
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [userCardItems, setUserCardItems] = React.useState([]); // Raw DB data with items of the selected user
  const [cardMetadata, setCardMetadata] = React.useState({total: 0, itemCount: 0}); 
  const [displayItems, setDisplayItems] = useState([]); // Items sorted to have a quantity
  const alertsManagerRef =  useRef(AlertsContext);

  const fetchProductsAndDrinks = useCallback(async () => {
    try {
      const [productsResponse, drinksResponse] = await Promise.all([
        axios.get("http://localhost:8080/products", { params: { category: "food" } }),
        axios.get("http://localhost:8080/products", { params: { category: "drinks" } })
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
    console.log("calling with:" + selectedUser.id);
    axios
      .get("http://localhost:8080/order", {
        params: {
          userId: selectedUser.id,
        },
      })
      .then((response) => {
        setTimeout(() => {
          if (response.data && response.data.length) {
            setUserCardItems(response.data[0].orderItems);
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
  }, [selectedUser]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  //Reset card in case of new/invalide user withoud data 
  const clearShoppingcard = () =>
  {
    setCardMetadata({total: 0, itemCount: 0});
    setUserCardItems([]);
  }

  const addItemToShoppingcard = (item) =>
  {
    let nextId = userCardItems.length > 0 ? userCardItems[userCardItems.length - 1].id + 1 : 1;
    // setUserCardItems([...userCardItems, item]);
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

  const handleUserSelectionChange = (event, newValue) => {
    console.log("userChanged", newValue);
    setSelectedUser({ ...newValue });
  };

  function stockChange(id, action) {
    //Add dsiplay items
    if (action == "add") 
    {
      const productToAdd = products.find((prod) => prod.id === id);
      
      if (productToAdd) {
        addItemToShoppingcard(productToAdd);
      }
    } 
    else if (action == "rm") 
    {
      const indexToRemove = userCardItems.findIndex((prod) => prod.product.id === id);
      const productToAdd = products.find((prod) => prod.id === id);
      
      if(userCardItems.length > 1){
        setCardMetadata((prevMetadata) => ({
          ...prevMetadata,
          total: prevMetadata.total - productToAdd.price,
      }));
      }else{
        console.log("ist 0")
        clearShoppingcard();
      }

      if (indexToRemove !== -1) {
        // Remove at the specified index using splice
        const updatedNewItems = [...userCardItems]; // Create a copy
        updatedNewItems.splice(indexToRemove, 1); // Remove one item
        setUserCardItems(updatedNewItems);

      }
    } 
    else if(action == "clear")
    {
       // Filter items and calculate values to update metadata
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
          displayITems={userCardItems}
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
            <Tab icon={<RestaurantIcon />} value="1" label="Essen" />
            <Tab icon={<SportsBarIcon />} value="2" label="Trinken" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <OrderFood
            // currentUserId={selectedUser ? selectedUser.id : null}
            products={products}
            handleStockChange={stockChange}
            displayITems={displayItems}
          />
        </TabPanel>
        <TabPanel value="2">
          <OrderDrinks />
        </TabPanel>
      </TabContext>

      <pre>{JSON.stringify(cardMetadata, null, 2)}</pre>
      <pre>{JSON.stringify(userCardItems, null, 2)}</pre>
    </Box>
  );
}
