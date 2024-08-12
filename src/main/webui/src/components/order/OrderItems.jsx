import React from "react";
import InfoCard from "./InfoCard";
import { Grid, Divider, Chip } from "@mui/material";

function OrderItems({ products, handleStockChange, displayItems }) {
  // Separate products into those with and without extras
  const productsWithExtras = products.filter(product => product.compatibleExtras.length > 0);

 // Sort products with extras into categories
 const sortedProducts = productsWithExtras.reduce((acc, product) => {
  const extra = product.compatibleExtras[0] || { id: "no-extra", name: "No Extra", price: 0 };
  if (!acc[extra.id]) {
    acc[extra.id] = {
      products: [],
      extra: extra
    };
  }
  acc[extra.id].products.push(product);
  return acc;
}, {});

  return (
    <Grid container direction="column" spacing={4}>
      {/* Render products without extras */}
      <Grid item>
        <Grid container spacing={2}>
          {products.map((product, index) => (
            <Grid key={`no-extra-${index}`} item xs={12} sm={6} md={4} lg={3} sx={{ display: "flex", justifyContent: "center" }}>
              <InfoCard
                data={product}
                userData={displayItems}
                handelChange={handleStockChange}
                extra={null}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>

      {/* Render products with extras, sorted by category */}
      {Object.entries(sortedProducts).map(([extraId, { products: categoryProducts, extra }], categoryIndex) => (
        <Grid item key={extraId}>
          <Divider variant="middle">
            <Chip label={extra.name} size="medium" color="primary" />
          </Divider>
          <Grid container spacing={2} style={{ marginTop: '10px', display: "flex", justifyContent: "center" }}>
            {categoryProducts.map((product, productIndex) => (
              <Grid key={`${extraId}-${productIndex}`} item xs={12} sm={6} md={4} lg={3} sx={{ display: "flex", justifyContent: "center" }}>
                <InfoCard
                  data={product}
                  userData={displayItems}
                  handelChange={handleStockChange}
                  extra={extra}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
}

export default OrderItems;