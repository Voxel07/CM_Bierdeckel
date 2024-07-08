import React, {useState, useRef} from "react";
import Modal from '@mui/material/Modal';
import { AlertsManager , AlertsContext } from '../../utils/AlertsManager';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { TableCell, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import { styled } from '@mui/system';
import Box from "@mui/material/Box";

import { IconButton,  Paper, TextField } from '@mui/material/';

const StyledPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: '#090c11', // Semi-transparent white
    borderRadius: '5px',
    color:'#F5F0F3'
  }));

  const style = {
    position: 'absolute',
    width: 400,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -100%)',
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
                    <TableCell>Kunde</TableCell>
                    <TableCell>Bestellungs ID</TableCell>
                    <TableCell>Produkte</TableCell>
                    <TableCell>Summe</TableCell>
                    <TableCell>Offener Betrag</TableCell>
                    <TableCell>Aktion</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {order.orderItems.map((orderItem) => (
                    console.log(orderItem.id)
                
                    // <TableRow key={orderItem.id}>
                    //    <TableCell >
                    //            {orderItem.user.id}
                    //     </TableCell>
                    //     <TableCell >
                    //            {orderItem.id}
                    //     </TableCell>
                    //     <TableCell>
                    //            {orderItem.orderItems}
                    //     </TableCell>
                    //     <TableCell>
                    //            {`${order.sum} €`}
                    //     </TableCell>
                    //     <TableCell>
                    //         <Stack  direction="row"
                    //                 spacing={0}
                    //                 alignItems="start">
                               
                    //             <Tooltip title="Bezahle die Bestellung" placement="top">
                    //               <IconButton variant="contained" color="primary" onClick={() => handlePaiOrder(order.id)}><EuroIcon/></IconButton>
                    //             </Tooltip>
                    //             <Tooltip title="Mehr Infos2" placement="top">
                    //               <OrderDetails order={order}/>

                    //             </Tooltip>
                    //         </Stack>
                    //     </TableCell>
                    // </TableRow>
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

