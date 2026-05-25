import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import Chip from '@mui/material/Chip';
import { useOrder } from "./OrderContext";

function CartItem({ product }) {
  const { handleStockChange } = useOrder();
  const { productId, productName, productPrice, quantity, stock, category, extraItems } = product;

  const extrasList = extraItems ? extraItems.map(ei => ei.extras) : [];
  const extrasPrice = extrasList.reduce((sum, e) => sum + e.price, 0);
  const totalUnitPrice = productPrice + extrasPrice;

  const handleAdd = () => {
    handleStockChange(productId, "add", category, extrasList);
  };

  const handleRemove = () => {
    handleStockChange(productId, "rm", category, extrasList);
  };

  const handleClear = () => {
    handleStockChange(productId, "clear", category, extrasList);
  };

  return (
    <Box 
      sx={{ 
        py: 1.5, 
        borderBottom: '1px solid rgba(25, 152, 161, 0.1)',
        "&:last-child": { borderBottom: 'none' }
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center" justifyContent="space-between">
        
        {/* Product details & extras chips */}
        <Stack spacing={0.5} sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="body1" sx={{ color: '#f5f0f3', fontWeight: 600, noWrap: true }}>
            {productName}
          </Typography>
          {extrasList.length > 0 && (
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ gap: 0.5 }}>
              {extrasList.map((extra) => (
                <Chip
                  key={extra.id}
                  label={extra.name}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(25, 152, 161, 0.1)',
                    color: '#1998a1',
                    border: '1px solid rgba(25, 152, 161, 0.25)',
                    fontSize: '0.7rem',
                    height: '20px',
                    '& .MuiChip-label': { px: 1 }
                  }}
                />
              ))}
            </Stack>
          )}
        </Stack>

        {/* Quantity Adjusters */}
        <Stack direction="row" alignItems="center" spacing={1}>
          <Tooltip title="Entfernen" placement="top">
            <IconButton 
              size="small" 
              onClick={handleRemove}
              sx={{ 
                color: '#8898a5', 
                border: '1px solid rgba(245, 240, 243, 0.08)',
                '&:hover': { color: '#ef5350', borderColor: '#ef5350' } 
              }}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Typography sx={{ color: '#f5f0f3', minWidth: 24, textAlign: 'center', fontWeight: 700 }}>
            {quantity}
          </Typography>

          <Tooltip title="Hinzufügen" placement="top">
            <IconButton 
              size="small" 
              onClick={handleAdd}
              disabled={stock === 0}
              sx={{ 
                color: '#8898a5', 
                border: '1px solid rgba(245, 240, 243, 0.08)',
                '&:hover': { color: '#1998a1', borderColor: '#1998a1' },
                '&.Mui-disabled': { color: 'rgba(245, 240, 243, 0.1)', borderColor: 'rgba(245, 240, 243, 0.05)' }
              }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Prices */}
        <Stack spacing={0.2} sx={{ minWidth: 65, alignItems: 'flex-end' }}>
          <Typography variant="body2" sx={{ color: '#f5f0f3', fontWeight: 700 }}>
            €{(totalUnitPrice * quantity).toFixed(2)}
          </Typography>
          {quantity > 1 && (
            <Typography variant="caption" sx={{ color: '#8898a5' }}>
              €{totalUnitPrice.toFixed(2)}/Stk.
            </Typography>
          )}
        </Stack>

        {/* Delete button */}
        <Tooltip title="Eintrag löschen" placement="top">
          <IconButton 
            size="small"
            onClick={handleClear}
            sx={{ 
              color: 'rgba(239, 83, 80, 0.5)', 
              '&:hover': { color: '#ef5350', backgroundColor: 'rgba(239, 83, 80, 0.05)' } 
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>

      </Stack>
    </Box>
  );
}

export default CartItem;
