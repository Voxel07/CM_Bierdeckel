import React, {useEffect, useState} from 'react';
import Stack from '@mui/material/Stack';
import Typography  from '@mui/material/Typography';
import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';
import {Paper, Grid, Divider, Chip, Tooltip, sliderClasses } from "@mui/material";
import StyledMenu from "./StyledMenu" 
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';

export default function StateRowSubHeader({pHandleSort, state, number, titles, pHandleMultiSelect})
{
    // console.log(state)
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
      };
      
    const handleClose = (state, title) => {
    pHandleSort(state, title);
    setAnchorEl(null);
    };

    if (number > 0) {
    return(
        <Paper sx={{background:"#161d29", marginBottom:1, border:"2px solid #061837", borderRadius:2}}>
            <Stack spacing={2} direction="row" alignItems="center" justifyContent="space-around" sx={{color:"#05152f"}}>
                <Typography>Ausgewählt</Typography>
                <Chip color="primary" label={number} size="small" />
                <Tooltip title="Alle auswählen" placement='top'>
                    <Checkbox onChange={() => pHandleMultiSelect(state)}/>
                </Tooltip>
                <IconButton aria-label="user"  onClick={handleClick}>
                    <SettingsIcon sx={{color:"#f5f0f3"}} />
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
        </Paper>

    )
    }
    else{
        return null;
    }
}