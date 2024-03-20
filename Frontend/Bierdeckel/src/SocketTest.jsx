import React, { useState, useEffect } from 'react';

const ENDPOINT = 'ws://localhost:8080//data-updates/1'

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
