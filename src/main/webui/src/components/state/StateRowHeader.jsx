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

export default function StateRowHeader ({pHandleSort, displayState, state, color, number})
{
  const StyledMenu = styled((props) => (
    <Menu
      elevation={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      {...props}
    />
  ))(({ theme }) => ({
    '& .MuiPaper-root': {
      borderRadius: 5,
      marginTop: theme.spacing(1),
      minWidth: 140,
      color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
      backgroundColor: "#161d29",
      '& .MuiMenuItem-root': {
        '& .MuiSvgIcon-root': {
          fontSize: 18,
          color: "#f5f0f3",
          marginRight: theme.spacing(1.5),
        },
        '&:active': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity,
          ),
        },
      },
    },
  }));

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
        <Paper sx={{background:"#161d29", border:"2px solid #061837", borderRadius:2}}>
            <Stack spacing={2} direction="row" alignItems="center" justifyContent="space-around" sx={{color:"#F"}}>
                <LunchDiningIcon color={color}/>
                <Typography>{displayState}</Typography>
                <Chip color="primary" label={number} size="small" />
                <IconButton sx={{color:"#f5f0f3"}} aria-label="user" onClick={handleClick}>
                    <SettingsIcon/>
                </IconButton>
                <StyledMenu
        id="sort_selector"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <Typography color="#f5f0f3" textAlign="center" sx={{ py: 1 }}>
          Reihenfolge
        </Typography>
        <Divider />
        <MenuItem onClick={() => handleClose(displayState, "userId")} disableRipple>
          <SettingsIcon />
          <Typography textAlign="center">
            Benutzer
          </Typography>
        </MenuItem>
        <MenuItem onClick={() => handleClose(displayState, "description")} disableRipple>
          <SettingsIcon />
          <Typography textAlign="center">
            Produkt
          </Typography>
        </MenuItem>
        <MenuItem onClick={() => handleClose(displayState, "extras")} disableRipple>
        <SettingsIcon />
          <Typography textAlign="center">
           Extra
          </Typography>
        </MenuItem>
      </StyledMenu>
            </Stack>
        </Paper>

    )
}