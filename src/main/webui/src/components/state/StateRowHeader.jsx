import React, {useState} from 'react';
import Stack from '@mui/material/Stack';
import Typography  from '@mui/material/Typography';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';
import {Paper, Grid, Divider, Chip } from "@mui/material";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled, alpha } from '@mui/material/styles';
import StyledMenu from './StyledMenu';

export default function StateRowHeader ({pHandleSort, state, color, number})
{

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = (val1, val2) => {
    pHandleSort(val1, val2);
    setAnchorEl(null);
  };

    return(
        <Paper sx={{background:"#cccccc", marginBottom:1}}>
            <Stack spacing={2} direction="row" alignItems="center" justifyContent="space-around" sx={{color:"#05152f"}}>
                <LunchDiningIcon color={color}/>
                <Typography>{state}</Typography>
                <Chip color="primary" label={number} size="small" />
                <IconButton aria-label="user" onClick={handleClick}>
                    <SettingsIcon />
                </IconButton>
                <StyledMenu
                    id="filter-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    >
                      <Typography textAlign="center">Wähle die Reihenfolge</Typography>
                      <Divider component="li" />
                    <MenuItem onClick={() => handleClose(state, "user")} > 
                      <SettingsIcon /> Filter by User
                    </MenuItem>
                    <MenuItem onClick={() => handleClose(state, "description")}>Filter by Food</MenuItem>
                    <MenuItem onClick={() => handleClose(state, "extras")}>Filter by Extras</MenuItem>
                    </StyledMenu>
            </Stack>
        </Paper>

    )
}