import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Grid,
  Stack,
  CardContent,
  Typography,
  CardActions,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
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
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#f5f0f3',
          '&.Mui-checked': {
            color: '#1998a1',
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          color: '#f5f0f3',
        },
      },
    },
  }
});

const InfoCard = ({ data, userData, handelChange, extra}) => {
  const { id, name, price, stock, category, consumption } = data;

  const [cardState, setCardState] = useState('front'); // 'front', 'info', or 'extras'
  const [orderQuantity, setOrderQuantity] = useState(0);
  const [extras, setExtras] = useState({
    extra1: false,
    extra2: false,
    extra3: false,
  });

  useEffect(() => {
    if (userData === 0 || typeof userData !== "object") {
      setOrderQuantity(0);
      return;
    }
    const matchingItem = userData?.find((item) => item.productId === id);

    if (matchingItem) {
      setOrderQuantity(matchingItem.quantity);
    } else {
      setOrderQuantity(0);
    }
  }, [id, userData]);

  const shortInfo = "hier könnte eine kurze Info stehen";
  const detailedInfo = "Hier kann ein langer Zusatz stehen, falls jeder Kunde für sich selber bestellen sollte. Da brauche ich aber noch ein bisschen bis das gescheit umgesetzt werdn kann. Bis dahin sthet das einfach mal so hier.";

  const handleFlip = (side) => {
    setCardState(side);
  };

  const handleAddToOrder = (extra) => {
    handelChange(id, "add", category, extra);
  };

  const handleRemoveFromOrder = () => {
    handelChange(id, "rm", category);
  };

  const handleExtraChange = (event) => {
    setExtras({ ...extras, [event.target.name]: event.target.checked });
  };

  return (
    <ThemeProvider theme={theme2}>
      <Card key={id} sx={{ maxWidth: 300, position: "relative", padding: 0, backgroundColor: "#083036" }}>
        {/* Front of the card */}
        <Box
          sx={{
            transform: cardState === 'front' ? "" : "rotateY(180deg)",
            backfaceVisibility: "hidden",
            transition: "transform 0.3s, opacity 0.3s",
            opacity: cardState === 'front' ? 1 : 0,
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
              <Grid item xs={6}>
                <Typography variant="body2">Verfügbar: {stock - consumption}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">Bestellt: {orderQuantity}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleAddToOrder(extra)}
                  disabled={stock === 0}
                >
                  Hinzufügen
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleRemoveFromOrder}
                  disabled={orderQuantity === 0}
                >
                  Entfernen
                </Button>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Stack direction="row" spacing={9} justifyContent="space-around"> 
              <Button size="small" variant='outlined' onClick={() => handleFlip('info')} sx={{color:"#a64913"}}>
                Informationen
              </Button>
              <Button size="small" variant='outlined' onClick={() => handleFlip('extras')} sx={{color:"#a64913"}}>
                Extras
              </Button>
            </Stack>
          </CardActions>
        </Box>

        {/* Info side of the card */}
        <Box
          sx={{
            transform: cardState === 'info' ? "" : "rotateY(180deg)",
            backfaceVisibility: "hidden",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            transition: "transform 0.5s",
          }}
        >
          <CardContent>
            <Typography variant="body1">{detailedInfo}</Typography>
          </CardContent>
          <CardActions>
            <Button size="small" variant='outlined' onClick={() => handleFlip('front')} sx={{color:"#a64913"}}>
              Back
            </Button>
          </CardActions>
        </Box>

        {/* Extras side of the card */}
        <Box
          sx={{
            transform: cardState === 'extras' ? "" : "rotateY(180deg)",
            backfaceVisibility: "hidden",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            transition: "transform 0.5s",
          }}
        >
       <CardContent>
            <Typography variant="h6" sx={{ marginBottom: 2 }}>Extras</Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox checked={extras.extra1} onChange={handleExtraChange} name="extra1" />}
                    label="Extra 1"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={extras.extra2} onChange={handleExtraChange} name="extra2" />}
                    label="Extra 2"
                  />
                </FormGroup>
              </Grid>
              <Grid item xs={6}>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox checked={extras.extra3} onChange={handleExtraChange} name="extra3" />}
                    label="Extra 3"
                  />
                  <FormControlLabel
                    control={<Checkbox checked={extras.extra4} onChange={handleExtraChange} name="extra4" />}
                    label="Extra 4"
                  />
                </FormGroup>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
            <Button size="small" variant='outlined' onClick={() => handleFlip('front')} sx={{color:"#a64913"}}>
              Back
            </Button>
          </CardActions>
        </Box>
      </Card>
    </ThemeProvider>
  );
};

export default InfoCard;