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
import Chip from '@mui/material/Chip';

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
  const { productId, productName, productPrice, quantity, stock, category, extraItems } = product;
  const extraItem = extraItems && extraItems.length > 0 ? extraItems[0].extras : null;
  const extraName = extraItem ? extraItem.name : '';
  const extraPrice = extraItem ? extraItem.price : 0;

  return (

    <Box key={productId}>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <Tooltip title="Bezeichung" placement="top">
          <Typography sx={{ minWidth: "120px", textAlign: "left" }}>
            {productName}
          </Typography>
        </Tooltip>
        <Tooltip title="Bezeichung" placement="top">
          {
            extraItems.length > 0 ?  <Chip color="primary" label={extraName} size="small" /> : null
          }
        </Tooltip>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
        <ThemeProvider theme={theme2}>
          <Tooltip title="Menge erhöhen" placement="top">
          <IconButton aria-label="add" size="small" onClick={() => handleStockChange(productId, "add", category, extraItem)} disabled={stock == 0}>
            <AddIcon fontSize="inherit" />
          </IconButton>
          </Tooltip>
          <Tooltip title="Menge" placement="top">
            <Typography sx={{ minWidth: "20px", textAlign: "center" }}>
              {quantity}
            </Typography>
          </Tooltip>
          <Tooltip title="Menge veringern"  placement="top">
          <IconButton
            aria-label="delete" size="small" onClick={() => handleStockChange(productId, "rm", category, extraItem)}>
            <RemoveIcon fontSize="inherit" />
          </IconButton>
          </Tooltip>
          </ThemeProvider>
        </Stack>
        <Tooltip title="Einzelpreis" placement="top">
          <Typography sx={{ minWidth: "50px", textAlign: "right" }}>
          {(productPrice + extraPrice).toFixed(2)}€
          </Typography>
        </Tooltip>
        <Tooltip title="Gesammtpreis" placement="top">
          <Typography sx={{ minWidth: "50px", textAlign: "right" }}>
          {((productPrice + extraPrice) * quantity).toFixed(2)}€
          </Typography>
        </Tooltip>
        <IconButton color="error" onClick={() => handleStockChange(productId, "clear", category)}>
          <Tooltip title="Produkt löschen" placement="top" >
            <DeleteIcon />
          </Tooltip>
        </IconButton>
      </Stack>
      <Divider/>
    </Box>
  );
}

export default cardItem;
