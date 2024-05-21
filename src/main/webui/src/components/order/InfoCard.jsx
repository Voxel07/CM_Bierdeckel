import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material';


const OutOfStockMessage = () => {
  return (
    <Typography variant="h6" color="error.main" component="span">
      Ausverkauft
    </Typography>
  );
};

const theme2 = createTheme({
  components: {
    MuiTypography: {
      styleOverrides: {
       h5: { color: '#f5f0f3' },
       body1: { color: '#f5f0f3' },
       body2: { color: '#f5f0f3' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#f5f0f3',
          borderColor: '#1998a1',
          '&:hover': {
            backgroundColor: '#1998a1',
            color: '#f5f0f3',
          },
        },
      },
    }}});

const InfoCard = ({ data, userData, handelChange }) => {
  const { id, name, price, stock } = data;

  const [isFlipped, setIsFlipped] = useState(false);
  const [orderQuantity, setOrderQuantity] = useState(0);
  const [currentStock, setStock] = useState(stock);

  // Find matching item in userData (if it exists)
  // Set initial orderQuantity based on userData
  useEffect(() => {
    if (userData === 0 || typeof userData !== "object") {
      setOrderQuantity(0);
      return; // Exit early if userData is not valid
    }
    const matchingItem = userData?.find((item) => item.productId === id);

    if (matchingItem) {
      setOrderQuantity(matchingItem.quantity);
    } else {
      setOrderQuantity(0);
    }
  }, [id, userData]); // Run the effect when matchingItem or id changes

  const shortInfo = "hier könnte eine kurze Info stehen";
  const detailedInfo = "Hier kann ein langer Zusatz stehen, falls jeder Kunde für sich selber bestellen sollte. Da brauche ich aber noch ein bisschen bis das gescheit umgesetzt werdn kann. Bis dahin sthet das einfach mal so hier.";

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleAddToOrder = () => {
    // setStock(Math.max(0, currentStock - 1));
    handelChange(id, "add");
  };

  const handleRemoveFromOrder = () => {
    // setStock(currentStock + 1);
    handelChange(id, "rm");
  };

  return (
     <ThemeProvider theme={theme2}>

    <Card key={id} sx={{ maxWidth: 300, position: "relative", padding: 0, backgroundColor: "#083036" }}>
      {/* Front of the card */}
      <Box
        sx={{
          transform: isFlipped ? "rotateY(180deg)" : "",
          backfaceVisibility: "hidden",
          transition:
            "transform 0.3s, opacity 0.3s",
          opacity: isFlipped ? 0 : 1,
        }}
      >
        <CardContent>
          <Stack direction="row" spacing={2} justifyContent="space-between">
            <Typography variant="h5">
              {name}
            </Typography>
            <Typography variant="h5" textAlign="right">
              €{price.toFixed(2)}
            </Typography>
          </Stack>
          <Typography variant="body2">
            {stock ? shortInfo : <OutOfStockMessage />}
          </Typography>
          <Grid container spacing={2} sx={{ marginTop: 1 }}>
            {" "}
            <Grid item xs={6}>
              <Typography variant="body2">Verfügbar: {stock}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Bestellt: {orderQuantity}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Button
                size="small"
                variant="outlined"
                onClick={handleAddToOrder}
                disabled={stock === 0}
              >
                Add
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                size="small"
                variant="outlined"
                onClick={handleRemoveFromOrder}
                disabled={orderQuantity === 0}
              >
                Remove
              </Button>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button size="small" variant='outlined'  onClick={handleFlip} sx={{color:"#a64913"}}>
            Informationen
          </Button>
        </CardActions>
      </Box>

      {/* Back of the card  */}
      <Box
        sx={{
          transform: isFlipped ? "" : "rotateY(180deg)",
          backfaceVisibility: "hidden",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          transition: "transform 0.5s" /* Add transition here too */,
        }}
      >
        <CardContent>
          <Typography variant="body1">{detailedInfo}</Typography>
        </CardContent>
        <CardActions>
          <Button size="small" variant='outlined' onClick={handleFlip} sx={{color:"#a64913"}}>
            Back
          </Button>
        </CardActions>
      </Box>
    </Card>
   </ThemeProvider>
  );
};

export default InfoCard;
