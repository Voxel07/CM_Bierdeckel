import React, { useEffect, useState, useRef } from 'react';
import { TableCell, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import { IconButton,  Paper, TextField } from '@mui/material/';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import AddProduct from './AddProduct'
import { styled } from '@mui/system';
import Stack from "@mui/material/Stack";
import { createTheme, ThemeProvider } from '@mui/material';

import {Chip} from '@mui/material';
//Feedback
import { AlertsManager , AlertsContext } from '../../utils/AlertsManager';

const StyledPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: '#090c11', // Semi-transparent white
    borderRadius: '5px',
    color:'#F5F0F3'
}));

const chipStyle = {
    margin: '2px',
    backgroundColor: '#040608',
    border:'solid 2px #19669d',
    color: '#fff',
    '&:hover': {
        backgroundColor: '#040608',
    },
    '& .MuiChip-deleteIcon': {
        color: 'red',
        '&:hover': {
            color: '#fff',
        },
    }
};

const Products = ({productCategory}) => {

    const [products, setProducts] = useState([]);
    const [extras, setExtras] = useState([]);
    const [trigger, setTrigger] = useState(false); 
    const alertsManagerRef =  useRef(AlertsContext);

    useEffect(()=>{
        axios.get("products",  {params:{category: productCategory}})
            .then(response => {
                setTimeout(() => {
                    setProducts(response.data);
                }, 0);
            }).catch(error => {
                console.log(error);
                setDataFetched(false);
                alertsManagerRef.current.showAlert('error', "Produkte konnten nicht geladen werden. Server nicht erreichbar");
            });       
    },[trigger])

    useEffect(()=>{
        axios.get("extras",  {params:{category: productCategory}})
            .then(response => {
                setTimeout(() => {
                    setExtras(response.data);
                }, 0);
            }).catch(error => {
                console.log(error);
                setDataFetched(false);
                alertsManagerRef.current.showAlert('error', "Produkte konnten nicht geladen werden. Server nicht erreichbar");
            });       
    },[])
    
    const handleEdit = (id) => {
        const updatedProducts = products.map(product => {
            if (product.id === id) {
                return {
                    ...product,
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

        axios.delete('products',
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
                        <TableRow >
                            <TableCell>Name</TableCell>
                            <TableCell>Preis</TableCell>
                            <TableCell>Stückzahl</TableCell>
                            <TableCell>Verbraucht</TableCell>
                            <TableCell>Extras</TableCell>
                            <TableCell>Aktion</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                       {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell >
                                       {product.name}
                                </TableCell>
                                <TableCell>
                                       {`${product.price} €`}
                                </TableCell>
                                <TableCell>
                                        {product.category == "Food" || product.category == "Extra" ? `${product.stock} stk.`:`${product.stock} l`}
                                </TableCell>
                                <TableCell>
                                        {product.category == "Food" || product.category == "Extra" ? `${product.consumption} stk.`:`${product.consumption} l`}
                                </TableCell>
                                <TableCell>

                                <Stack  direction="row"
                                              spacing={1}
                                              alignItems="start">
                                        {product.compatibleExtras && product.compatibleExtras.length > 0 && (
                                          
                                            product.compatibleExtras.map((extra) => (
                                                <Chip color="primary" label={extra.name} size="small" sx={chipStyle} />
                                            ))
                                        )}
                                    </Stack>

                                </TableCell>
                                <TableCell>
                                    <Stack  direction="row"
                                            spacing={0}
                                            alignItems="start">
                                        <AddProduct onSubmitSuccess={() => setTrigger(!trigger)} category={productCategory} action={"update"} productToModify={product} extras={extras}/>
                                        <IconButton variant="contained" color="error" onClick={() => handleDelete(product.id)}><DeleteIcon/></IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px' }}>
                    <AddProduct onSubmitSuccess={() => setTrigger(!trigger)} category={productCategory} action={"add"} extras={extras}/>
                </div>
                </TableContainer>
    );
};

export default Products;