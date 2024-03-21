import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Box, Tab, Chip } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill';
import DoneIcon from '@mui/icons-material/Done';

import StateTableOrderd from '../components/state/StateTableOrdered'
import StateTableInPreperation from '../components/state/StateTableInPreperation'
import StateTableCompleted from '../components/state/StateTableCompleted'

export default function State()
{
    const [tabValue, setTabValue] = React.useState("1");

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
      };

    return(
        <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            textColor="primary"
            indicatorColor="primary"
            onChange={handleTabChange}
            aria-label="lab API tabs example"
            centered
          >
            <Tab icon={<ShoppingCartIcon />} value="1" label="Bestellt" />
            <Tab icon={<OutdoorGrillIcon />} value="2" label="In Zubereitung" />
            <Tab icon={<DoneIcon />} value="3" label="Fertig" />
          </TabList>
        </Box>
        <TabPanel value="1">
       
        </TabPanel>
        <TabPanel value="2">

        </TabPanel>
        <TabPanel value="3">
            
            </TabPanel>
      </TabContext>
    )
}