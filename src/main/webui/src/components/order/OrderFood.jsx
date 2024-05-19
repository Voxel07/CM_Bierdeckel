import React, { useEffect, useState, useRef } from "react";

import axios from "axios";

import InfoCard from "./InfoCard";
import { Grid, Divider, Chip } from "@mui/material";

function OrderFood({products, handleStockChange, displayItems}) {
  return (
    <Grid className="grid-container" container direction="row" rowSpacing={2} justifyContent="space-between" alignItems="center">
      {products?.length
        ? products.map((product) => (
            <Grid item xl={3} lg={4} md={6} xs={12} sx={{ display: "flex", justifyContent: "center" }}>
              <InfoCard
                data={product}
                userData={displayItems}
                handelChange={handleStockChange}
              />
            </Grid>
          ))
        : null}

      <Grid item xs={12}>
        <Divider ariant="inset" >
          <Chip label="Curry" size="big" color="primary" sx={{ margin: 10 }} />
        </Divider>
      </Grid>
    </Grid>
  );
}

export default OrderFood;
