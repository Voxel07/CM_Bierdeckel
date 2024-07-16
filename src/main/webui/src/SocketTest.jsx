import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
// import Keycloak from 'keycloak-js';

const ENDPOINT = 'ws://localhost:8443//data-updates/1'

function SocketTest() {
    const [sharedValue, setSharedValue] = useState('');
    
    const socket = new WebSocket(ENDPOINT);

    useEffect(() => {

        socket.onmessage = (event) => {
            setSharedValue(parseInt(event.data, 10)); // Assuming data is numeric
        };
    }, []);

    const handleIncrement = () => {
        socket.send('increment'); // Send a message to the backend
    };

    const handleDecrement = () => {
        socket.send('decrement'); 
    };

    return (
        <div>
            <button onClick={handleDecrement}>-</button> 
            <span>The current shared value is: {sharedValue}</span>
            <button onClick={handleIncrement}>+</button> 
        </div>
    );
}

export default SocketTest

// async function keycloakTest()
// {
//     const keycloak = new Keycloak({
//         url: 'https://kc.matzeschneider.de',
//         realm: 'CM_Bierdeckel',
//         clientId: 'myapp'
//     });

//     try {
//         const authenticated = await keycloak.init();
//         console.log(`User is ${authenticated ? 'authenticated' : 'not authenticated'}`);
//     } catch (error) {
//         console.error('Failed to initialize adapter:', error);
//     }
// }