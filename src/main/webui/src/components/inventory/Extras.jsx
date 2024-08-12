import React, { useEffect, useState, useRef } from 'react';
import { TableCell, Table, TableBody, TableContainer, TableHead, TableRow } from '@mui/material';
import { IconButton,  Paper, TextField } from '@mui/material/';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import AddExtra from './AddExtra'
import { styled } from '@mui/system';
import Stack from "@mui/material/Stack";

//Feedback
import { AlertsManager , AlertsContext } from '../../utils/AlertsManager';

const StyledPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: '#090c11', // Semi-transparent white
    borderRadius: '5px',
    color:'#F5F0F3'
}));

const Extras = ({extraCategory}) => {

    const [extras, setExtras] = useState([]);
    const [trigger, setTrigger] = useState(false); 
    const alertsManagerRef =  useRef(AlertsContext);

    useEffect(()=>{
        axios.get("extras")
            .then(response => {
                setTimeout(() => {
                    setExtras(response.data);
                    console.log(response.data);
                    // alertsManagerRef.current.showAlert('success', response.data.length + " Produkte wurden geladen");
                }, 0);
            }).catch(error => {
                console.log(error);
                alertsManagerRef.current.showAlert('error', "Produkte konnten nicht geladen werden. Server nicht erreichbar");
            });       
    },[trigger])

    const handleDelete = (_id) => {
        console.log("jetzt aber")
        
        axios.delete('extras', {
            params: { force: true },
            data: { id: _id }
          })
    .then(response=>{
            console.log(response.data)
            alertsManagerRef.current.showAlert('success', response.data);
            const updatedProducts = extras.filter(product => product.id !== _id);
            setExtras(updatedProducts);

            setTrigger()
        }).catch(error=>{
            console.log(error.response)
            alertsManagerRef.current.showAlert('error', error.response.status + error.response.data);
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
                            <TableCell>Kategorie</TableCell>
                            <TableCell>Aktion</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                       {extras.map((extra) => (
                            <TableRow key={extra.id}>
                                <TableCell >
                                       {extra.name}
                                </TableCell>
                                <TableCell>
                                       {`${extra.price} €`}
                                </TableCell>
                                <TableCell>
                                        {extra.category}
                                </TableCell>
                                <TableCell>
                                    <Stack  direction="row"
                                            spacing={0}
                                            alignItems="start">
                                        <AddExtra onSubmitSuccess={() => setTrigger(!trigger)} category={extraCategory} action={"update"} prductToModify={extra}/>
                                        <IconButton variant="contained" color="error" onClick={() => handleDelete(extra.id)}><DeleteIcon/></IconButton>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px' }}>
                    <AddExtra onSubmitSuccess={() => setTrigger(!trigger)} category={extraCategory} action={"add"}/>
                </div>
                </TableContainer>
    );
};

export default Extras;