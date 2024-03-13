package test;

import java.io.IOException;
import java.util.Map;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

import io.smallrye.common.annotation.Blocking;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnError;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;
import jakarta.websocket.Session;
import jakarta.inject.Inject;
import jakarta.json.JsonObject;
import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;

import model.Product;
import orm.ProductOrm;

@ServerEndpoint("/data-updates/{usedid}")

@ApplicationScoped
public class SocketTest {

    @Inject
    ProductOrm productOrm;

    private Map<String, Session> sessions = new ConcurrentHashMap<>(); 
    private List<Product> myCachedProdcts = new ArrayList<>();

    private int openConnections = 0;
    private int currentValue = 0; 

    @OnOpen
    public void onOpen(Session session, @PathParam("usedid") String userId) {
        System.out.println("Open " + openConnections);
        sessions.put(userId, session);
        openConnections += 1;
    }

    @OnClose
    public void onClose(Session session, @PathParam("usedid") String userId) {
        System.out.println("Close");
        // openConnections -= 1;
        sessions.remove(userId);
    }

    @OnError void onError(Session session, Throwable error) {
        System.out.println(error.toString());

        session.getAsyncRemote().sendText("An error has occurred.");
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        Jsonb jsonb = JsonbBuilder.create();
        Product feProduct;

        try {
            feProduct = jsonb.fromJson(message, Product.class); 
            
        } catch (Exception e) {
            System.out.println(e);

            return;
        }

        for (Product product : myCachedProdcts) {
            if(product.getId() == feProduct.getId())
            {
                product.decStock(1L);
                System.out.println("found");

            }
            else
            {
                System.out.println("duck");
            }
        }

        System.out.println(feProduct.getId());
        
        if(message.equals("increment"))
        {
            currentValue +=1;
        }
        else if (message.equals("decrement"))
        {
            currentValue -=1;
        }

        // System.out.println(message);

        broadcast(String.valueOf(myCachedProdcts.get(0).getStock())); 
    }

    public void broadcast(String message) {
        sessions.values().forEach(s -> {
            s.getAsyncRemote().sendObject(message, result ->  {
                if (result.getException() != null) {
                    System.out.println("Unable to send message: " + result.getException());
                }
            });
        });
    }

}