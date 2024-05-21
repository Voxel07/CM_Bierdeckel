export const summarizeOrderItems = (orderData) => {
  const productCountMap = {};

  for (const orderItem of orderData) {
    const { id: productId, name: productName, price: productPrice, stock } = orderItem.product;

    productCountMap[productId] = productCountMap[productId] ? {
      ...productCountMap[productId],
      quantity: productCountMap[productId].quantity + 1,
      stock: productCountMap[productId].stock - 1
    } : {
      productId,
      productName,
      productPrice,
      quantity: 1,
      stock
    };
  }

  const summary = Object.values(productCountMap);

  return summary;
};
