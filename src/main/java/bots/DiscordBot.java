package bots;

import discord4j.core.DiscordClient;
import discord4j.core.GatewayDiscordClient;
import discord4j.core.object.entity.channel.MessageChannel;
import io.quarkus.runtime.StartupEvent;
import discord4j.common.util.Snowflake;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;
import reactor.core.publisher.Mono;

import bots.MessageHandler;

@ApplicationScoped
@Path("/discord")
public class DiscordBot {

    @Inject
    IdiscordBot discordBot;

    @Inject
    MessageHandler handler;

    @PUT
    @Path("/message")
    public Mono<Void> sendMessage(
        @QueryParam("message") String msg, 
        @QueryParam("channelId") String channelId
    ) {
        // Create the Discord client
        DiscordClient client = DiscordClient.create(discordBot.token());

        // Login and send the message
        return client.withGateway(gateway -> 
            // Convert channelId to Snowflake
            gateway.getChannelById(Snowflake.of(channelId))
                .flatMap(channel -> {
                    if (channel instanceof MessageChannel messageChannel) {
                        System.out.println("hier kam das her");
                        return messageChannel.createMessage(msg);
                    }
                    System.out.println("hier");
                    return Mono.empty();
                })
                .onErrorResume(e -> {
                    // Log error or handle it appropriately
                    System.err.println("Failed to send message: " + e.getMessage());
                    return Mono.empty();
                })
        );
    }
    
    void onStart(@Observes StartupEvent ev)
    {
        handler.handleMessages().subscribe();
        // // DiscordClient client = DiscordClient.create(discordBot.token());
        // // GatewayDiscordClient gateway = client.login().block();

        // gateway.on(MessageCreateEvent.class).subscribe(event -> {
        //     String content = event.getMessage().getContent();
        //     if ("!ping".equals(content)) {
        //         event.getMessage().getChannel().block().createMessage("Pong!").block();
        //     }
        // });

        // gateway.onDisconnect().block();
    }
}
     