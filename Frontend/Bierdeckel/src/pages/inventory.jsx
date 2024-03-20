import * as React from 'react';

import Box from '@mui/material/Box';
import AppBar from '@material-ui/core/AppBar';
import Tab from '@material-ui/core/Tab';
import TabContext from '@material-ui/lab/TabContext';
import TabList from '@material-ui/lab/TabList';
import TabPanel from '@material-ui/lab/TabPanel';

import Products from '../components/inventory/Products';
import Extras from '../components/inventory/Extras';

import PhoneIcon from '@mui/icons-material/Phone';
import PersonPinIcon from '@mui/icons-material/PersonPin';

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
            <Tab icon={<PhoneIcon />}  value="1" label="Produkte"/>
            <Tab icon={<PersonPinIcon />}   value="2"label="Extras" />
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