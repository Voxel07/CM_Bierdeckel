import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';
import { Paper, Divider, Chip } from "@mui/material";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled, alpha } from '@mui/material/styles';

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
    borderRadius: '12px',
    marginTop: theme.spacing(1),
    minWidth: 140,
    color: '#f5f0f3',
    backgroundColor: '#090c11',
    border: '1px solid rgba(25, 152, 161, 0.3)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
    '& .MuiMenuItem-root': {
      fontSize: '0.85rem',
      fontWeight: 500,
      py: 1,
      px: 2,
      borderBottom: '1px solid rgba(25, 152, 161, 0.1)',
      '&:last-child': {
        borderBottom: 'none'
      },
      '& .MuiSvgIcon-root': {
        fontSize: 16,
        color: '#1998a1',
        marginRight: theme.spacing(1.5),
      },
      '&:hover': {
        backgroundColor: 'rgba(25, 152, 161, 0.1)'
      },
      '&:active': {
        backgroundColor: 'rgba(25, 152, 161, 0.15)'
      },
    },
  },
}));

export default function StateRowHeader({ pHandleSort, displayState, state, color, number }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = (val1, val2) => {
    if (val1 && val2) {
      pHandleSort(val1, val2);
    }
    setAnchorEl(null);
  };

  return (
    <Paper 
      sx={{ 
        background: "rgba(18, 48, 54, 0.4)", 
        border: "1px solid rgba(25, 152, 161, 0.25)", 
        borderRadius: "12px",
        p: 1.5,
        mb: 1
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <LunchDiningIcon color={color} />
          <Typography variant="body1" sx={{ color: '#f5f0f3', fontWeight: 700 }}>
            {displayState}
          </Typography>
        </Stack>
        
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip 
            label={number} 
            size="small" 
            sx={{
              backgroundColor: 'rgba(25, 152, 161, 0.15)',
              color: '#1998a1',
              fontWeight: 700,
              fontSize: '0.75rem',
              border: '1px solid rgba(25, 152, 161, 0.3)'
            }}
          />
          <IconButton 
            size="small"
            sx={{ 
              color: '#8898a5',
              '&:hover': { color: '#1998a1', backgroundColor: 'rgba(25, 152, 161, 0.08)' } 
            }} 
            onClick={handleClick}
          >
            <SettingsIcon fontSize="small" />
          </IconButton>
        </Stack>

        <StyledMenu
          id="sort_selector"
          anchorEl={anchorEl}
          open={open}
          onClose={() => handleClose()}
        >
          <Typography variant="caption" sx={{ display: 'block', px: 2, py: 1, color: '#8898a5', fontWeight: 600 }}>
            Sortieren nach:
          </Typography>
          <Divider sx={{ borderColor: 'rgba(25, 152, 161, 0.1)' }} />
          <MenuItem onClick={() => handleClose(displayState, "userId")} disableRipple>
            <SettingsIcon />
            Benutzer
          </MenuItem>
          <MenuItem onClick={() => handleClose(displayState, "description")} disableRipple>
            <SettingsIcon />
            Produkt
          </MenuItem>
          <MenuItem onClick={() => handleClose(displayState, "extras")} disableRipple>
            <SettingsIcon />
            Extras
          </MenuItem>
        </StyledMenu>
      </Stack>
    </Paper>
  );
}