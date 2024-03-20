import React, { useEffect, useState, useRef } from 'react';

import axios from 'axios';

import InfoCard from './InfoCard';
import {
    Grid,
    Divider,
    Chip
  } from '@mui/material';

import './OrderStyle.css';
import { summarizeOrderItems } from './orderUtils'; 

function OrderFood({ currentUserId, handleShoppingCard }) {
    const [products, setProducts] = useState([]);
    const [newItems, setNewItems] = useState([]);
    const [userInfo, setUserInfo] = useState([]);

    function stockChange(id, action)
    {
        if(action == "add")
        {
            const productToAdd = products.find(prod => prod.id === id);
            console.log("hinzufügen");
            if (productToAdd) {
                // Create a NEW array with the item included
                setNewItems([...newItems, productToAdd]);
              } else {
                console.log("nein", id); // Assuming you kept this for logging 
              }

        }
        else if(action == "rm")
        {
            const indexToRemove = newItems.findIndex(prod => prod.id === id);

            if (indexToRemove !== -1) {
            // Remove at the specified index using splice
            const updatedNewItems = [...newItems]; // Create a copy
            updatedNewItems.splice(indexToRemove, 1); // Remove one item
            setNewItems(updatedNewItems);
    }
        }
        else{
            console.log("nope")
        }
    }

    useEffect(()=>
    {
        axios.get("http://localhost:8080/products",
        {
            params:{
                category:"food"
            }
        }).then(response => {
            setTimeout(() => {
                setProducts(response.data);
            }, 0);
        }).catch(error => {
            console.log(error);
        });
    },[])

    useEffect(()=>
    {
        axios.get("http://localhost:8080/order",
        {
            params:{
                userId: currentUserId
            }
        }).then(response => {
            setTimeout(() => {
                handleShoppingCard(response.data[0]);

                if(response.data.length != 0)
                {
                    setUserInfo(summarizeOrderItems(response.data[0].orderItems));
                }
                else
                {
                    setUserInfo(0);
                }
            }, 0);
        }).catch(error => {
            console.log(error);
        });
    },[currentUserId])


  return (
    <Grid className='grid-container' container>
        {
            products?.length ? products.map(product => <Grid className='grid-item' item xl={3} lg={4} md={6} xs={12}>
                <InfoCard data = {product} userData={userInfo} handelChange={stockChange} />
                </Grid>) :null
        }

        <Grid item xs={12} >
            <Divider ariant="inset"  sx={{
                    "&::before, &::after": {
                    borderColor: "primary.light",
                    },
                }}>
                <Chip label="Curry" size="big" color='primary' sx={{margin:10}} />
            </Divider>
        </Grid>
         <pre>{JSON.stringify(newItems, null, 2)}</pre>

        {/* <Grid className='grid-item' item xl={3} lg={4} md={6} xs={12}>
            <InfoCard
                image="https://picsum.photos/id/10/2500/1667" // Placeholder image
                title="Bratwurst"
                price={5}
                shortInfo="This is some short info about the item."
                detailedInfo="Here is a more detailed description with additional information..."
                initalStock={5}
                initialOrderQuantity = {1}
            />
        </Grid>
        <Grid className='grid-item' item xl={3} lg={4} md={6} xs={12}>
            <InfoCard
                image="https://picsum.photos/id/10/2500/1667" // Placeholder image
                title="Bratwurst"
                price={5}
                shortInfo="This is some short info about the item."
                detailedInfo="Here is a more detailed description with additional information..."
                initalStock={5}
                initialOrderQuantity = {1}
            />
        </Grid>
        <Grid className='grid-item' item xl={3} lg={4} md={6} xs={12}>
            <InfoCard
                image="https://picsum.photos/id/10/2500/1667" // Placeholder image
                title="Bratwurst"
                price={5}
                shortInfo="This is some short info about the item."
                detailedInfo="Here is a more detailed description with additional information..."
                initalStock={5}
                initialOrderQuantity = {1}
            />
        </Grid> */}
    </Grid>
  );
}

export default OrderFood;
