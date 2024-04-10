import * as React from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import Products from '../components/inventory/Products';
import Extras from '../components/inventory/Extras';

import FastfoodIcon from '@mui/icons-material/Fastfood';
import KitchenIcon from '@mui/icons-material/Kitchen';

export default function LabTabs() {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList textColor="primary" indicatorColor="primary" onChange={handleChange} aria-label="lab API tabs example" centered >
            <Tab icon={<FastfoodIcon />}  value="1" label="Produkte"/>
            <Tab icon={<KitchenIcon />}   value="2"label="Extras" />
          </TabList>
            </Box>
        <TabPanel value="1">
            <Products />
        </TabPanel>
        <TabPanel value="2">
            <Extras/>
        </TabPanel>
      </TabContext>
    </Box>
  );
}