import React, {useState} from 'react';
import Stack from '@mui/material/Stack';
import Typography  from '@mui/material/Typography';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';
import {Paper, Grid, Divider, Chip } from "@mui/material";
import StyledMenu from "./StyledMenu" 
import MenuItem from '@mui/material/MenuItem';

export default function StateRowSubHeader ({pHandleSort, state, number, titles})
{
    // console.log(state)
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
      
      const handleClose = (val1, val2) => {
        pHandleSort(val1, val2);
        setAnchorEl(null);
      };
    if (number > 0) {
    return(
        <Paper sx={{background:"#cccccc", marginBottom:1}}>
            <Stack spacing={2} direction="row" alignItems="center" justifyContent="space-around" sx={{color:"#05152f"}}>
                <Chip color="primary" label={number} size="small" />
                <Typography>Ausgewählt</Typography>
                <IconButton aria-label="user"  onClick={handleClick}>
                    <SettingsIcon />
                </IconButton>
                <StyledMenu
                    id="filter-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    >
                    {state === titles[0] ? null: <MenuItem onClick={() => handleClose(state, titles[0])}>Bestellt</MenuItem>}
                    {state === titles[1] ? null: <MenuItem onClick={() => handleClose(state, titles[1])}>In Bearbeitung </MenuItem>}
                    {state === titles[2] ? null: <MenuItem onClick={() => handleClose(state, titles[2])}>Fertig</MenuItem>}
                  </StyledMenu>
            </Stack>
            <Divider/>
        </Paper>

    )
    }
    else{
        return null;
    }
}