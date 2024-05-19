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
import { IconButton } from '@mui/material/';

const style = {    
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -100%)',
  backgroundColor: '#090c11',
  boxShadow: "24 red",
  border: '5px solid #090c11',
  p: 4,
  borderRadius: '20px',
};

export default function shoppingcard({ cardData, handleStockChange, displayItems, placeOrder}) {
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
            <Typography variant="h5" component="h2">
              {cardData.total.toFixed(2)}€
            </Typography>
          </Stack>
          <Stack>

          <Divider sx={{ marginBottom: 4 }} />
          {displayItems?.length
            ? displayItems.map((product) => <CartItem product={product} handleStockChange={handleStockChange} />)
            : "Hier ist noch nichts drin!"}
          {/* <pre>{JSON.stringify(displayITems, null, 2)}</pre> */}
          {/* <pre>{JSON.stringify(cardData, null, 2)}</pre> */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ marginTop: 4 }}>
            <Button variant="outlined" onClick={placeOrder} >Bestellung aufgeben</Button>
            <IconButton variant="outlined" color="error" onClick={handleClose}><CloseIcon /></IconButton>
            
          </Stack>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}
