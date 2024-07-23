import * as React from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import Products from '../components/inventory/Products';
import Extras from '../components/inventory/Extras';

import LunchDiningIcon from '@mui/icons-material/LunchDining';
import KitchenIcon from '@mui/icons-material/Kitchen';
import SportsBarIcon from '@mui/icons-material/SportsBar';

export default function LabTabs() {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      {/* <ThemeProvider theme={theme}> */}
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList textColor="primary" indicatorColor="primary" onChange={handleChange} aria-label="lab API tabs example" centered >
              <Tab icon={<LunchDiningIcon />} value="1" label="Essen" />
              <Tab icon={<SportsBarIcon />} value="2" label="Trinken" />
              <Tab icon={<KitchenIcon />} value="3" label="Extras" />
          </TabList>
            </Box>
        <TabPanel value="1">
            <Products productCategory={"Food"}/>
        </TabPanel>
        <TabPanel value="2">
            <Products productCategory={"Drink"}/>
        </TabPanel>
        <TabPanel value="3">
            <Extras/>
        </TabPanel>
      </TabContext>
      {/* </ThemeProvider> */}
    </Box>
  );
}
