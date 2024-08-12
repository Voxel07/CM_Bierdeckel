export const summarizeOrderItems = (orderData) => {
  const productCountMap = {};

  for (const orderItem of orderData) {
    const { id: productId, name: productName, price: productPrice, stock, category } = orderItem.product;
    const extraItem = orderItem.extraItem || null;

    // Create a unique key combining productId and extraItem id (if it exists)
    const key = extraItem ? `${productId}_${extraItem.id}` : `${productId}`;

    if (productCountMap[key]) {
      productCountMap[key].quantity += 1;
      productCountMap[key].stock -= 1;
    } else {
      productCountMap[key] = {
        productId,
        productName,
        productPrice,
        quantity: 1,
        stock,
        category,
        extraItem
      };
    }
  }

  return Object.values(productCountMap);
};


export const summarizeOrder = (orders) => {
  const allOrderItems = {};

  for (const order of orders) {
    const orderSummary = summarizeOrderItems(order.orderItems);
    
    for (const item of orderSummary) {
      if (allOrderItems[item.productId]) {
        allOrderItems[item.productId].quantity += item.quantity;
        allOrderItems[item.productId].stock = Math.min(allOrderItems[item.productId].stock, item.stock);
      } else {
        allOrderItems[item.productId] = { ...item };
      }
    }
  }

  return Object.values(allOrderItems);
};
