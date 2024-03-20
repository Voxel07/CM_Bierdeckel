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
  const [userShoppingCard, setUserShoppingCard] = React.useState(null); //Items from the DB
  const [newCardItem, setNewCardItems] = useState([]); // Items added only in FE
  const [shoppingCardItems, setShoppingCardItems] = useState([]); // Items sorted to have a quantity

  useEffect(() => {
    axios
      .get("http://localhost:8080/products", {
        params: {
          category: "food",
        },
      })
      .then((response) => {
        setTimeout(() => {
          setProducts(response.data);
        }, 0);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (
      selectedUser == null ||
      typeof selectedUser.id === "undefined" ||
      selectedUser.id <= 0
    ) {
      setUserShoppingCard(0);
      setShoppingCardItems(0);
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
            handleUserShoppingCardChange(response.data[0]);
            setShoppingCardItems(
              summarizeOrderItems(response.data[0].orderItems)
            );
          } else {
          }
        }, 0);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [selectedUser]);

  const handleTabChange = (newValue) => {
    setTabValue(newValue);
  };

  const handleUserSelectionChange = (event, newValue) => {
    console.log("userChanged", newValue);
    setSelectedUser({ ...newValue });
  };

  const handleUserShoppingCardChange = (values) => {
    console.log("handleUserShoppingCardChange");
    console.log(values);
    setUserShoppingCard({ ...values });
  };

  function stockChange(id, action) {
    if (action == "add") {
      const productToAdd = products.find((prod) => prod.id === id);
      console.log("hinzufügen");
      if (productToAdd) {
        // Create a NEW array with the item included
        setNewItems([...newCardItem, productToAdd]);
      } else {
        console.log("nein", id); // Assuming you kept this for logging
      }
    } else if (action == "rm") {
      const indexToRemove = newCardItem.findIndex((prod) => prod.id === id);

      if (indexToRemove !== -1) {
        // Remove at the specified index using splice
        const updatedNewItems = [...newCardItem]; // Create a copy
        updatedNewItems.splice(indexToRemove, 1); // Remove one item
        setNewCardItems(updatedNewItems);
      }
    } else {
      console.log("nope");
    }
  }

  const handleDisplayChange = () => {};

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
          cardData={userShoppingCard}
          handleShoppingCard={handleUserShoppingCardChange}
          newItems={newCardItem}
          handleStockChange={stockChange}
          displayITems={shoppingCardItems}
          handleDisplayItemChange={handleDisplayChange}
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
            newItems={newCardItem}
            handleStockChange={stockChange}
            displayITems={shoppingCardItems}
            handleDisplayItemChange={handleDisplayChange}
          />
        </TabPanel>
        <TabPanel value="2">
          <OrderDrinks />
        </TabPanel>
      </TabContext>
      {/* <pre>{JSON.stringify(userShoppingCard, null, 2)}</pre> */}
    </Box>
  );
}
