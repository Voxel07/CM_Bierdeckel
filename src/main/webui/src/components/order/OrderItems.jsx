import React, { useEffect, useState, useRef } from "react";

import axios from "axios";

import InfoCard from "./InfoCard";
import { Grid, Divider, Chip } from "@mui/material";

function OrderItems({products, handleStockChange, displayItems}) {
  return (
    <Grid container className="grid-container" rowSpacing={5} direction="row" justifyContent="center" >
      {products?.length
        ? products.map((product, index) => (
            <Grid key={index}  item xl={3} lg={4} md={6} xs={12} sx={{ display: "flex", justifyContent: "center" }}>
              <InfoCard
                data={product}
                userData={displayItems}
                handelChange={handleStockChange}
              />
            </Grid>
          ))
        : null}

      {/* <Grid item xs={12}>
        <Divider ariant="inset" >
          <Chip label="Curry" size="big" color="primary" sx={{ margin: 10 }} />
        </Divider>
      </Grid> */}
    </Grid>
  );
}

export default OrderItems;
