import React, { useState } from 'react';
import {
  Box,
  Card,
  Grid,
  Stack,
  CardMedia,
  CardContent,
  Typography,
  CardActions,
  Button,
} from '@mui/material';

const OutOfStockMessage   = () => 
{
    return (
          <Typography variant="h6" color="error.main" component="span"> 
            Ausverkauft
          </Typography>
      );
};

const InfoCard = ({ image, title, shortInfo, detailedInfo, initalStock, initialOrderQuantity, price  }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [orderQuantity, setOrderQuantity] = useState(initialOrderQuantity);
    const [stock, setStock] = useState(initalStock);

   

    const handleFlip = () => {
      setIsFlipped(!isFlipped);
    };

    const handleAddToOrder = () => {
        setOrderQuantity(orderQuantity + 1);
        setStock(Math.max(0, stock - 1));
    };
    
    const handleRemoveFromOrder = () => {
        setOrderQuantity(Math.max(0, orderQuantity - 1)); // Prevent going below zero
        setStock(stock + 1);

    };
  
    // const [image, title, shortInfo, detailedInfo, initalStock, initialOrderQuantity, price ] = props
  
    return (
      <Card 
      sx={{ maxWidth: 300,  position: 'relative', padding:0}}> 
        {/* Front of the card */}
        <Box 
            sx={{ 
                transform: isFlipped ? 'rotateY(180deg)' : '',
                backfaceVisibility: 'hidden',
                transition: 'transform 0.3s, opacity 0.3s', /* Added opacity transition */
                opacity: isFlipped ? 0 : 1 /* Control opacity */
                }}
          >
            <CardMedia component="img" height="200" image={image} alt={title}
                sx={{ filter: stock === 0 ? 'grayscale(1)' : '' }} // Apply filter if out of stock
            />
 
        <CardContent>
            <Stack  direction="row" spacing={2}   justifyContent="space-between">
                <Typography variant="h5" color="text.primary">
                    {title}  {/* Space added for formatting */} 
                </Typography>
                <Typography variant="h5" color="text.primary" textAlign="right"> 
                    €{price.toFixed(2)}  {/* Price with formatting */}
                </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
                {stock ? shortInfo: <OutOfStockMessage/> }
            </Typography>
            <Grid container spacing={2} sx={{ marginTop: 1 }}> {/* Grid for layout */}
                <Grid item xs={6}>
                <Typography variant="body2">Verfügbar: {stock}</Typography>
                </Grid>
                <Grid item xs={6}>
                <Typography variant="body2">Bestellt: {orderQuantity}</Typography>
                </Grid>
                <Grid item xs={6}>
                <Button size="small" variant="contained" onClick={handleAddToOrder} disabled={stock === 0}>
                    Add
                </Button>
                </Grid>
                <Grid item xs={6}>
                <Button size="small" variant="contained" onClick={handleRemoveFromOrder} disabled={orderQuantity === 0}>
                    Remove
                </Button>
                </Grid>
            </Grid>
        </CardContent>
            <CardActions>
                <Button size="small" onClick={handleFlip}>
                    Informationen
                </Button>
                </CardActions>
            </Box>
        
        {/* Back of the card  */}
        <Box
        sx={{
            transform: isFlipped ? '' : 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            transition: 'transform 0.5s' /* Add transition here too */
          }}
        >
          <CardContent>
            <Typography variant="body1">{detailedInfo}</Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={handleFlip}>
              Back
            </Button>
          </CardActions>
        </Box>
      </Card>
    );
  };
  
  export default InfoCard;