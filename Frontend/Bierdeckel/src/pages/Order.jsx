import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';

import OrderFood from '../components/order/OrderFood'
import OrderDrinks from '../components/order/OrderDrinks'

import RestaurantIcon from '@mui/icons-material/Restaurant';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import ShoppingCart from '../components/order/shoppingcard';
import Userselection from '../components/order/userSelection';
import Stack from '@mui/material/Stack';



export default function Order() {
  const [value, setValue] = React.useState('1');
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [userShoppingCard, setUserShoppingCard] = React.useState(null);
  const [newCardItem, setNewCardItems] = useState([]);

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const handleUserSelectionChange = (event, newValue) => {
    console.log("userChanged")
    setSelectedUser({ ...newValue });
  };

  const handleUserShoppingCardChange = (values) =>{
    console.log("neu")
    setUserShoppingCard({ ...values});
  }

  function stockChange(id, action)
  {
      if(action == "add")
      {
          const productToAdd = products.find(prod => prod.id === id);
          console.log("hinzufügen");
          if (productToAdd) {
              // Create a NEW array with the item included
              setNewItems([...newCardItem, productToAdd]);
            } else {
              console.log("nein", id); // Assuming you kept this for logging 
            }

      }
      else if(action == "rm")
      {
          const indexToRemove = newCardItem.findIndex(prod => prod.id === id);

          if (indexToRemove !== -1) {
          // Remove at the specified index using splice
          const updatedNewItems = [...newCardItem]; // Create a copy
          updatedNewItems.splice(indexToRemove, 1); // Remove one item
          setNewCardItems(updatedNewItems);
  }
      }
      else{
          console.log("nope")
      }
  }
  
  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
          <Stack  direction="row" spacing={2}  justifyContent="center" alignItems="center" 
              sx={{ padding:1}}>
            <ShoppingCart 
              cardData={userShoppingCard} 
              handleShoppingCard={handleUserShoppingCardChange} 
              newItems={newCardItem}
              handleStockChange={stockChange}
              />
            <Userselection  handleUserChange={handleUserSelectionChange}/>
          </Stack>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList textColor="primary" indicatorColor="primary" onChange={handleChange} aria-label="lab API tabs example" centered >
            <Tab icon={<RestaurantIcon />}  value="1" label="Essen"/>
            <Tab icon={<SportsBarIcon />}   value="2"label="Trinken" />
          </TabList>
            </Box>
        <TabPanel value="1">
            <OrderFood  currentUserId={selectedUser ? selectedUser.id : null} 
            handleShoppingCard={handleUserShoppingCardChange}
            newItems={newCardItem}
            handleStockChange={stockChange}/>
        </TabPanel>
        <TabPanel value="2">
            <OrderDrinks/>
        </TabPanel>
      </TabContext>
    </Box>
  );
}