import React, {useState, useRef} from "react";
import Modal from '@mui/material/Modal';
import { AlertsManager , AlertsContext } from '../../utils/AlertsManager';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { TableCell, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import { styled } from '@mui/system';
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import EuroIcon from '@mui/icons-material/Euro';

import { IconButton,  Paper, TextField } from '@mui/material/';

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
    transform: 'translate(-50%, -75%)',
    backgroundColor: '#090c11',
    boxShadow: "24 red",
    border: '5px solid #090c11',
    p: 4,
    borderRadius: '20px',
  };

const OrderDetails = (({order}) =>
{
    const alertsManagerRef = useRef();
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    const handlePaiProduct = (_id) =>
        {
          console.log("paid"+ _id);
        }

        
    return(
        <div>
            <IconButton onClick={handleOpen}>
                 <InfoOutlinedIcon color="Primary" /> 
            </IconButton>

        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
             <Box sx={style}>
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
                               
                                <Tooltip title="Bezahle die Das Produkt" placement="top">
                                  <IconButton variant="contained" color="primary" onClick={() => handlePaiProduct(orderItem.id)}><EuroIcon/></IconButton>
                                </Tooltip>
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

