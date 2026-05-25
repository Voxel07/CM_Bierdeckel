import React from 'react';
import { Box, Chip } from '@mui/material';

export const StateOverviewItem = ({ displayItems }) => {
  if (!displayItems || displayItems.length === 0) return null;

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 1, 
        justifyContent: 'flex-start',
        p: 1.5,
        mt: 0.5,
        mb: 1.5,
        borderRadius: '12px',
        backgroundColor: 'rgba(9, 12, 17, 0.4)',
        border: '1px solid rgba(25, 152, 161, 0.1)',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      {displayItems.map((item) => (
        <Chip
          key={item.productId}
          label={`${item.productName}: ${item.quantity}`}
          size="small"
          sx={{
            backgroundColor: 'rgba(25, 152, 161, 0.08)',
            color: '#1998a1',
            border: '1px solid rgba(25, 152, 161, 0.2)',
            fontSize: '0.75rem',
            fontWeight: 600,
            '& .MuiChip-label': { px: 1 }
          }}
        />
      ))}
    </Box>
  );
};
export default StateOverviewItem;