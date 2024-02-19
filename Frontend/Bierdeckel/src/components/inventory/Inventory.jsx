import React, { useEffect, useState, useRef } from 'react';
import { Button, Table, TableBody, TableContainer, TableHead, TableRow, Paper, TextField, Box } from '@material-ui/core';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { styled } from '@mui/material/styles';
import axios from 'axios';

import AddProduct from './AddProduct'

//Feedback
import { AlertsManager  } from '../../utils/AlertsManager';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 25,
    },
  }));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

const ProductList = () => {

    const [products, setProducts] = useState([]);
    const [trigger, setTrigger] = useState(false); 
    const alertsManagerRef =  useRef();

    useEffect(()=>{
        axios.get("http://localhost:8080/products")
        .then(response => {
            setProducts(response.data)
        }).catch(error=>{
            console.log(error)
        })
        
    },[trigger, products])
    
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

    const handleDelete = (_id) => {
        const updatedProducts = products.filter(product => product.id !== _id);
        setProducts(updatedProducts);

        axios.delete('http://localhost:8080/products',
        {
            data:{ id: _id }

        }).then(response=>{
            console.log(response.data)
            alertsManagerRef.current.showAlert('success', response.data);
            setTrigger()
        }).catch(error=>{
            console.log(error.response)
            // alertsManagerRef.current.showAlert('error', error.response.data);
        });
    };

    return (
        <Box sx={{width: "100px"}}>
             <AlertsManager ref={alertsManagerRef} />
            <h1>Produkt Liste</h1>
            <TableContainer component={Paper} sx={{ backgroundColor: 'transparent' }}>
                <Table sx={{ backgroundColor: 'transparent' }}>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Name</StyledTableCell>
                            <StyledTableCell>Price</StyledTableCell>
                            <StyledTableCell>Amount</StyledTableCell>
                            <StyledTableCell>Remaining</StyledTableCell>
                            <StyledTableCell>Action</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <StyledTableRow key={product.id}>
                                <StyledTableCell >
                                    {product.isEditing ? (
                                        <TextField
                                            value={product.newName }
                                            style={{ width: '100px', height: '32px' }} 
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
                                </StyledTableCell>
                                <TableCell>
                                    {product.isEditing ? (
                                        <>
                                            <TextField
                                                value={product.newPrice}
                                                style={{ width: '100px', height: '32px' }} 
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
                                        <>
                                            <TextField
                                                value={product.newStock}
                                                style={{ width: '100px', height: '32px' }} 
                                                type='decimal'
                                                onChange={(e) => {
                                                    const input = e.target.value;
                                                    const regex = /^[0-9]*(\,[0-9]*)?$/; // Allow decimal numbers
                                                    if (regex.test(input)) {
                                                        const updatedProducts = products.map(p => {
                                                            if (p.id === product.id) {
                                                                return {
                                                                    ...p,
                                                                    newStock: input
                                                                };
                                                            }
                                                            return p;
                                                        });
                                                        setProducts(updatedProducts);
                                                    }
                                                }}
                                                onKeyDown={(e) => handleKeyPress(e, product.id)}
                                            />
                                            {!/^\d*\,?\d*$/.test(product.newStock) && (
                                                <span style={{ color: 'red' }}>Only numbers are allowed</span>
                                            )}
                                        </>
                                    ) : (
                                        product.category == "Food"? `${product.stock} stk.`:`${product.stock} l`
                                    )}
                                </TableCell>
                                <TableCell>
                                    {product.isEditing ? (
                                        <>
                                            <TextField
                                                value={product.newConsumption}
                                                type='decimal'
                                                onChange={(e) => {
                                                    const input = e.target.value;
                                                    const regex = /^[0-9]*(\,[0-9]*)?$/; // Allow decimal numbers
                                                    if (regex.test(input)) {
                                                        const updatedProducts = products.map(p => {
                                                            if (p.id === product.id) {
                                                                return {
                                                                    ...p,
                                                                    newConsumption: input
                                                                };
                                                            }
                                                            return p;
                                                        });
                                                        setProducts(updatedProducts);
                                                    }
                                                }}
                                                onKeyDown={(e) => handleKeyPress(e, product.id)}
                                            />
                                            {!/^\d*\,?\d*$/.test(product.newConsumption) && (
                                                <span style={{ color: 'red' }}>Only numbers are allowed</span>
                                            )}
                                        </>
                                    ) : (
                                        product.category == "Food"? `${product.consumption} stk.`:`${product.consumption} l`
                                    )}
                                </TableCell>
                                <TableCell>
                                    {product.isEditing ? (
                                        <IconButton aria-label="delete" variant="contained" color="success" onClick={() => handleSave(product.id)}><SaveIcon/></IconButton>
                                    ) : (
                                        <IconButton variant="contained" color="info" onClick={() => !product.isEditing && handleEdit(product.id)}><EditIcon/></IconButton>
                                    )}
                                    <IconButton variant="contained" color="error" onClick={() => handleDelete(product.id)}><DeleteIcon/></IconButton>
                                </TableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
                <AddProduct  onSubmitSuccess={() => setTrigger(!trigger)}/>
                </TableContainer>
            </Box>
    );
};

export default ProductList;