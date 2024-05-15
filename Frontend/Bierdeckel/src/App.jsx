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

import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:9000/';

function App() {

  return (
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
    {/* <Footer/> */}
   </Router>
  )
}

export default App
