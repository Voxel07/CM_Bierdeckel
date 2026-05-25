import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Grid,
  Stack,
  CardContent,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Collapse,
  IconButton
} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useOrder } from "./OrderContext";

const OutOfStockMessage = () => {
  return (
    <Typography variant="body2" sx={{ color: "#ff4d4f", fontWeight: "bold" }}>
      Ausverkauft
    </Typography>
  );
};

const InfoCard = ({ data }) => {
  const { id, name, price, stock, category, consumption, compatibleExtras } = data;
  const { displayItems, handleStockChange } = useOrder();

  const [expanded, setExpanded] = useState(false);
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);

  // Calculate the total quantity of the product ordered across all extras combinations
  useEffect(() => {
    const qty = displayItems
      .filter(item => item.productId === id)
      .reduce((sum, item) => sum + item.quantity, 0);
    setTotalQuantity(qty);
  }, [displayItems, id]);

  const hasExtras = compatibleExtras && compatibleExtras.length > 0;
  const totalPrice = price + selectedExtras.reduce((sum, e) => sum + e.price, 0);
  const isAvailable = stock > consumption;

  const handleToggleExtra = (extra) => {
    setSelectedExtras((prev) => {
      const exists = prev.some((e) => e.id === extra.id);
      if (exists) {
        return prev.filter((e) => e.id !== extra.id);
      } else {
        return [...prev, extra];
      }
    });
  };

  const handleAdd = () => {
    handleStockChange(id, "add", category, selectedExtras);
  };

  return (
    <Card 
      sx={{ 
        width: "100%", 
        minWidth: 260,
        backgroundColor: "rgba(18, 28, 37, 0.45)", 
        backdropFilter: "blur(12px)",
        borderRadius: "16px",
        border: "1px solid rgba(25, 152, 161, 0.15)",
        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-4px)",
          borderColor: "rgba(25, 152, 161, 0.45)",
          boxShadow: "0 12px 40px 0 rgba(25, 152, 161, 0.15)",
        }
      }}
    >
      <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
        <Stack spacing={2}>
          {/* Title and Price */}
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={1}>
            <Typography variant="h6" sx={{ color: "#f5f0f3", fontWeight: 700, lineHeight: 1.2 }}>
              {name}
            </Typography>
            <Typography variant="h6" sx={{ color: "#1998a1", fontWeight: 700 }}>
              €{totalPrice.toFixed(2)}
            </Typography>
          </Stack>

          {/* Stock and Ordered Count Info */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="caption" sx={{ color: "#8898a5" }}>
              Verfügbar: {isAvailable ? (stock - consumption) : <OutOfStockMessage />}
            </Typography>
            {totalQuantity > 0 && (
              <Box 
                sx={{ 
                  backgroundColor: "rgba(25, 152, 161, 0.15)", 
                  color: "#1998a1", 
                  px: 1.5, 
                  py: 0.5, 
                  borderRadius: "20px",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  border: "1px solid rgba(25, 152, 161, 0.3)"
                }}
              >
                {totalQuantity} bestellt
              </Box>
            )}
          </Stack>

          {/* Extras Toggle Link */}
          {hasExtras && (
            <Box>
              <Button
                size="small"
                onClick={() => setExpanded(!expanded)}
                endIcon={expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                sx={{
                  color: "#8898a5",
                  textTransform: "none",
                  p: 0,
                  fontSize: "0.85rem",
                  "&:hover": { color: "#1998a1", backgroundColor: "transparent" }
                }}
              >
                Zusatzoptionen ansehen
              </Button>

              <Collapse in={expanded} timeout="auto" unmountOnExit sx={{ mt: 1 }}>
                <Box 
                  sx={{ 
                    p: 2, 
                    borderRadius: "10px", 
                    backgroundColor: "rgba(9, 12, 17, 0.6)",
                    border: "1px solid rgba(25, 152, 161, 0.1)"
                  }}
                >
                  <FormGroup>
                    {compatibleExtras.map((extra) => {
                      const isChecked = selectedExtras.some(e => e.id === extra.id);
                      return (
                        <FormControlLabel
                          key={extra.id}
                          control={
                            <Checkbox
                              checked={isChecked}
                              onChange={() => handleToggleExtra(extra)}
                              size="small"
                              sx={{
                                color: "rgba(25, 152, 161, 0.4)",
                                "&.Mui-checked": { color: "#1998a1" },
                              }}
                            />
                          }
                          label={
                            <Typography variant="body2" sx={{ color: "#d1d5db", fontSize: "0.85rem" }}>
                              {extra.name} (+€{extra.price.toFixed(2)})
                            </Typography>
                          }
                          sx={{ m: 0, py: 0.5 }}
                        />
                      );
                    })}
                  </FormGroup>
                </Box>
              </Collapse>
            </Box>
          )}

          {/* Add Button */}
          <Box sx={{ pt: 1 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleAdd}
              disabled={!isAvailable}
              sx={{
                backgroundColor: isAvailable ? "#1998a1" : "rgba(25, 152, 161, 0.12)",
                color: isAvailable ? "#090c11" : "rgba(245, 240, 243, 0.3)",
                fontWeight: 700,
                borderRadius: "10px",
                textTransform: "none",
                py: 1,
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#157f87",
                  boxShadow: "none",
                }
              }}
            >
              Hinzufügen
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default InfoCard;