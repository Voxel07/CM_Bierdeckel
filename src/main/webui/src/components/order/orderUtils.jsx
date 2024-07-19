export const summarizeOrderItems = (orderData) => {

  const productCountMap = {};

  for (const orderItem of orderData) {
    const { id: productId, name: productName, price: productPrice, stock: stock, category:category } = orderItem.product;

    productCountMap[productId] = productCountMap[productId] ? {
      ...productCountMap[productId],
      quantity: productCountMap[productId].quantity + 1,
      stock: productCountMap[productId].stock - 1
    } : {
      productId,
      productName,
      productPrice,
      quantity: 1,
      stock,
      category
    };
  }

  // const summary = Object.values(productCountMap);

  return  Object.values(productCountMap);;
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
