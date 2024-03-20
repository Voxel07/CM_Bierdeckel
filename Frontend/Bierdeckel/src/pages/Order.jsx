import * as React from 'react';

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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleUserSelectionChange = (event, newValue) => {
    setSelectedUser({ ...newValue });
    console.log(selectedUser)
    console.log("userChanged")
  };


  return (
    <Box sx={{ width: '100%', typography: 'body1', background:"primary" }}>
        <Box>
          <Stack  direction="row" spacing={2}  justifyContent="center" alignItems="center">
            <ShoppingCart/>
            <Userselection  handleUserChange={handleUserSelectionChange}/>

          </Stack>
        </Box>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList textColor="primary" indicatorColor="primary" onChange={handleChange} aria-label="lab API tabs example" centered >
            <Tab icon={<RestaurantIcon />}  value="1" label="Essen"/>
            <Tab icon={<SportsBarIcon />}   value="2"label="Trinken" />
          </TabList>
            </Box>
        <TabPanel value="1">
            <OrderFood  currentUserId={selectedUser ? selectedUser.id : null}/>
        </TabPanel>
        <TabPanel value="2">
            <OrderDrinks/>
        </TabPanel>
      </TabContext>
    </Box>
  );
}