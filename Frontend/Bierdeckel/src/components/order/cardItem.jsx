import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import { useState } from 'react'; 


function cardItem(params) {

    const {productId, productName, productPrice, quantity} = params.product;
    const [ammount, setAmmount] = useState(quantity); // Initial ammount state
  
    const handleIncrement = () => {
      setAmmount(prevAmmount => Math.min(prevAmmount + 1, 99));;
    };
  
    const handleDecrement = () => {
      setAmmount(prevAmmount => Math.max(prevAmmount - 1, 0)); // Prevent negative values
    };

    const handleRemove = () => {

    }

    return (
       <Box key={productId + Math.random()}>

            <Stack direction="row" spacing={2}  justifyContent="space-between" alignItems="center">
                <Tooltip title="Bezeichung"  placement="top">
                    <Typography  sx={{ minWidth: '80px', textAlign: 'left'  }}>
                        {productName}
                    </Typography>
                </Tooltip>
                <Stack direction="row"  justifyContent="space-between" alignItems="center">
                    <IconButton aria-label="add" size="small" onClick={handleIncrement}>
                        <AddIcon fontSize="inherit" />
                    </IconButton>
                    <Tooltip title="Menge"  placement="top">
                    <Typography sx={{ minWidth: '20px', textAlign:'center' }} >
                        {ammount}
                    </Typography>
                    </Tooltip>   
                    <IconButton aria-label="delete" size="small" onClick={handleDecrement}>
                        <RemoveIcon fontSize="inherit"/>
                    </IconButton>
                </Stack>
                <Tooltip title="Einzelpreis"  placement="top">
                    <Typography sx={{ minWidth: '60px', textAlign: 'right' }}>
                            {productPrice}€
                    </Typography>
                </Tooltip>
                <Tooltip title="Gesammtpreis"  placement="top">
                    <Typography sx={{ minWidth: '60px', textAlign: 'right' }}>
                            {productPrice*ammount}€
                    </Typography>
                </Tooltip>
                <IconButton color="error">
                    <Tooltip title="Produkt löschen"  placement="top">
                        <DeleteIcon />
                    </Tooltip>
                </IconButton>
            </Stack>
            <Divider/>

       </Box>
    )
}

export default cardItem