import { useState } from 'react'
import './App.css'

import { BrowserRouter as Router, Routes, Route, Navigate  } from 'react-router-dom';

//Inventory
import Products from './components/inventory/Products'
import Order from './pages/Order'

//user
import SignIn from './components/user/SignIn'
import SignUp from './components/user/SignUp'
import Header from './components/core/Header';
import Footer from './components/core/Footer';
import Home from './components/core/Home';
import PageNotFound from './components/core/PageNotFound';
import TemporaryDrawer from './components/core/Drawer';

import Inventory from './pages/inventory'
import SocketTest from './SocketTest'
import State from './pages/State';
import { createTheme, ThemeProvider } from '@mui/material';

import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:9000/api'; //dev
// axios.defaults.baseURL = 'https://bierdeckel.matze.fun/api'; //prod


const theme = createTheme({
  components: {
    MuiTypography: {
      styleOverrides: {
        h1: { color: '#f5f0f3' },
        h2: { color: '#f5f0f3' },
        h3: { color: '#f5f0f3' },
        h4: { color: '#f5f0f3' },
        h5: { color: '#f5f0f3' },
       p: { color: '#f5f0f3' },
       body1: { color: '#f5f0f3' },
       body2: { color: '#f5f0f3' },
      },
    },
    MuiTextField: { 
      styleOverrides: {
        root: { 
          '& .MuiInputLabel-root': { color: '#DDDDDD' },
          '& .MuiOutlinedInput-root': { 
            color: '#DDDDDD',
            '& > fieldset': { borderColor: '#DDDDDD' },
          },
        },
      },
    },
    MuiInputAdornment: {
        styleOverrides: {
            root: {
                '& .MuiTypography-root': { color: '#DDDDDD' },
            },
        },
    },
    // MuiButton: {
    //   styleOverrides: {
    //     root: {
    //       // backgroundColor: 'lightblue', 
    //       color: '#f5f0f3',
    //       borderColor: '#1998a1',
    //       // backgroundColor: '#2d686d',
    //       '&:hover': {
    //         backgroundColor: '#1998a1',
    //         color: '#f5f0f3',
    //       },
    //     },
    //   },
    // },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '& .MuiSvgIcon-root': {
            // color: 'red',
          },
          '&:hover': {
            '& .MuiSvgIcon-root': {
              color: '#a64913',
            },
          },
        },
      },
    },
    MuiTab: {
          styleOverrides: {
              root: {
                  '&.Mui-selected': {
                      color: '#a64913', // color for active tab
                      '& .MuiSvgIcon-root': {
                          color: '#a64913',
                      },
                  },
                  color: '#083036', // color for inactive tab
                },
          },
      },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#a64913',
        },
      }
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableRow-root:nth-of-type(odd)': { 
              backgroundColor: '#151c28', 
          },
          '& .MuiTableRow-root:nth-of-type(even)': { 
          backgroundColor: '#090c11' ,
          },
          '& .MuiTableRow-root': { 

          },
          '& .MuiTableCell-root' : {
              borderBottom: '1px solid #19669d',
          }
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
              color: '#F5F0F3', // set alternating colors for even and odd rows
              borderBottom: '3px solid #F5F0F3',
            },
          },
      },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#1998a1', // Change this to your desired color
          "&::before, &::after": {
            borderColor: "#1998a1",
          },
        },
      },
    },
  },
});


function App() {

  return (
    <ThemeProvider theme={theme}>
    <Router>
      <Header/>
      {/* <TemporaryDrawer/> */}
      <Routes>
        <Route path='/' Component={Home}/>
        <Route path='Home' Component={Home}/>
        <Route path="/regestrieren" Component={SignUp}/>
        <Route path="/anmelden" Component={SignIn}/>
        <Route path="/404" element={<PageNotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
        <Route path='Inventar' Component={Inventory}/>
        <Route path='Bestellungen' Component={Order}/>
        <Route path='Status' Component={State}/>
        <Route path='test' Component={SocketTest}/>

      </Routes>
      <Footer/>
    </Router>
  </ThemeProvider>
  )
}

export default App
