import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Select, MenuItem } from '@material-ui/core';

const Order = () => {
    const [orders, setOrders] = useState([
        { user: 'John Doe', items: [{ item: 'Beer', quantity: 1 },{ item: 'Wasser', quantity: 1 }] },
        { user: 'Jane Smith', items: [{ item: 'Wine', quantity: 1 }] },
        { user: 'Mike Johnson', items: [{ item: 'Cocktail', quantity: 1 }] },
    ]);

    const [selectedUser, setSelectedUser] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');

    const incrementQuantity = (userIndex, itemIndex) => {
        const updatedOrders = [...orders];
        updatedOrders[userIndex].items[itemIndex].quantity += 1;
        setOrders(updatedOrders);
    };

    const decrementQuantity = (userIndex, itemIndex) => {
        const updatedOrders = [...orders];
        updatedOrders[userIndex].items[itemIndex].quantity -= 1;
        setOrders(updatedOrders);
    };

    const calculateTotalPrice = (userIndex) => {
        let totalPrice = 0;
        orders[userIndex].items.forEach((item) => {
            totalPrice += item.quantity * 10; // Assuming each item costs $10
        });
        return totalPrice;
    };

    const handleUserChange = (event) => {
        setSelectedUser(event.target.value);
    };

    const handleProductChange = (event) => {
        setSelectedProduct(event.target.value);
    };

    const addUserOrder = () => {
        if (selectedUser !== '' && selectedProduct !== '') {
            const userIndex = orders.findIndex((order) => order.user === selectedUser);
            if (userIndex !== -1) {
                const updatedOrders = [...orders];
                updatedOrders[userIndex].items.push({ item: selectedProduct, quantity: 1 });
                setOrders(updatedOrders);
            } else {
                const newOrder = { user: selectedUser, items: [{ item: selectedProduct, quantity: 1 }] };
                setOrders([...orders, newOrder]);
            }
        }
    };
    

    return (
        <div>
              <h1>Bierdeckel</h1>
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Produkt</TableCell>
                        <TableCell>Summe</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map((order, userIndex) => (
                        <TableRow key={userIndex}>
                            <TableCell>{order.user}</TableCell>
                            <TableCell colSpan={2} style={{ display: 'flex', flexWrap: 'wrap' }}>
                                {order.items.map((item, itemIndex) => (
                                    <div key={itemIndex} style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                                        {item.quantity + " " + item.item}
                                        <Button onClick={() => incrementQuantity(userIndex, itemIndex)}>+</Button>
                                        <Button onClick={() => decrementQuantity(userIndex, itemIndex)}>-</Button>
                                    </div>
                                ))}
                            </TableCell>
                            <TableCell>{calculateTotalPrice(userIndex)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableBody>
                    <TableRow>
                        <TableCell>
                            <Select value={selectedUser} onChange={handleUserChange}>
                                <MenuItem value="">Select User</MenuItem>
                                <MenuItem value="John Doe">John Doe</MenuItem>
                                <MenuItem value="Jane Smith">Jane Smith</MenuItem>
                                <MenuItem value="Mike Johnson">Mike Johnson</MenuItem>
                                {/* Add more users here */}
                            </Select>
                        </TableCell>
                        <TableCell>
                            <Select value={selectedProduct} onChange={handleProductChange}>
                                <MenuItem value="">Select Product</MenuItem>
                                <MenuItem value="Beer">Beer</MenuItem>
                                <MenuItem value="Wasser">Wasser</MenuItem>
                                <MenuItem value="Wine">Wine</MenuItem>
                                <MenuItem value="Cocktail">Cocktail</MenuItem>
                                {/* Add more products here */}
                            </Select>
                        </TableCell>
                        <TableCell>
                            <Button onClick={addUserOrder}>Add Order</Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
        </div>

    );
};

export default Order;
