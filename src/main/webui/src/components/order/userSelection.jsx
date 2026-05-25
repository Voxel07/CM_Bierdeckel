import React from "react";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { createTheme, ThemeProvider } from '@mui/material';
import { useOrder } from "./OrderContext";

const theme = createTheme({
  components: {
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '& .MuiInputLabel-root': { color: '#8898a5' },
          '& .MuiOutlinedInput-root': {
            color: '#f5f0f3',
            borderRadius: '12px',
            '& > fieldset': { borderColor: 'rgba(25, 152, 161, 0.3)' },
            '&:hover > fieldset': { borderColor: '#1998a1' },
            '&.Mui-focused > fieldset': { borderColor: '#1998a1' },
          },
        },
        inputRoot: {
          color: '#f5f0f3'
        },
        clearIndicator: {
          color: '#ef5350'
        },
        popupIndicator: {
          color: '#1998a1'
        },
        paper: {
          color: '#f5f0f3',
          backgroundColor: '#090c11',
          border: '1px solid rgba(25, 152, 161, 0.3)',
          borderRadius: '12px',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
        },
        option: {
          borderBottom: '1px solid rgba(25, 152, 161, 0.1)',
          '&:last-child': {
            borderBottom: 'none'
          },
          '&[aria-selected="true"]': {
            backgroundColor: 'rgba(25, 152, 161, 0.15) !important',
          },
          '&.Mui-focused': {
            backgroundColor: 'rgba(25, 152, 161, 0.08) !important',
          }
        },
        listbox: {
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#090c11',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(25, 152, 161, 0.5)',
            borderRadius: '10px',
          },
        },
      },
    },
  },
});

export default function Userselection() {
  const { users, selectedUser, selectUser } = useOrder();

  const handleUserChange = (event, newValue) => {
    selectUser(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <Autocomplete
        disablePortal
        id="user-selection"
        options={users}
        sx={{ width: 140 }}
        value={selectedUser || null}
        onChange={handleUserChange}
        isOptionEqualToValue={(option, value) => option.id === value?.id}
        renderInput={(params) => <TextField {...params} label="Benutzer" size="small" />}
        getOptionLabel={(option) => `${option.label}`}
      />
    </ThemeProvider>
  );
}
