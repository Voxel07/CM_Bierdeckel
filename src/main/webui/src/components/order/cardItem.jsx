import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme2 = createTheme({
  components: {
    MuiTypography: {
      styleOverrides: {
       body1: { color: '#f5f0f3' },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '& .MuiSvgIcon-root': {
            color: '#f5f0f3',
          },
          '&:hover': {
            '& .MuiSvgIcon-root': {
              color: '#1998a1',
            },
          },
        },
      },
    },
  }
  });

function cardItem({product, handleStockChange}) {
  const { productId, productName, productPrice, quantity, stock } = product;
console.log(stock);
console.log(quantity);
  return (

    <Box key={productId + Math.random()}>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <Tooltip title="Bezeichung" placement="top">
          <Typography sx={{ minWidth: "80px", textAlign: "left" }}>
            {productName}
          </Typography>
        </Tooltip>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
        <ThemeProvider theme={theme2}>
          <IconButton aria-label="add" size="small" onClick={() => handleStockChange(productId, "add")} disabled={stock <= 0}>
            <AddIcon fontSize="inherit" />
          </IconButton>
          <Tooltip title="Menge" placement="top">
            <Typography sx={{ minWidth: "20px", textAlign: "center" }}>
              {quantity}
            </Typography>
          </Tooltip>
          <IconButton
            aria-label="delete" size="small" onClick={() => handleStockChange(productId, "rm")}>
            <RemoveIcon fontSize="inherit" />
          </IconButton>
          </ThemeProvider>
        </Stack>
        <Tooltip title="Einzelpreis" placement="top">
          <Typography sx={{ minWidth: "60px", textAlign: "right" }}>
            {productPrice}€
          </Typography>
        </Tooltip>
        <Tooltip title="Gesammtpreis" placement="top">
          <Typography sx={{ minWidth: "60px", textAlign: "right" }}>
          {(productPrice * quantity).toFixed(2)}€
          </Typography>
        </Tooltip>
        <IconButton color="error">
          <Tooltip title="Produkt löschen" placement="top" onClick={() => handleStockChange(productId, "clear")}>
            <DeleteIcon />
          </Tooltip>
        </IconButton>
      </Stack>
      <Divider/>
    </Box>
  );
}

export default cardItem;
