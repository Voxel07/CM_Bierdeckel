export const summarizeOrderItems = (orderData) => {
  const productCountMap = {};
  for (const orderItem of orderData) {
    const { id: productId, name: productName, price: productPrice, stock, category } = orderItem.product;
    const extraItems = orderItem.extraItems || [];

    console.log(extraItems)
    
    // Create a unique key combining productId and sorted extraItems ids
    const extraItemsKey = extraItems.map(ei => ei.extras.id).sort().join('_');
    const key = `${productId}_${extraItemsKey}`;
    
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
        extraItems: extraItems.map(ei => ({
          extras: {
            id: ei.extras.id,
            name: ei.extras.name,
            price: ei.extras.price,
            stock: ei.extras.stock,
            consumption: ei.extras.consumption,
            category: ei.extras.category
          }
        }))
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
