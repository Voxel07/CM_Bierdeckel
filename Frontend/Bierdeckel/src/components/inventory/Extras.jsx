import React, { useEffect, useState, useRef } from 'react';
import { TableCell, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import { IconButton,  Paper, TextField } from '@mui/material/';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { styled } from '@mui/system';
import { createTheme, ThemeProvider } from '@mui/material';

//Feedback
import { AlertsManager  } from '../../utils/AlertsManager';
import AddExtra from './AddExtra';

const theme = createTheme({
    components: {
      MuiTableBody: {
        styleOverrides: {
          root: {
            '& .MuiTableRow-root:nth-of-type(odd)': { 
                backgroundColor: '#083036' 
              },
              '& .MuiTableRow-root:nth-of-type(even)': { 
                backgroundColor: '#090c11' 
            },
        },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
              color: '#F5F0F3' // set alternating colors for even and odd rows
              },
            },
        },
      },
  });

  const StyledPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: '#090c11', // Semi-transparent white
    borderRadius: '5px',
    color:'#F5F0F3'
}));

const Extras = () => {

    const [products, setProducts] = useState([]);
    const [trigger, setTrigger] = useState(false); 
    const [fetchingData, setDataFetched] = useState(true);
    const alertsManagerRef =  useRef();
    const[loadingState, setLoadingState] = useState("Loading Inventory...");

    useEffect(()=>{
        axios.get("http://localhost:8080/extras")
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
                    newName: product.name, // Copy the value of name to newName
                    newPrice: product.price // Copy the value of price to newPrice
                };
            }
            return product;
        });
        setProducts(updatedProducts);
    };

    const handleSave = (id) => {
        console.log('Saving extra with id: ', id);
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

        axios.delete('http://localhost:8080/extras',
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
                <ThemeProvider theme={theme}>

                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Preis</TableCell>
                            <TableCell>Stückzahl</TableCell>
                            <TableCell>Verbraucht</TableCell>
                            <TableCell>Aktion</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell >
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
                                </TableCell>
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
                            </TableRow>
                        ))}
                    </TableBody>
                    </ThemeProvider>

                </Table>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px' }}>
                    <AddExtra onSubmitSuccess={() => setTrigger(!trigger)}/>
                </div>
                </TableContainer>
    );
};

export default Extras;