import React, { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Badge from "@mui/material/Badge";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import CartItem from "./cardItem";
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Tooltip } from '@mui/material/';

const style = {
  position: 'absolute',
  width: 450,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -100%)',
  backgroundColor: '#090c11',
  boxShadow: "24 red",
  border: '5px solid #090c11',
  p: 4,
  borderRadius: '20px',
};

export default function shoppingcard({ cardData, handleStockChange, displayItems, placeOrder, updateOrder, deleteOrder, orderId}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}>
        <Stack direction="row" spacing={2}>
          <Badge
            color="info"
            size="small"
            badgeContent={cardData.itemCount}
          >
            <ShoppingCartIcon />
          </Badge>
          <Typography>{cardData.total.toFixed(2)}€</Typography>
        </Stack>
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack
            direction="row"
            spacing={2}
            justifyContent="space-between"
            alignItems="baseline"
          >
            <Typography id="modal-modal-title" variant="h5" component="h2">
              Bestellungsübersicht
            </Typography>
            <Tooltip title="Gesammtbetrag der Bestellung" placement="top">
            <Typography variant="h5" component="h2">
              {cardData.total.toFixed(2)}€
            </Typography>
            </Tooltip>
          </Stack>
          <Stack>

          <Divider sx={{ marginBottom: 4 }} />
          {displayItems?.length
            ? displayItems.map((product, index) => <CartItem key={index} product={product} handleStockChange={handleStockChange} />)
            : <Typography variant="h5" component="h2" align="center"> Hier ist noch nichts drin!</Typography>}
          {/* <pre style={{color:"white"}}>{JSON.stringify(displayItems, null, 2)}</pre> */}
          {/* <pre>{JSON.stringify(orderId, null, 2)}</pre> */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ marginTop: 4 }}>
          {
            orderId ?
            <Tooltip title="Aktualisiere die Bestellung" placement="top">
            <Button variant="outlined" color="warning" onClick={() =>{updateOrder(), handleClose()}}>Aktualisieren</Button></Tooltip>:
            <Tooltip title="Bestellung aufgeben" placement="top">
            <Button variant="outlined" color="success" onClick={() =>{placeOrder(), handleClose()}} >Aufgeben</Button></Tooltip>
          }

            {
            orderId ?
            <Tooltip title="Lösche die gesammte Bestellung" placement="top">
            <Button variant="outlined" color="error" onClick={deleteOrder}>Löschen</Button> 
            </Tooltip>:null
           
            }
            <Tooltip title="Schliesen" placement="top">
            <IconButton variant="outlined" color="error" onClick={handleClose}><CloseIcon /></IconButton>
            </Tooltip>
          </Stack>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}
