package test;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnError;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;
import jakarta.websocket.Session;

@ServerEndpoint("/data-updates/{usedid}")
@ApplicationScoped
public class SocketTest {

    private final Map<String, Session> sessions = new ConcurrentHashMap<>();

    @OnOpen
    public void onOpen(Session session, @PathParam("usedid") String userId) {
        System.out.println("WebSocket opened for user/client: " + userId);
        sessions.put(userId, session);
    }

    @OnClose
    public void onClose(Session session, @PathParam("usedid") String userId) {
        System.out.println("WebSocket closed for user/client: " + userId);
        sessions.remove(userId);
    }

    @OnError
    public void onError(Session session, Throwable error) {
        System.err.println("WebSocket error: " + error.getMessage());
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        System.out.println("WebSocket received message: " + message);
        broadcast(message);
    }

    public void broadcast(String message) {
        sessions.values().forEach(s -> {
            if (s.isOpen()) {
                s.getAsyncRemote().sendObject(message, result ->  {
                    if (result.getException() != null) {
                        System.err.println("Unable to send message: " + result.getException());
                    }
                });
            }
        });
    }
}