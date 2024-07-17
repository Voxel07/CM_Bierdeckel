import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";


export const StateOverviewItem = ({item}) => {

    const { productId, productName, quantity } = item

    return(
        <Box key={productId}>
            <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
                <Typography>{productName}:</Typography>
                <Typography>{quantity}</Typography>
            </Stack>
        </Box>
    )
}