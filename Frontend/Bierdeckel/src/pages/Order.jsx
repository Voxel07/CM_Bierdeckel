import React, { useState, useEffect } from "react";
import axios from "axios";

import Box from "@mui/material/Box";
import Tab from "@material-ui/core/Tab";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";

import OrderFood from "../components/order/OrderFood";
import OrderDrinks from "../components/order/OrderDrinks";

import RestaurantIcon from "@mui/icons-material/Restaurant";
import SportsBarIcon from "@mui/icons-material/SportsBar";
import ShoppingCart from "../components/order/shoppingcard";
import Userselection from "../components/order/userSelection";
import Stack from "@mui/material/Stack";
import { summarizeOrderItems } from "../components/order/orderUtils";

export default function Order() {
  const [tabValue, setTabValue] = React.useState("1");
  const [products, setProducts] = useState([]);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [cardItems, setCardItems] = React.useState([]); 
  const [cardMetadata, setCardMetadata] = React.useState({total: 0, itemCount: 0}); 
  const [displayItems, setDisplayItems] = useState([]); // Items sorted to have a quantity

  useEffect(() => {
  const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/products", {
          params: { category: "food" }
        });
        setProducts(response.data); // Assuming response.data is already an array
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

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
            setCardItems(response.data[0].orderItems);
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
      });
  }, [selectedUser]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  //Reset card in case of new/invalide user withoud data 
  const clearShoppingcard = () =>
  {
    setCardMetadata({total: 0, itemCount: 0});
    setCardItems([]);
  }
  const addItemToShoppingcard = (item) =>
  {
    let nextId = cardItems.length > 0 ? cardItems[cardItems.length - 1].id + 1 : 1;
    // setCardItems([...cardItems, item]);
    const orderItem = {
      id: nextId,
      orderStatus: "ORDERED",
      paymentStatus: "UNPAID",
      product: item 
    };
    setCardItems([...cardItems, orderItem]);
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
    if (action == "add") 
    {
      const productToAdd = products.find((prod) => prod.id === id);
      
      if (productToAdd) {
        addItemToShoppingcard(productToAdd);
      }
    } 
    else if (action == "rm") 
    {
      const indexToRemove = cardItems.findIndex((prod) => prod.product.id === id);
      const productToAdd = products.find((prod) => prod.id === id);
      
      if(cardItems.length > 1){
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
        const updatedNewItems = [...cardItems]; // Create a copy
        updatedNewItems.splice(indexToRemove, 1); // Remove one item
        setCardItems(updatedNewItems);

      }
    } 
    else if(action == "clear")
    {
       // Filter items and calculate values to update metadata
        let totalPriceToRemove = 0;
        let itemsToRemoveCount = 0;

        const updatedNewItems = cardItems.filter((prod) => {
            if (prod.product.id === id) {
                totalPriceToRemove += prod.product.price;
                itemsToRemoveCount++; 
                return false; // Exclude
            } else {
                return true;  // Keep
            }
        });

        setCardItems(updatedNewItems);

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
          displayITems={displayItems}
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
      <pre>{JSON.stringify(cardItems, null, 2)}</pre>
    </Box>
  );
}
