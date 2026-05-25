import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { summarizeOrderItems } from "./orderUtils";
import { AlertsManager } from "../../utils/AlertsManager";
import { subscribeToWebSocket } from "../../utils/websocket";

const OrderContext = createContext();

const initialState = {
  users: [],
  selectedUser: null,
  products: [],
  drinks: [],
  userCardItems: [],
  orderId: null,
  cardMetadata: { total: 0, itemCount: 0 },
  displayItems: [],
  loading: false,
  orderDeleted: false,
};

function orderReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true };
    case "FETCH_USERS_SUCCESS": {
      const selectedUser = state.selectedUser || (action.payload.length > 0 ? action.payload[0] : null);
      return {
        ...state,
        users: action.payload,
        selectedUser,
      };
    }
    case "FETCH_PRODUCTS_SUCCESS":
      return {
        ...state,
        products: action.payload.products,
        drinks: action.payload.drinks,
        loading: false,
      };
    case "SET_SELECTED_USER":
      return {
        ...state,
        selectedUser: action.payload,
      };
    case "SET_ACTIVE_ORDER": {
      const { userCardItems, orderId, cardMetadata } = action.payload;
      return {
        ...state,
        userCardItems,
        orderId,
        cardMetadata,
        displayItems: summarizeOrderItems(userCardItems),
      };
    }
    case "CLEAR_CART":
      return {
        ...state,
        userCardItems: [],
        orderId: null,
        cardMetadata: { total: 0, itemCount: 0 },
        displayItems: [],
      };
    case "SET_DELETED":
      return {
        ...state,
        orderDeleted: action.payload,
      };
    case "STOCK_CHANGE": {
      const { id, actionType, category, selectedExtras } = action.payload;
      const isProduct = category === "Food";
      const menuList = isProduct ? [...state.products] : [...state.drinks];
      const menuIndex = menuList.findIndex((item) => item.id === id);

      if (menuIndex === -1) return state;

      const item = { ...menuList[menuIndex] };
      let updatedUserCardItems = [...state.userCardItems];
      let updatedMetadata = { ...state.cardMetadata };

      const extrasList = selectedExtras || [];
      const extrasPrice = extrasList.reduce((sum, e) => sum + e.price, 0);

      if (actionType === "add") {
        item.stock -= 1;
        menuList[menuIndex] = item;

        // Generate a new ID for the orderItem
        const nextId = updatedUserCardItems.length > 0 ? updatedUserCardItems[updatedUserCardItems.length - 1].id + 1 : 1;
        
        const orderItem = {
          id: nextId,
          orderStatus: "ORDERED",
          paymentStatus: "UNPAID",
          product: { ...item }, // Snapshot of product with modified stock
          extraItems: extrasList.map((extra) => ({
            extras: {
              id: extra.id,
              name: extra.name,
              price: extra.price,
              stock: extra.stock || 0,
              consumption: extra.consumption || 0,
              category: extra.category,
            },
          })),
        };

        updatedUserCardItems.push(orderItem);
        updatedMetadata.itemCount += 1;
        updatedMetadata.total += item.price + extrasPrice;
      } else if (actionType === "rm") {
        const extraIdsStr = extrasList.map((e) => e.id).sort().join("_");
        const cardIndex = updatedUserCardItems.findIndex((cartItem) => {
          if (cartItem.product.id !== id) return false;
          const cartItemExtraIdsStr = cartItem.extraItems ? cartItem.extraItems.map((ei) => ei.extras.id).sort().join("_") : "";
          return cartItemExtraIdsStr === extraIdsStr;
        });

        if (cardIndex !== -1) {
          item.stock += 1;
          menuList[menuIndex] = item;

          updatedUserCardItems.splice(cardIndex, 1);
          updatedMetadata.itemCount -= 1;
          updatedMetadata.total = Math.max(updatedMetadata.total - item.price - extrasPrice, 0);
        }
      } else if (actionType === "clear") {
        const extraIdsStr = extrasList.map((e) => e.id).sort().join("_");
        
        // Count how many matching items are in the cart to restore stock
        let totalItemsRemoved = 0;
        let totalPriceRemoved = 0;

        updatedUserCardItems = updatedUserCardItems.filter((cartItem) => {
          const isMatch = cartItem.product.id === id && (
            (extrasList.length === 0 && (!cartItem.extraItems || cartItem.extraItems.length === 0)) ||
            (cartItem.extraItems && cartItem.extraItems.map((ei) => ei.extras.id).sort().join("_") === extraIdsStr)
          );

          if (isMatch) {
            totalItemsRemoved += 1;
            totalPriceRemoved += cartItem.product.price + cartItem.extraItems.reduce((sum, ei) => sum + ei.extras.price, 0);
            return false;
          }
          return true;
        });

        if (totalItemsRemoved > 0) {
          item.stock += totalItemsRemoved;
          menuList[menuIndex] = item;
          updatedMetadata.itemCount -= totalItemsRemoved;
          updatedMetadata.total = Math.max(updatedMetadata.total - totalPriceRemoved, 0);
        }
      }

      return {
        ...state,
        products: isProduct ? menuList : state.products,
        drinks: !isProduct ? menuList : state.drinks,
        userCardItems: updatedUserCardItems,
        cardMetadata: updatedMetadata,
        displayItems: summarizeOrderItems(updatedUserCardItems),
      };
    }
    default:
      return state;
  }
}

export function OrderProvider({ children }) {
  const [state, dispatch] = useReducer(orderReducer, initialState);
  const alertsManagerRef = useRef(null);

  const showAlert = useCallback((type, message) => {
    if (alertsManagerRef.current) {
      alertsManagerRef.current.showAlert(type, message);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get("/users");
      const mappedUsers = response.data.map((user) => ({
        label: "" + user.id,
        id: user.id,
      }));
      dispatch({ type: "FETCH_USERS_SUCCESS", payload: mappedUsers });
    } catch (error) {
      console.error("Error fetching users:", error);
      showAlert("error", "Fehler beim Abfragen der Benutzer.");
    }
  }, [showAlert]);

  const fetchProductsAndDrinks = useCallback(async () => {
    dispatch({ type: "FETCH_START" });
    try {
      const [productsResponse, drinksResponse] = await Promise.all([
        axios.get("products", { params: { category: "Food" } }),
        axios.get("products", { params: { category: "Drink" } }),
      ]);
      dispatch({
        type: "FETCH_PRODUCTS_SUCCESS",
        payload: {
          products: productsResponse.data,
          drinks: drinksResponse.data,
        },
      });
    } catch (error) {
      console.error("Error fetching products and drinks:", error);
      showAlert("error", "Fehler bei der Datenabfrage.");
    }
  }, [showAlert]);

  const fetchActiveOrder = useCallback(async (userId) => {
    if (!userId || userId <= 0) {
      dispatch({ type: "CLEAR_CART" });
      return;
    }
    try {
      const response = await axios.get("/order", {
        params: {
          userId,
          completed: false,
        },
      });
      if (response.data && response.data.length > 0) {
        const order = response.data[0];
        dispatch({
          type: "SET_ACTIVE_ORDER",
          payload: {
            userCardItems: order.orderItems,
            orderId: order.id,
            cardMetadata: { total: order.sum, itemCount: order.orderItems.length },
          },
        });
      } else {
        dispatch({ type: "CLEAR_CART" });
      }
    } catch (error) {
      console.error("Error fetching active order:", error);
      showAlert("error", "Fehler beim Abfragen der Userdaten.");
    }
  }, [showAlert]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchProductsAndDrinks();
  }, [fetchProductsAndDrinks, state.orderDeleted]);

  useEffect(() => {
    if (state.selectedUser) {
      fetchActiveOrder(state.selectedUser.id);
    }
  }, [state.selectedUser, fetchActiveOrder]);

  useEffect(() => {
    const unsubscribe = subscribeToWebSocket((msg) => {
      if (msg === "users") {
        fetchUsers();
      } else if (msg === "products") {
        fetchProductsAndDrinks();
      } else if (msg === "orders") {
        fetchProductsAndDrinks();
        if (state.selectedUser) {
          fetchActiveOrder(state.selectedUser.id);
        }
      }
    });
    return unsubscribe;
  }, [fetchUsers, fetchProductsAndDrinks, fetchActiveOrder, state.selectedUser]);

  const selectUser = useCallback((user) => {
    dispatch({ type: "SET_SELECTED_USER", payload: user });
  }, []);

  const handleStockChange = useCallback((id, actionType, category, selectedExtras) => {
    dispatch({
      type: "STOCK_CHANGE",
      payload: { id, actionType, category, selectedExtras },
    });
  }, []);

  const placeOrder = useCallback(async () => {
    if (!state.selectedUser) return;
    try {
      const response = await axios.post("/order", JSON.stringify(state.userCardItems), {
        params: { userId: state.selectedUser.id },
        headers: { "Content-Type": "application/json" },
      });
      showAlert("success", "Bestellung erfolgreich. " + response.data);
      // Refetch the active order to get DB generated IDs and sums
      fetchActiveOrder(state.selectedUser.id);
    } catch (error) {
      console.error("Error placing order:", error);
      showAlert("error", "Fehler bei der Bestellung. " + (error.response?.data || error.message));
    }
  }, [state.selectedUser, state.userCardItems, showAlert, fetchActiveOrder]);

  const updateOrder = useCallback(async () => {
    if (!state.selectedUser) return;
    try {
      const response = await axios.put("/order", JSON.stringify(state.userCardItems), {
        params: { userId: state.selectedUser.id },
        headers: { "Content-Type": "application/json" },
      });
      showAlert("success", "Bestellung erfolgreich aktualisiert. " + response.data);
      fetchActiveOrder(state.selectedUser.id);
    } catch (error) {
      console.error("Error updating order:", error);
      showAlert("error", "Fehler bei der Bestellung. " + (error.response?.data || error.message));
    }
  }, [state.selectedUser, state.userCardItems, showAlert, fetchActiveOrder]);

  const deleteOrder = useCallback(async () => {
    if (!state.orderId) return;
    try {
      const response = await axios.delete("/order", {
        data: { id: state.orderId },
      });
      showAlert("success", "Bestellung erfolgreich gelöscht. " + response.data);
      dispatch({ type: "SET_DELETED", payload: true });
      dispatch({ type: "CLEAR_CART" });
      setTimeout(() => {
        dispatch({ type: "SET_DELETED", payload: false });
      }, 100);
    } catch (error) {
      console.error("Error deleting order:", error);
      showAlert("error", "Fehler beim Löschen. " + (error.response?.data || error.message));
    }
  }, [state.orderId, showAlert]);

  return (
    <OrderContext.Provider
      value={{
        ...state,
        selectUser,
        handleStockChange,
        placeOrder,
        updateOrder,
        deleteOrder,
        showAlert,
      }}
    >
      <AlertsManager ref={alertsManagerRef} />
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
}
