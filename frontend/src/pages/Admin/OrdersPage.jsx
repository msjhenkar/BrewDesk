import React, { useEffect, useState } from 'react'
import axios from 'axios'

const OrdersPage = () => {
    
    const [orders, setOrders] = useState([]);

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchOrders();
    },[]);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8081/api/admin/orders"

            )
            setOrders(response.data);
        }catch(error){
            console.log(error)
        }
    }
  return (
    <div>
            <h2>Orders</h2>

            <table border="1">

                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th>Items</th>
                    </tr>
                </thead>

                <tbody>

                    {orders.map((order) => (

                        <tr key={order.orderId}>

                            <td>{order.orderId}</td>

                            <td>{order.userName}</td>

                            <td>{order.status}</td>

                            <td>₹{order.totalAmount}</td>

                            <td>
                                {order.items.map((item) => (
                                    <div key={item.orderItemId}>
                                        {item.menuItemName}
                                        x
                                        {item.quantity}
                                    </div>
                                ))}
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>
    </div>
  )
}

export default OrdersPage
