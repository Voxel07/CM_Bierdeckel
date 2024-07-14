import React, {useState, useRef, useEffect} from "react";
import Modal from '@mui/material/Modal';
import { AlertsManager , AlertsContext } from '../../utils/AlertsManager';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { TableCell, Table, TableBody, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { styled } from '@mui/system';
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import EuroIcon from '@mui/icons-material/Euro';
import axios from "axios";

import { IconButton,  Paper, TextField } from '@mui/material/';

const ColorRetainingIconButton = styled(IconButton)(({ theme, color }) => ({
  '&.Mui-disabled': {
      opacity: 0.7,
      color: theme.palette[color].main,
  },
}));

const TooltipWrapper = styled('span')({
    display: 'inline-block',
  });
  

const StyledPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: '#090c11', // Semi-transparent white
    borderRadius: '5px',
    color:'#F5F0F3'
  }));

  const style = {
    position: 'absolute',
    width: 1400,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#090c11',
    boxShadow: "24 red",
    border: '5px solid #090c11',
    p: 4,
    borderRadius: '20px',
  };

const OrderDetails = (({order: initialOrder}) =>
{
    const alertsManagerRef = useRef(AlertsContext);
    const [order, setOrder] = useState(initialOrder);
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        setOrder(initialOrder);
      }, [initialOrder]);

    const handlePaiProduct = (orderid, orderItemId) =>
    {
        axios.put("order", null, {params:{
            orderId: orderid,
            orderItemId: orderItemId ,
            action: "payItem",
            
          },
          headers: {
            'Content-Type': 'application/json'
          }})
          .then(response =>{
            alertsManagerRef.current.showAlert('success', response.data);
            setOrder(prevOrder => ({
                ...prevOrder,
                orderItems: prevOrder.orderItems.map(item =>
                  item.id === orderItemId ? { ...item, paymentStatus: 'Paid' } : item
                )
              }));
            })
          .catch(error =>{
            console.log(error)
            alertsManagerRef.current.showAlert('error', error.response.data);
          });
    }

    const getPaymentStatusColor = (status) => {
        switch (status.toLowerCase()) {
          case 'paid':
            return 'success';
          case 'pending':
            return 'warning';
          case 'unpaid':
            return 'error';
          default:
            return 'primary';
        }
      };
        
    return(
        <div>
            <Tooltip title="Informationen zur bestellung" placement="top">
            <IconButton color="primary" onClick={handleOpen}>
                 <InfoOutlinedIcon color="Primary" /> 
            </IconButton></Tooltip>

        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
             <Box sx={style}>
                <Typography>{order.id}</Typography>
         <TableContainer component={StyledPaper}>
    <AlertsManager ref={alertsManagerRef} />
        <Table >
            <TableHead>
                <TableRow >
                    <TableCell>Produktnummer</TableCell>
                    <TableCell>Bezeichnung</TableCell>
                    <TableCell>Betrag</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Aktion</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {order.orderItems.map((orderItem) => (
                    <TableRow key={orderItem.id}>
                     
                        {console.log(orderItem)}
                        <TableCell >
                               {orderItem.id}
                        </TableCell>
                        <TableCell >
                               {orderItem.product.name}
                        </TableCell>
                        <TableCell>
                               {`${orderItem.product.price} €`}
                        </TableCell>
                        <TableCell>
                               {orderItem.paymentStatus}
                        </TableCell>
                        <TableCell>
                            <Stack  direction="row"
                                    spacing={0}
                                    alignItems="start">
                               
                                <TooltipWrapper title={orderItem.paymentStatus.toLowerCase() === 'paid' ? 'Bereits bezahlt' : 'Bezahle das Produkt'}  placement="top">
                                  <ColorRetainingIconButton 
                                    variant="contained" 
                                    color={getPaymentStatusColor(orderItem.paymentStatus)} 
                                    onClick={() => handlePaiProduct(order.id, orderItem.id)}
                                    disabled={orderItem.paymentStatus.toLowerCase() === 'paid'}
                                    >
                                <EuroIcon/></ColorRetainingIconButton>
                                </TooltipWrapper>
                            </Stack>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>

        </Table>
        </TableContainer>
        </Box>
        </Modal>
        </div>
    )
})

export default OrderDetails

