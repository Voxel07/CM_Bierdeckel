import axios from 'axios';

const webSocketEvents = new EventTarget();
let socket = null;
let reconnectTimeout = null;
const clientId = 'client-' + Math.random().toString(36).substring(2, 11);

function getWebSocketUri() {
  const baseURL = axios.defaults.baseURL || '/api/';
  const isAbsolute = baseURL.startsWith('http://') || baseURL.startsWith('https://');
  let base;
  
  if (isAbsolute) {
    base = baseURL;
  } else {
    const protocol = window.location.protocol;
    const host = window.location.host;
    // Handle leading slash or build relative path correctly
    const relativePart = baseURL.startsWith('/') ? baseURL : `/${baseURL}`;
    base = `${protocol}//${host}${relativePart}`;
  }
  
  // Replace http/https protocol with ws/wss
  let wsBase = base.replace(/^http/, 'ws');
  // Strip trailing '/api/' or '/api' to connect to the root-based websocket endpoint
  wsBase = wsBase.replace(/\/api\/?$/, '');
  
  return `${wsBase}/data-updates/${clientId}`;
}

export function initWebSocket() {
  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
    return;
  }

  const uri = getWebSocketUri();
  console.log('Connecting to WebSocket:', uri);
  
  try {
    socket = new WebSocket(uri);

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onmessage = (event) => {
      console.log('WebSocket received:', event.data);
      webSocketEvents.dispatchEvent(new CustomEvent('message', { detail: event.data }));
    };

    socket.onclose = (event) => {
      console.log('WebSocket connection closed. Reconnecting in 3s...', event.reason);
      socket = null;
      clearTimeout(reconnectTimeout);
      reconnectTimeout = setTimeout(initWebSocket, 3000);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      if (socket) {
        socket.close();
      }
    };
  } catch (err) {
    console.error('Failed to create WebSocket connection:', err);
    clearTimeout(reconnectTimeout);
    reconnectTimeout = setTimeout(initWebSocket, 3000);
  }
}

export function subscribeToWebSocket(callback) {
  const handler = (e) => callback(e.detail);
  webSocketEvents.addEventListener('message', handler);
  return () => {
    webSocketEvents.removeEventListener('message', handler);
  };
}

export function sendWebSocketMessage(message) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(message);
  } else {
    console.warn('Cannot send WebSocket message, socket is not open:', message);
  }
}
