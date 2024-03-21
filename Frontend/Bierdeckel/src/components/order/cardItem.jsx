import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";

function cardItem({product, handleStockChange}) {
  const { productId, productName, productPrice, quantity } = product;

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
          <IconButton aria-label="add" size="small" onClick={handleStockChange(productId, "add")}>
            <AddIcon fontSize="inherit" />
          </IconButton>
          <Tooltip title="Menge" placement="top">
            <Typography sx={{ minWidth: "20px", textAlign: "center" }}>
              {quantity}
            </Typography>
          </Tooltip>
          <IconButton
            aria-label="delete" size="small" onClick={handleStockChange(productId, "rm")}>
            <RemoveIcon fontSize="inherit" />
          </IconButton>
        </Stack>
        <Tooltip title="Einzelpreis" placement="top">
          <Typography sx={{ minWidth: "60px", textAlign: "right" }}>
            {productPrice}€
          </Typography>
        </Tooltip>
        <Tooltip title="Gesammtpreis" placement="top">
          <Typography sx={{ minWidth: "60px", textAlign: "right" }}>
            {productPrice * quantity}€
          </Typography>
        </Tooltip>
        <IconButton color="error">
          <Tooltip title="Produkt löschen" placement="top" onClick={handleStockChange(productId, "clear")}> 
            <DeleteIcon />
          </Tooltip>
        </IconButton>
      </Stack>
      <Divider />
    </Box>
  );
}

export default cardItem;
