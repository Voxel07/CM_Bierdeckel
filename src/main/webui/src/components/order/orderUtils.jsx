export const summarizeOrderItems = (orderData) => {
  console.log("orderItems")
  // Create a map to track unique product IDs and their counts
  const productCountMap = {};

  // Loop through each order item within an order
  for (const orderItem of orderData) {
    const productId = orderItem.product.id;
    const productName = orderItem.product.name;
    const productPrice = orderItem.product.price;

    // Update the product count map
    if (productCountMap[productId]) {
      productCountMap[productId].quantity++; 
    } else {
        productCountMap[productId] = {
        productId: productId, 
        productName: productName,
        productPrice: productPrice,
        quantity: 1 
      };
    }
  }

  // Create the output object list based on the product count map
  const summary = Object.values(productCountMap); 

  return summary;
}