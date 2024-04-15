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

const OutOfStockMessage = () => {
  return (
    <Typography variant="h6" color="error.main" component="span">
      Ausverkauft
    </Typography>
  );
};

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

  const shortInfo = "das gibt es noch nicht wwwwaaa";
  const detailedInfo = "das gibt es acuh noch nicht immernoch aaaa";

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleAddToOrder = () => {
    setOrderQuantity(orderQuantity + 1);
    setStock(Math.max(0, currentStock - 1));
    handelChange(id, "add");
  };

  const handleRemoveFromOrder = () => {
    setOrderQuantity(Math.max(0, orderQuantity - 1)); // Prevent going below zero
    setStock(currentStock + 1);
    handelChange(id, "rm");
  };

  return (
    <Card key={id} sx={{ maxWidth: 300, position: "relative", padding: 0 }}>
      {/* Front of the card */}
      <Box
        sx={{
          transform: isFlipped ? "rotateY(180deg)" : "",
          backfaceVisibility: "hidden",
          transition:
            "transform 0.3s, opacity 0.3s" /* Added opacity transition */,
          opacity: isFlipped ? 0 : 1 /* Control opacity */,
        }}
      >
        <CardContent>
          <Stack direction="row" spacing={2} justifyContent="space-between">
            <Typography variant="h5" color="text.primary">
              {name} {/* Space added for formatting */}
            </Typography>
            <Typography variant="h5" color="text.primary" textAlign="right">
              €{price.toFixed(2)} {/* Price with formatting */}
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {currentStock ? shortInfo : <OutOfStockMessage />}
          </Typography>
          <Grid container spacing={2} sx={{ marginTop: 1 }}>
            {" "}
            {/* Grid for layout */}
            <Grid item xs={6}>
              <Typography variant="body2">Verfügbar: {currentStock}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">Bestellt: {orderQuantity}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Button
                size="small"
                variant="contained"
                onClick={handleAddToOrder}
                disabled={currentStock === 0}
              >
                Add
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                size="small"
                variant="contained"
                onClick={handleRemoveFromOrder}
                disabled={orderQuantity === 0}
              >
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
          <Button size="small" onClick={handleFlip}>
            Back
          </Button>
        </CardActions>
      </Box>
    </Card>
  );
};

export default InfoCard;
