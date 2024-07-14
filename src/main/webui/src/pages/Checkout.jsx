import React, { useEffect, useState, useRef } from "react";
import { AlertsManager , AlertsContext } from '../utils/AlertsManager';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import LunchDiningIcon from '@mui/icons-material/LunchDining';
import KitchenIcon from '@mui/icons-material/Kitchen';
import SportsBarIcon from '@mui/icons-material/SportsBar';

import Orders from '../components/checkout/Orders';


function Checkout() {
  const alertsManagerRef =  useRef(AlertsContext);
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


    return (
      <Box sx={{ width: '100%', typography: 'body1' }}>
            <AlertsManager ref={alertsManagerRef} />

      {/* <ThemeProvider theme={theme}> */}
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList textColor="primary" indicatorColor="primary" onChange={handleChange} aria-label="lab API tabs example" centered >
              <Tab icon={<LunchDiningIcon />} value="1" label="Offen" />
              <Tab icon={<SportsBarIcon />} value="2" label="Fertig" />
              <Tab icon={<KitchenIcon />} value="3" label="Übersicht" />
          </TabList>
            </Box>
        <TabPanel value="1">
          <Orders OrderState={""}/>
        </TabPanel>
        <TabPanel value="2">
          <Orders OrderState={"paid"}/>
        </TabPanel>
        <TabPanel value="3">
          <Orders OrderState={"Übersicht"}/>
        </TabPanel>
      </TabContext>
      {/* </ThemeProvider> */}
      {/* <h1 style={{ textAlign: "center", padding: "50px", outline:"none", color: "white" }}>Checkout</h1> */}
      {/* <pre style={{ color: "white" }}>{ JSON.stringify(data, null, 2)}</pre> */}
    </Box>

          
    )
}

export default Checkout