import React from "react";
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import FaceIcon from '@mui/icons-material/Face';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import IconButton from '@mui/material/IconButton';

const StateItem = ({ data, next, previous, pHandleSetSelectedITems }) => {
  const { key, userId, product, quantity, orderStatus } = data;
  
  return (
    <Card 
      key={key} 
      sx={{ 
        width: '100%',
        boxSizing: 'border-box',
        marginTop: 1.5, 
        padding: 2, 
        borderRadius: '12px', 
        backgroundColor: "rgba(9, 12, 17, 0.6)",
        border: "1px solid rgba(25, 152, 161, 0.15)",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-2px)",
          borderColor: "rgba(25, 152, 161, 0.4)",
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)"
        }
      }}
    >
      <Stack spacing={1.5}>
        {/* User and Product Info */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0, flex: 1 }}>
            <Chip 
              icon={<FaceIcon size="small" />}  
              size="small" 
              label={`U#${userId}`} 
              variant="outlined" 
              sx={{
                borderColor: '#1998a1',
                color: '#1998a1',
                fontWeight: 600,
                backgroundColor: 'rgba(25, 152, 161, 0.05)',
                '& .MuiChip-icon': { color: '#1998a1' }
              }}
            />
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#f5f0f3', 
                fontWeight: 700, 
                wordBreak: 'break-word',
                lineHeight: 1.3
              }}
            >
              {quantity > 1 ? `${quantity}x ` : ""}{product.name}
            </Typography>
          </Stack>
        </Stack>

        {/* Action Controls */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <IconButton 
            size="small" 
            onClick={() => previous(data)}
            disabled={orderStatus === "ORDERED"}
            sx={{
              color: '#8898a5',
              border: '1px solid rgba(245, 240, 243, 0.08)',
              "&:hover": { color: '#ef5350', borderColor: '#ef5350' },
              "&.Mui-disabled": { color: 'rgba(245, 240, 243, 0.1)', borderColor: 'rgba(245, 240, 243, 0.03)' }
            }}
          >
            <ArrowBackIcon fontSize="inherit" />
          </IconButton>
          
          <Checkbox 
            checked={data.selected || false} 
            onChange={() => pHandleSetSelectedITems(data)}
            size="small"
            sx={{
              color: "rgba(25, 152, 161, 0.4)",
              "&.Mui-checked": { color: "#1998a1" }
            }}
          />

          <IconButton 
            size="small" 
            onClick={() => next(data)}
            disabled={orderStatus === "DELIVERED"}
            sx={{
              color: '#8898a5',
              border: '1px solid rgba(245, 240, 243, 0.08)',
              "&:hover": { color: '#1998a1', borderColor: '#1998a1' },
              "&.Mui-disabled": { color: 'rgba(245, 240, 243, 0.1)', borderColor: 'rgba(245, 240, 243, 0.03)' }
            }}
          >
            <ArrowForwardIcon fontSize="inherit" />
          </IconButton>
        </Stack>
      </Stack>
    </Card>
  );
};

export default StateItem;