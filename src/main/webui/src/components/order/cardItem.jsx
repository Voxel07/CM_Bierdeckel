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
  const { key, productId, productName, productPrice, quantity, stock, category, extraItem } = product;
  console.log(extraItem)
  return (

    <Box key={key}>
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
            extraItem == null ? null : <Chip key={Math.random()} color="primary" label={extraItem.name} size="small" />
          }
        </Tooltip>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
        <ThemeProvider theme={theme2}>
          <Tooltip title="Menge erhöhen" placement="top">
          <IconButton aria-label="add" size="small" onClick={() => handleStockChange(productId, "add", category)} disabled={stock == 0}>
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
            aria-label="delete" size="small" onClick={() => handleStockChange(productId, "rm", category)}>
            <RemoveIcon fontSize="inherit" />
          </IconButton>
          </Tooltip>
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
