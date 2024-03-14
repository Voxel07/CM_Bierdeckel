import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Badge from '@mui/material/Badge';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

import CartItem from './cardItem'


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  borderradius: '20px',
  boxShadow: 24,
  p: 4,
};

const products = [
    { name: 'Bratwurst', price: 3, ammount: 1 },
    { name: 'Currywurst', price: 5, ammount: 3 },
    { name: 'Krakauer', price: 6, ammount: 1 }
]

export default function BasicModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
        <Button onClick={handleOpen}> 
            <Stack direction="row" spacing={2}>
                <Badge color="info" size="small" badgeContent={7}>
                    <ShoppingCartIcon />
                </Badge>
               <Typography>50 €</Typography>
            </Stack>
        </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} >
            <Stack direction="row" spacing={2}  justifyContent="space-between" alignItems="baseline">
                <Typography id="modal-modal-title" variant="h5" component="h2">
                    Bestellungsübersicht
                </Typography>
                <Typography variant="h5" component="h2">50 €</Typography>
            </Stack>
            <Divider sx={{marginBottom:4}}/>
            <Stack direction="row" spacing={2} justifyContent="space-between">
                <Typography ariant="subtitle" sx={{ minWidth: '110px'}}>
                    Bezeichung
                </Typography>
                <Typography ariant="subtitle" sx={{ minWidth: '110px'}}>
                    Menge
                </Typography>
                <Typography ariant="subtitle" sx={{ minWidth: '60px'}}>
                    Preis
                </Typography>
                <Typography ariant="subtitle" >
                    Summe
                </Typography>
            </Stack>
            <Divider sx={{marginBottom:2}}/>

        {
          products.length ? products.map(product => <CartItem info={product}/>)
          : null
        }
          
        </Box>
      </Modal>
    </div>
  );
}