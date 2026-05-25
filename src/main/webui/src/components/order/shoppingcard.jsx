import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Badge from "@mui/material/Badge";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import CartItem from "./cardItem";
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { useOrder } from "./OrderContext";

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 480,
  maxHeight: '85vh',
  backgroundColor: 'rgba(9, 12, 17, 0.95)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(25, 152, 161, 0.25)',
  boxShadow: '0 24px 64px rgba(0, 0, 0, 0.6)',
  p: { xs: 3, sm: 4 },
  borderRadius: '24px',
  outline: 'none',
  display: 'flex',
  flexDirection: 'column'
};

export default function ShoppingCart() {
  const [open, setOpen] = React.useState(false);
  const { cardMetadata, displayItems, placeOrder, updateOrder, deleteOrder, orderId } = useOrder();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button 
        variant="outlined"
        onClick={handleOpen}
        sx={{
          borderRadius: '12px',
          borderColor: 'rgba(25, 152, 161, 0.4)',
          color: '#f5f0f3',
          px: 2,
          py: 1,
          textTransform: 'none',
          backgroundColor: 'rgba(25, 152, 161, 0.05)',
          '&:hover': {
            borderColor: '#1998a1',
            backgroundColor: 'rgba(25, 152, 161, 0.15)',
          }
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Badge
            color="primary"
            size="small"
            badgeContent={cardMetadata.itemCount}
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: '#1998a1',
                color: '#090c11',
                fontWeight: 700
              }
            }}
          >
            <ShoppingCartIcon size="small" sx={{ color: '#1998a1' }} />
          </Badge>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {cardMetadata.total.toFixed(2)}€
          </Typography>
        </Stack>
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="cart-modal-title"
        aria-describedby="cart-modal-description"
      >
        <Box sx={modalStyle}>
          {/* Header */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography id="cart-modal-title" variant="h5" sx={{ color: '#f5f0f3', fontWeight: 800 }}>
              Warenkorb
            </Typography>
            <Typography variant="h5" sx={{ color: '#1998a1', fontWeight: 800 }}>
              {cardMetadata.total.toFixed(2)}€
            </Typography>
          </Stack>

          <Divider sx={{ borderColor: 'rgba(25, 152, 161, 0.15)', mb: 3 }} />

          {/* Cart Items Area */}
          <Box sx={{ 
            flexGrow: 1, 
            overflowY: 'auto', 
            pr: 1,
            mb: 3,
            '&::-webkit-scrollbar': { width: '6px' },
            '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
            '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(25, 152, 161, 0.2)', borderRadius: '10px' }
          }}>
            {displayItems?.length ? (
              <Stack spacing={2}>
                {displayItems.map((product, index) => (
                  <CartItem key={index} product={product} />
                ))}
              </Stack>
            ) : (
              <Typography variant="body1" sx={{ color: '#8898a5', py: 6, textAlign: 'center' }}>
                Dein Warenkorb ist noch leer.
              </Typography>
            )}
          </Box>

          {/* Action Buttons */}
          <Stack 
            direction="row" 
            spacing={2} 
            justifyContent="space-between" 
            alignItems="center"
            sx={{ pt: 1 }}
          >
            <Stack direction="row" spacing={1.5}>
              {orderId ? (
                <>
                  <Button 
                    variant="contained" 
                    sx={{
                      backgroundColor: '#e67e22',
                      color: '#fff',
                      fontWeight: 700,
                      borderRadius: '10px',
                      textTransform: 'none',
                      '&:hover': { backgroundColor: '#d35400' }
                    }}
                    onClick={() => { updateOrder(); handleClose(); }}
                  >
                    Aktualisieren
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error"
                    sx={{
                      borderRadius: '10px',
                      textTransform: 'none',
                      borderColor: 'rgba(239, 83, 80, 0.4)',
                      '&:hover': { borderColor: '#ef5350', backgroundColor: 'rgba(239, 83, 80, 0.05)' }
                    }}
                    onClick={() => { deleteOrder(); handleClose(); }}
                  >
                    Löschen
                  </Button>
                </>
              ) : (
                <Button 
                  variant="contained" 
                  disabled={!displayItems?.length}
                  sx={{
                    backgroundColor: '#2ecc71',
                    color: '#fff',
                    fontWeight: 700,
                    borderRadius: '10px',
                    textTransform: 'none',
                    '&:hover': { backgroundColor: '#27ae60' },
                    '&.Mui-disabled': { backgroundColor: 'rgba(46, 204, 113, 0.15)', color: 'rgba(245, 240, 243, 0.25)' }
                  }}
                  onClick={() => { placeOrder(); handleClose(); }}
                >
                  Bestellen
                </Button>
              )}
            </Stack>

            <Tooltip title="Schließen" placement="top">
              <IconButton 
                onClick={handleClose}
                sx={{
                  border: '1px solid rgba(245, 240, 243, 0.12)',
                  borderRadius: '10px',
                  color: '#8898a5',
                  '&:hover': { color: '#f5f0f3', backgroundColor: 'rgba(245, 240, 243, 0.05)' }
                }}
              >
                <CloseIcon size="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}
