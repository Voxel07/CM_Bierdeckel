import React, { useEffect, useState, useRef } from 'react';
import { Button, Table, TableBody, TableContainer, TableHead, TableRow, Paper, TextField, Box } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import AddProduct from './AddProduct'
import { withStyles } from '@mui/styles';

//Feedback
import { AlertsManager  } from '../../utils/AlertsManager';

const StyledTableCellHead = styled(TableCell)(({ theme }) => ({
    color: 'rgb(70, 120, 167)',
    borderBottom : '1px solid rgb(24, 24, 24)',
}));

const StyledTableCellBody = styled(TableCell)(({ theme }) => ({
    color: 'rgb(132, 205, 71)',
    // borderLeft: '1px solid blue',
    // borderRight: '1px solid blue',
    borderBottom : '1px solid rgb(24, 24, 24)',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    }
   
  }));

const StyledPaper = withStyles({
    root: {
        backgroundColor: 'rgba(36, 36, 36, 0.5)', // Semi-transparent white
        boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.1)', // Shadow for "hover" effect
        backdropFilter: 'blur(100px)', // Blur effect for background content
        borderRadius: '20px',
        border: 'px solid rgba(20, 20, 20, 0.5)',
      // Add more styles as needed
    },
  })(props => <Paper elevation={1} {...props} />); // Change '3' to your desired elevation

const Products = () => {

    const [products, setProducts] = useState([]);
    const [trigger, setTrigger] = useState(false); 
    const [fetchingData, setDataFetched] = useState(true);
    const alertsManagerRef =  useRef();
    const[loadingState, setLoadingState] = useState("Loading Inventory...");

    useEffect(()=>{
        axios.get("http://localhost:8080/products")
            .then(response => {
                setTimeout(() => {
                    setProducts(response.data);
                    setDataFetched(false);
                }, 0);
            }).catch(error => {
                console.log(error);
                setDataFetched(false);
                setLoadingState("Server not reachable");
            });

  
        
    },[trigger])
    
    const handleEdit = (id) => {
        const updatedProducts = products.map(product => {
            if (product.id === id) {
                return {
                    ...product,
                    isEditing: !product.isEditing,
                    newName: product.name,
                    newPrice: product.price
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
            alertsManagerRef.current.showAlert('error', error.response.data);
        });
    };

    return (
            <TableContainer component={StyledPaper}>
            <AlertsManager ref={alertsManagerRef} />
                <Table >
                    <TableHead>
                        <TableRow>
                            <StyledTableCellHead>Name</StyledTableCellHead>
                            <StyledTableCellHead>Preis</StyledTableCellHead>
                            <StyledTableCellHead>Stückzahl</StyledTableCellHead>
                            <StyledTableCellHead>Verbraucht</StyledTableCellHead>
                            <StyledTableCellHead>Aktion</StyledTableCellHead>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <StyledTableRow key={product.id}>
                                <StyledTableCellBody >
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
                                </StyledTableCellBody>
                                <StyledTableCellBody>
                                    {product.isEditing ? (
                                        <>
                                            <TextField
                                                value={product.newPrice}
                                                style={{ width: '100px', height: '32px' }} 
                                                type='decimal'
                                                onChange={(e) => {
                                                    const input = e.target.value;
                                                    const regex = /^[0-9]*(\,[0-9]*)?$/;
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
                                </StyledTableCellBody>
                                <StyledTableCellBody>
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
                                </StyledTableCellBody>
                                <StyledTableCellBody>
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
                                </StyledTableCellBody>
                                <StyledTableCellBody>
                                    {product.isEditing ? (
                                        <IconButton aria-label="delete" variant="contained" color="success" onClick={() => handleSave(product.id)}><SaveIcon/></IconButton>
                                    ) : (
                                        <IconButton variant="contained" color="info" onClick={() => !product.isEditing && handleEdit(product.id)}><EditIcon/></IconButton>
                                    )}
                                    <IconButton variant="contained" color="error" onClick={() => handleDelete(product.id)}><DeleteIcon/></IconButton>
                                </StyledTableCellBody>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px' }}>
                    <AddProduct onSubmitSuccess={() => setTrigger(!trigger)}/>
                </div>
                </TableContainer>
    );
};

export default Products;