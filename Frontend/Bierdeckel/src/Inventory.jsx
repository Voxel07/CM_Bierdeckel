import React, { useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from '@material-ui/core';
import axios from 'axios';

const ProductList = () => {
    const [products, setProducts] = useState([
        { id: 1, name: 'Product 1', price: '10' },
        { id: 2, name: 'Product 2', price: '20' }
    ]);

    const [newProductName, setNewProductName] = useState('');
    const [newProductPrice, setNewProductPrice] = useState('');

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
            price: newProductPrice
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

    return (
        <div>
            <h1>Produkt Liste</h1>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Price</TableCell>
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
                                        <Button variant="contained" color="primary" onClick={() => handleSave(product.id)}>Save</Button>
                                    ) : (
                                        <Button variant="contained" color="primary" onClick={() => !product.isEditing && handleEdit(product.id)}>Edit</Button>
                                    )}
                                    <Button variant="contained" color="secondary" onClick={() => handleDelete(product.id)}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
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
                <Button variant="contained" color="primary" onClick={handleCreate}>Create New Entry</Button>
            </div>
    );
};

export default ProductList;