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
import { subscribeToWebSocket } from '../utils/websocket';

export default function LabTabs() {
  const [value, setValue] = React.useState('1');
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  React.useEffect(() => {
    const unsubscribe = subscribeToWebSocket((msg) => {
      if (msg === 'products' || msg === 'extras') {
        setRefreshTrigger(prev => prev + 1);
      }
    });
    return unsubscribe;
  }, []);

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
            <Products productCategory={"Food"} refreshTrigger={refreshTrigger}/>
        </TabPanel>
        <TabPanel value="2">
            <Products productCategory={"Drink"} refreshTrigger={refreshTrigger}/>
        </TabPanel>
        <TabPanel value="3">
            <Extras refreshTrigger={refreshTrigger}/>
        </TabPanel>
      </TabContext>
      {/* </ThemeProvider> */}
    </Box>
  );
}
