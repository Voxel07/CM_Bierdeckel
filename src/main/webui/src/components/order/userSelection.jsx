import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { createTheme, ThemeProvider } from '@mui/material';

export default function Userselection({ handleUserChange }) {

  const theme = createTheme({
    components: {
      MuiAutocomplete: {
        styleOverrides: {
          root: {
            '& .MuiInputLabel-root': { color: '#DDDDDD' },
            '& .MuiOutlinedInput-root': { 
              color: '#DDDDDD',
              '& > fieldset': { borderColor: '#1998a1' },
            },
          },
          inputRoot: {
            color: '#f5f0f3'
          },
          clearIndicator: {
            color: 'red'
          },
          popupIndicator: {
            color: '#f5f0f3'
          },
          paper: {
            color: '#f5f0f3',
            backgroundColor: '#090c11',
            borderColor: '#1998a1',
            borderWidth: '2px',
            borderStyle: 'solid',
          },
          option: {
            borderBottom: '1px solid #0d5459',
          },
          listbox: {
            '&::-webkit-scrollbar': {
              width: '7px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#090c11',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#1998a1',
              borderRadius: '10px',
            },
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
    <Autocomplete
      defaultValue={users[0]}
      disablePortal
      id="combo-box-demo"
      options={users}
      sx={{ width: 120 }}
      onChange={handleUserChange}
      renderInput={(params) => <TextField {...params} label="Benutzer" />}
    />
    </ThemeProvider>
  );
}

const users = [
  { label: '1', id: 1 },
  { label: '2', id: 2 },
  { label: '3', id: 3 },
  { label: '4', id: 4 },
  { label: '5', id: 5 },
  { label: '6', id: 6 },
  { label: '7', id: 7 },
  { label: '8', id: 8 },
  { label: '9', id: 9 },

  { label: '10', id: 10 },
  { label: '11', id: 11 },
  { label: '12', id: 12 },
  { label: '13', id: 13 },
  { label: '14', id: 14 },
  { label: '15', id: 15 },
  { label: '16', id: 16 },
  { label: '17', id: 17 },
  { label: '18', id: 18 },
  { label: '19', id: 19 },

  { label: '20', id: 20 },
  { label: '21', id: 21 },
  { label: '22', id: 22 },
  { label: '23', id: 23 },
  { label: '24', id: 24 },
  { label: '25', id: 25 },
  { label: '26', id: 26 },
  { label: '27', id: 27 },
  { label: '28', id: 28 },
  { label: '29', id: 29 },

  { label: '30', id: 30 },
  { label: '31', id: 31 },
  { label: '32', id: 32 },
  { label: '33', id: 33 },
  { label: '34', id: 34 },
  { label: '35', id: 35 },
  { label: '36', id: 36 },
  { label: '37', id: 37 },
  { label: '38', id: 38 },
  { label: '39', id: 39 },
  { label: '40', id: 40 },
]
