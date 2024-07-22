import { useEffect, useState, useRef } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { createTheme, ThemeProvider } from '@mui/material';
import { AlertsManager , AlertsContext } from '../../utils/AlertsManager';

import axios from 'axios';

export default function Userselection({handleUserChange }) {

  const [avUsers, setAvUsers] = useState([])
  const alertsManagerRef =  useRef(AlertsContext);

  useEffect(()=>{
    axios.get("/users")
    .then((respone) =>
    {
      const mappedUsers = respone.data.map(user => ({
        label: ""+user.id,
        id: user.id, 
      }));
      setAvUsers(mappedUsers)
    }).catch((error)=>{
      alertsManagerRef.current.showAlert('error', "Fehler beim abfragen der Benutzer. "+ orderId + error.response.data);
    })

    
  },[])

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
    <AlertsManager ref={alertsManagerRef} />
    <Autocomplete
      disablePortal
      id="user-selection"
      options={avUsers}
      sx={{ width: 120 }}
      onChange={handleUserChange}
      renderInput={(params) => <TextField {...params} label="Benutzer" />}
      getOptionLabel={(option) => option.label}
    />
    </ThemeProvider>
  );
}
