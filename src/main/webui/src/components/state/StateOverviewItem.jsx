import React from 'react';
import { Paper, Box, Stack, Typography } from '@mui/material';

export const StateOverviewItem = ({ displayItems }) => {
  return (
    <Paper className='header'>
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 2, 
        maxWidth: '285px', 
        margin: '0 auto'  // Centers the box if it's narrower than its container
      }}>
        {displayItems?.length ? (
          displayItems.map((item) => (
            <Box
              key={item.productId}
              sx={{
                flexGrow: 0,
                flexShrink: 0,
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography noWrap>{item.productName}:</Typography>
                <Typography>{item.quantity}</Typography>
              </Stack>
            </Box>
          ))
        ) : null}
      </Box>
    </Paper>
  );
};