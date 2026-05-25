import React from "react";
import Box from "@mui/material/Box";
import { Tab, Container, useMediaQuery, useTheme } from "@mui/material";
import { TabList, TabPanel, TabContext } from '@mui/lab';
import Stack from "@mui/material/Stack";
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import SportsBarIcon from "@mui/icons-material/SportsBar";

import OrderItems from "../components/order/OrderItems";
import ShoppingCart from "../components/order/shoppingcard";
import Userselection from "../components/order/userSelection";
import { OrderProvider, useOrder } from "../components/order/OrderContext";

function OrderContent() {
  const [tabValue, setTabValue] = React.useState("1");
  const { products, drinks, selectedUser } = useOrder();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Top Header Section */}
      <Stack
        direction={isMobile ? "column" : "row"}
        spacing={3}
        justifyContent="space-between"
        alignItems="center"
        sx={{
          mb: 4,
          p: 3,
          borderRadius: 4,
          background: "linear-gradient(135deg, rgba(8, 48, 54, 0.4) 0%, rgba(9, 12, 17, 0.6) 100%)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(25, 152, 161, 0.15)",
        }}
      >
        <Userselection />
        <ShoppingCart />
      </Stack>

      {/* Product categories */}
      {selectedUser ? (
        <TabContext value={tabValue}>
          <Box sx={{
            borderBottom: "1px solid rgba(25, 152, 161, 0.2)",
            mb: 3,
            display: 'flex',
            justifyContent: 'center'
          }}>
            <TabList
              textColor="primary"
              indicatorColor="primary"
              onChange={handleTabChange}
              aria-label="Product category tabs"
              centered
              sx={{
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                }
              }}
            >
              <Tab
                icon={<LunchDiningIcon />}
                iconPosition="start"
                value="1"
                label="Essen"
                sx={{ fontSize: '1rem', fontWeight: 600, px: 4, minHeight: 64 }}
              />
              <Tab
                icon={<SportsBarIcon />}
                iconPosition="start"
                value="2"
                label="Trinken"
                sx={{ fontSize: '1rem', fontWeight: 600, px: 4, minHeight: 64 }}
              />
            </TabList>
          </Box>
          <TabPanel value="1" sx={{ px: 0, py: 2 }}>
            <OrderItems products={products} />
          </TabPanel>
          <TabPanel value="2" sx={{ px: 0, py: 2 }}>
            <OrderItems products={drinks} />
          </TabPanel>
        </TabContext>
      ) : (
        <Box sx={{
          textAlign: 'center',
          py: 8,
          borderRadius: 4,
          background: "rgba(9, 12, 17, 0.4)",
          border: "1px dashed rgba(25, 152, 161, 0.3)"
        }}>
          <h3 style={{ color: '#1998a1', fontWeight: 600, margin: '0 0 8px 0' }}>Kein Benutzer ausgewählt</h3>
          <p style={{ color: '#a0aab4', margin: 0 }}>Bitte wähle oben einen Benutzer aus, um mit der Bestellung zu beginnen.</p>
        </Box>
      )}
    </Container>
  );
}

export default function Order() {
  return (
    <OrderProvider>
      <OrderContent />
    </OrderProvider>
  );
}
