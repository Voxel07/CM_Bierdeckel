import React, {useState, useEffect, useRef} from 'react';

import Box from '@mui/material/Box';

import { TableCell, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import { IconButton,  Paper, TextField } from '@mui/material/';
import { styled } from '@mui/system';
import Stack from "@mui/material/Stack";
import DeleteIcon from '@mui/icons-material/Delete';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EuroIcon from '@mui/icons-material/Euro';
import axios from 'axios';
import { AlertsManager , AlertsContext } from '../../utils/AlertsManager';
import Tooltip from "@mui/material/Tooltip";

import OrderDetails from "./OderDetails"

import {euro_formatter} from "../../utils/Intl"

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: '#090c11', // Semi-transparent white
  borderRadius: '5px',
  color:'#F5F0F3'
}));



export default function Orders({OrderState}) {
  console.log(OrderState)
  const alertsManagerRef =  useRef(AlertsContext);

  const [value, setValue] = React.useState('1');
  const [orders, setOders] = React.useState([]);
  const [trigger, setTrigger] = React.useState();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(()=>{
    axios.get("order", {params:{paymentState: OrderState}})
    .then(response=>
    {
      setOders(response.data);
    })
    .catch(error=>
    {
      console.log(error);
    }
    );
  },[trigger])

  const handlePaiOrder = (_id) =>
  {
    axios.put("order", null, {params:{
      orderId: _id,
      action: "payOrder",
      orderItems: []
    }, 
    headers: {
      'Content-Type': 'application/json'
    }})
    .then(response =>{
      alertsManagerRef.current.showAlert('success', response.data);
      setTrigger(true);
    })
    .catch(error =>{
      console.log(error)
      alertsManagerRef.current.showAlert('error', error.response.data);
    });
  }

  function calculateRemaining (orderitems)
  {
    let remainder = 0;
    for(const item of orderitems)
    {
      console.log("itme:", item)
      if(item.paymentStatus == "UNPAID")
      {
        remainder += item.product.price;
      }
    }
    return remainder
  }

  function calculateSum (orderitems)
  {
    let sum = 0;
    for(const item of orderitems)
    {
      sum += item.product.price;
    }
    return sum
  }



  return(
    <TableContainer component={StyledPaper}>
    <AlertsManager ref={alertsManagerRef} />
        <Table >
            <TableHead>
                <TableRow >
                    <TableCell>Kunde</TableCell>
                    <TableCell>Bestellungs ID</TableCell>
                    <TableCell>Produkte</TableCell>
                    <TableCell>Summe</TableCell>
                    <TableCell>Offener Betrag</TableCell>
                    <TableCell>Aktion</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {orders.map((order) => (
                
                    <TableRow key={order.id}>
                       <TableCell >
                               {order.user.id}
                        </TableCell>
                        <TableCell >
                               {order.id}
                        </TableCell>
                        <TableCell>
                               {order.orderItems.length}
                        </TableCell>
                        <TableCell>
                               {euro_formatter.format(calculateSum(order.orderItems))}
                        </TableCell>
                        <TableCell>
                               {euro_formatter.format(calculateRemaining(order.orderItems))}
                        </TableCell>
                        <TableCell>
                            <Stack  direction="row"
                                    spacing={0}
                                    alignItems="start">
                               
                                <Tooltip title="Bezahle die Bestellung" placement="top">
                                  <IconButton variant="contained" color="primary" onClick={() => handlePaiOrder(order.id)}><EuroIcon/></IconButton>
                                </Tooltip>
                                <Tooltip title="Mehr Infos2" placement="top">
                                  <OrderDetails order={order}/>

                                </Tooltip>
                            </Stack>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>

        </Table>
        </TableContainer>
  );

}