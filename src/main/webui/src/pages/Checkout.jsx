import React, { useEffect, useState, useRef } from "react";
import { AlertsManager , AlertsContext } from '../utils/AlertsManager';

import axios from "axios";

function Checkout() {
  const titles = ["UNPAID", "PARTIALLY_PAID", "PAID"];
  const alertsManagerRef =  useRef(AlertsContext);

  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("/order")
    .then(response =>{
        setData(distributeOrders(response.data));
    }).catch(error =>{
      console.log(error)
      alertsManagerRef.current.showAlert('error', "Fehler bei der der Datenabfrage. ");
    })

}, []);

  function distributeOrders(orders) {
    const o = [];
    const p = [];
    const d = [];
  // Loop through each order
  for (const order of orders) {
    // Loop through each orderItem in the order
    for (const orderItem of order.orderItems) {

      // console.log(orderItem)
      const status = orderItem.paymentStatus;

      // Distribute items based on their orderStatus
      switch (status) {
        case titles[0]:
          o.push(orderItem);
          break;
        case titles[1]:
          p.push(orderItem);
          break;
        case titles[2]:
          d.push(orderItem);
          break;
        default:
          alertsManagerRef.current.showAlert('warning', "Unbekannter Status in einer Bestellposition. "+ status);
          console.warn("Unknown orderItem status:", status);
        }
      }
    }     
    return { o, p, d };
  }

    return (
        <div>
            <AlertsManager ref={alertsManagerRef} />

            <h1 style={{ textAlign: "center", padding: "50px", outline:"none", color: "white" }}>Checkout</h1>
            <pre style={{ color: "white" }}>{ JSON.stringify(data, null, 2)}</pre>
        </div>
    )
}

export default Checkout