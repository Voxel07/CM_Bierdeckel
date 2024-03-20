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

export default function LabTabs() {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
        <Box> Test </Box>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList textColor="primary" indicatorColor="primary" onChange={handleChange} aria-label="lab API tabs example" centered >
            <Tab icon={<RestaurantIcon />}  value="1" label="Essen"/>
            <Tab icon={<SportsBarIcon />}   value="2"label="Trinken" />
          </TabList>
            </Box>
        <TabPanel value="1">
            <OrderFood />
        </TabPanel>
        <TabPanel value="2">
            <OrderDrinks/>
        </TabPanel>
      </TabContext>
    </Box>
  );
}