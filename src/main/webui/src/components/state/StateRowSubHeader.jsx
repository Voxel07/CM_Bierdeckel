import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';
import { Paper, Divider, Chip, Tooltip, Checkbox, Menu, MenuItem } from "@mui/material";
import { styled } from '@mui/material/styles';

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
    marginTop: theme.spacing(0.5),
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
      '&:hover': {
        backgroundColor: 'rgba(25, 152, 161, 0.1)'
      },
      '&:active': {
        backgroundColor: 'rgba(25, 152, 161, 0.15)'
      },
    },
  },
}));

export default function StateRowSubHeader({ pHandleSort, state, number, totalItems, titles, pHandleMultiSelect }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = (columnState, targetState) => {
    if (columnState && targetState) {
      pHandleSort(columnState, targetState);
    }
    setAnchorEl(null);
  };

  const checked = totalItems > 0 && number === totalItems;
  const indeterminate = totalItems > 0 && number > 0 && number < totalItems;

  if (number > 0) {
    return (
      <Paper 
        sx={{ 
          background: "rgba(18, 48, 54, 0.2)", 
          border: "1px solid rgba(25, 152, 161, 0.15)", 
          borderRadius: "12px",
          p: 1,
          mb: 1.5
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1} sx={{ px: 1 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Tooltip title={checked ? "Alle abwählen" : "Alle auswählen"} placement="top">
              <Checkbox 
                checked={checked}
                indeterminate={indeterminate}
                onChange={(e) => pHandleMultiSelect(state, e.target.checked)}
                size="small"
                sx={{
                  p: 0.5,
                  color: "rgba(25, 152, 161, 0.4)",
                  "&.Mui-checked": { color: "#1998a1" },
                  "&.MuiCheckbox-indeterminate": { color: "#1998a1" }
                }}
              />
            </Tooltip>
            <Typography variant="body2" sx={{ color: '#8898a5', fontWeight: 600 }}>
              Ausgewählt:
            </Typography>
            <Chip 
              label={number} 
              size="small" 
              sx={{
                height: 20,
                fontSize: '0.75rem',
                fontWeight: 700,
                backgroundColor: 'rgba(25, 152, 161, 0.1)',
                color: '#1998a1',
                border: '1px solid rgba(25, 152, 161, 0.2)'
              }}
            />
          </Stack>
          
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

          <StyledMenu
            id="filter-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={() => handleClose()}
          >
            <Typography variant="caption" sx={{ display: 'block', px: 2, py: 0.75, color: '#8898a5', fontWeight: 600 }}>
              Verschieben nach:
            </Typography>
            <Divider sx={{ borderColor: 'rgba(25, 152, 161, 0.1)' }} />
            {state !== titles[0] && <MenuItem onClick={() => handleClose(state, titles[0])}>Bestellt</MenuItem>}
            {state !== titles[1] && <MenuItem onClick={() => handleClose(state, titles[1])}>In Bearbeitung</MenuItem>}
            {state !== titles[2] && <MenuItem onClick={() => handleClose(state, titles[2])}>Fertig</MenuItem>}
          </StyledMenu>
        </Stack>
      </Paper>
    );
  }

  return null;
}