import * as React from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import Products from '../components/inventory/Products';

import LunchDiningIcon from '@mui/icons-material/LunchDining';
import KitchenIcon from '@mui/icons-material/Kitchen';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import { createTheme, ThemeProvider } from '@mui/material';

const theme = createTheme({
  components: {
      MuiSvgIcon: {
          styleOverrides: {
              root: {
                  color: '#083036', // set color of all icons
              },
          },
      },
      MuiTab: {
          styleOverrides: {
              root: {
                  '&.Mui-selected': {
                      color: '#a64913', // color for active tab
                      '& .MuiSvgIcon-root': {
                          color: '#a64913',
                      },
                  },
                  color: '#083036', // color for inactive tab
                },
          },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            backgroundColor: '#a64913',
          },
        }
      }
  },
});

export default function LabTabs() {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <ThemeProvider theme={theme}>
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
            <Products productCategory={"Extra"}/>
        </TabPanel>
      </TabContext>
      </ThemeProvider>
    </Box>
  );
}
