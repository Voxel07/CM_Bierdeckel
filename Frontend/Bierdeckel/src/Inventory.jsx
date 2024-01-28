import React, { useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from '@material-ui/core';
import axios from 'axios';

const ProductList = () => {
    const [products, setProducts] = useState([
        { id: 1, name: 'Product 1', price: '10', amount: 10, remaining: 5 },
        { id: 2, name: 'Product 2', price: '20', amount: 10, remaining: 10 }
    ]);

    const [newProductName, setNewProductName] = useState('');
    const [newProductPrice, setNewProductPrice] = useState('');
    const [totalAmount, setTotalAmount] = useState(0);
    const [remainingAmount, setRemainingAmount] = useState(0);

    const handleEdit = (id) => {
        const updatedProducts = products.map(product => {
            if (product.id === id) {
                return {
                    ...product,
                    isEditing: !product.isEditing,
                    newName: product.name, // Copy the value of name to newName
                    newPrice: product.price // Copy the value of price to newPrice
                };
            }
            return product;
        });
        setProducts(updatedProducts);
    };

    const handleSave = (id) => {
        console.log('Saving product with id: ', id);
        const updatedProducts = products.map(product => {
            if (product.id === id) {
                return {
                    ...product,
                    isEditing: false,
                    name: product.newName,
                    price: product.newPrice
                };
            }
            return product;
        });
        setProducts(updatedProducts);
    };

    const handleKeyPress = (e, id) => {
        if (e.key === 'Enter') {
            handleSave(id);
        }
    };

    //add a handleDelete function
    const handleDelete = (id) => {
        const updatedProducts = products.filter(product => product.id !== id);
        setProducts(updatedProducts);
    };


    const handleCreate = () => {
        console.log('Creating new product');
        const newProduct = {
            id: products.length + 1,
            name: newProductName,
            price: newProductPrice,
            amount: 0
        };

        axios.post('http://localhost:8080/products', newProduct)
            .then(response => {
                console.log('Product created successfully:', response.data);
                setProducts([...products, newProduct]);
                setNewProductName('');
                setNewProductPrice('');
            })
            .catch(error => {
                console.error('Error creating product:', error);
            });
    };

    // Calculate total amount and remaining amount
    const calculateAmounts = () => {
        let total = 0;
        let remaining = 0;
        products.forEach(product => {
            total += parseFloat(product.price);
            remaining += parseFloat(product.price);
        });
        setTotalAmount(total);
        setRemainingAmount(remaining);
    };

    // Call calculateAmounts when products change
    React.useEffect(() => {
        calculateAmounts();
    }, [products]);

    return (
        <div>
            <h1>Produkt Liste</h1>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Remaining</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell onClick={() => !product.isEditing && handleEdit(product.id)}>
                                    {product.isEditing ? (
                                        <TextField
                                            value={product.newName}
                                            onChange={(e) => {
                                                const updatedProducts = products.map(p => {
                                                    if (p.id === product.id) {
                                                        return {
                                                            ...p,
                                                            newName: e.target.value
                                                        };
                                                    }
                                                    return p;
                                                });
                                                setProducts(updatedProducts);
                                            }}
                                            onKeyDown={(e) => handleKeyPress(e, product.id)}
                                        />
                                    ) : (
                                        product.name
                                    )}
                                </TableCell>
                                <TableCell>
                                    {product.isEditing ? (
                                        <>
                                            <TextField
                                                value={product.newPrice}
                                                type='decimal'
                                                onChange={(e) => {
                                                    const input = e.target.value;
                                                    const regex = /^[0-9]*(\,[0-9]*)?$/; // Allow decimal numbers
                                                    if (regex.test(input)) {
                                                        const updatedProducts = products.map(p => {
                                                            if (p.id === product.id) {
                                                                return {
                                                                    ...p,
                                                                    newPrice: input
                                                                };
                                                            }
                                                            return p;
                                                        });
                                                        setProducts(updatedProducts);
                                                    }
                                                }}
                                                onKeyDown={(e) => handleKeyPress(e, product.id)}
                                            />
                                            {!/^\d*\,?\d*$/.test(product.newPrice) && (
                                                <span style={{ color: 'red' }}>Only numbers are allowed</span>
                                            )}
                                        </>
                                    ) : (
                                        `${product.price} €`
                                    )}
                                </TableCell>
                                <TableCell>
                                    {product.isEditing ? (
                                        <TextField
                                            value={product.amount}
                                            type='number'
                                            onChange={(e) => {
                                                const input = e.target.value;
                                                const updatedProducts = products.map(p => {
                                                    if (p.id === product.id) {
                                                        return {
                                                            ...p,
                                                            amount: input
                                                        };
                                                    }
                                                    return p;
                                                });
                                                setProducts(updatedProducts);
                                            }}
                                        />
                                    ) : (
                                        product.amount
                                    )}
                                </TableCell>
                                <TableCell>
                                    {product.isEditing ? (
                                        <TextField
                                            value={product.remaining}
                                            type='number'
                                            onChange={(e) => {
                                                const input = e.target.value;
                                                const updatedProducts = products.map(p => {
                                                    if (p.id === product.id) {
                                                        return {
                                                            ...p,
                                                            remaining: input
                                                        };
                                                    }
                                                    return p;
                                                });
                                                setProducts(updatedProducts);
                                            }}
                                        />
                                    ) : (
                                        product.remaining
                                    )}
                                </TableCell>
                                <TableCell>
                                    {product.isEditing ? (
                                        <Button variant="contained" color="primary" onClick={() => handleSave(product.id)}>Speichern</Button>
                                    ) : (
                                        <Button variant="contained" color="primary" onClick={() => !product.isEditing && handleEdit(product.id)}>Anpassen</Button>
                                    )}
                                    <Button variant="contained" color="secondary" onClick={() => handleDelete(product.id)}>Löschen</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TextField 
                    label="Produkt Name"
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    />
                <TextField
                    label="Produkt Preis"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    />
                <Button variant="contained" color="primary" onClick={handleCreate}>Eintrag hinzufügen</Button>
                </TableContainer>
            </div>
    );
};

export default ProductList;