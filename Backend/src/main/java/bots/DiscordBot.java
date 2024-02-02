package bots;

import discord4j.core.DiscordClient;
import discord4j.core.GatewayDiscordClient;
import discord4j.core.event.domain.message.MessageCreateEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;
import reactor.core.publisher.Mono;
import discord4j.core.object.entity.Message;
import io.quarkus.runtime.StartupEvent;

@ApplicationScoped
@Path("/discord")
public class DiscordBot {

    @Inject
    IdiscordBot discordBot;

    @PUT
    @Path("/message")
    public void sendMessage(@QueryParam("message") String msg) 
    {
        DiscordClient client = DiscordClient.create(discordBot.token());

        Mono<Void> login = client.withGateway((GatewayDiscordClient gateway) -> Mono.empty());
    
        login.block();
    }

    // void onStart(@Observes StartupEvent ev)
    // {
    //     DiscordClient client = DiscordClient.create(discordBot.token());
    //     GatewayDiscordClient gateway = client.login().block();

    //     gateway.on(MessageCreateEvent.class).subscribe(event -> {
    //         String content = event.getMessage().getContent();
    //         if ("!ping".equals(content)) {
    //             event.getMessage().getChannel().block().createMessage("Pong!").block();
    //         }
    //     });

    //     gateway.onDisconnect().block();
    // }
}
