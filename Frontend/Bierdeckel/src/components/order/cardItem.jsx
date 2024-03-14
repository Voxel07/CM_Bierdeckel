import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useState } from 'react'; 


function cardItem(params) {

    const {name, price, initAmmount} = params.info;
    const [ammount, setAmmount] = useState(1); // Initial ammount state
  
    const handleIncrement = () => {
      setAmmount(prevAmmount => Math.min(prevAmmount + 1, 99));;
    };
  
    const handleDecrement = () => {
      setAmmount(prevAmmount => Math.max(prevAmmount - 1, 0)); // Prevent negative values
    };
    return (
       <Box key={name}>
            <Stack direction="row" spacing={2}  justifyContent="space-between" alignItems="center">
                <Typography  sx={{ minWidth: '80px', textAlign: 'left'  }}>
                    {name}
                </Typography>
                <Stack direction="row"  justifyContent="space-between" alignItems="center">
                    <IconButton aria-label="add" size="small" onClick={handleIncrement}>
                        <AddIcon fontSize="inherit" />
                    </IconButton>
                    <Typography sx={{ minWidth: '20px', textAlign:'center' }} >
                        {ammount}
                    </Typography>
                    <IconButton aria-label="delete" size="small" onClick={handleDecrement}>
                        <RemoveIcon fontSize="inherit"/>
                    </IconButton>
                </Stack>
                <Typography sx={{ minWidth: '60px', textAlign: 'right' }}>
                    {price}€
                </Typography>
                <Typography sx={{ minWidth: '60px', textAlign: 'right' }}>
                    {price*ammount}€
                </Typography>
            </Stack>
            <Divider></Divider>
       </Box>
    )
}

export default cardItem