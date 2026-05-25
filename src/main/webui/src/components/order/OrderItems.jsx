import React from "react";
import InfoCard from "./InfoCard";

// Note: If MUI version in package.json is 7, we can use Grid from @mui/material.
// Let's import standard Grid from @mui/material to be safe.
import { Grid } from "@mui/material";

function OrderItems({ products }) {
  return (
    <Grid container spacing={3} justifyContent="flex-start" sx={{ px: 1 }}>
      {products.map((product) => (
        <Grid key={product.id} item xs={12} sm={6} md={4} lg={3}>
          <InfoCard data={product} />
        </Grid>
      ))}
    </Grid>
  );
}

export default OrderItems;