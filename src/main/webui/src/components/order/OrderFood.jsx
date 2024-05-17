import React, { useEffect, useState, useRef } from "react";

import axios from "axios";

import InfoCard from "./InfoCard";
import { Grid, Divider, Chip } from "@mui/material";

import "./OrderStyle.css";

function OrderFood({products, handleStockChange, displayITems}) {
  return (
    <Grid className="grid-container" container>
      {products?.length
        ? products.map((product) => (
            <Grid className="grid-item" item xl={3} lg={4} md={6} xs={12}>
              <InfoCard
                data={product}
                userData={displayITems}
                handelChange={handleStockChange}
              />
            </Grid>
          ))
        : null}

      <Grid item xs={12}>
        <Divider
          ariant="inset"
          sx={{
            "&::before, &::after": {
              borderColor: "primary.light",
            },
          }}
        >
          <Chip label="Curry" size="big" color="primary" sx={{ margin: 10 }} />
        </Divider>
      </Grid>
      {/* <pre>{JSON.stringify(newItems, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(displayITems, null, 2)}</pre> */}

      {/* <Grid className='grid-item' item xl={3} lg={4} md={6} xs={12}>
            <InfoCard
                image="https://picsum.photos/id/10/2500/1667" // Placeholder image
                title="Bratwurst"
                price={5}
                shortInfo="This is some short info about the item."
                detailedInfo="Here is a more detailed description with additional information..."
                initalStock={5}
                initialOrderQuantity = {1}
            />
        </Grid>
        <Grid className='grid-item' item xl={3} lg={4} md={6} xs={12}>
            <InfoCard
                image="https://picsum.photos/id/10/2500/1667" // Placeholder image
                title="Bratwurst"
                price={5}
                shortInfo="This is some short info about the item."
                detailedInfo="Here is a more detailed description with additional information..."
                initalStock={5}
                initialOrderQuantity = {1}
            />
        </Grid>
        <Grid className='grid-item' item xl={3} lg={4} md={6} xs={12}>
            <InfoCard
                image="https://picsum.photos/id/10/2500/1667" // Placeholder image
                title="Bratwurst"
                price={5}
                shortInfo="This is some short info about the item."
                detailedInfo="Here is a more detailed description with additional information..."
                initalStock={5}
                initialOrderQuantity = {1}
            />
        </Grid> */}
    </Grid>
  );
}

export default OrderFood;
