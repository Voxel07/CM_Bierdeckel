package bots;

import discord4j.core.DiscordClient;
import discord4j.core.GatewayDiscordClient;
import discord4j.core.object.entity.channel.MessageChannel;
import discord4j.discordjson.json.MessageCreateRequest;
import discord4j.rest.RestClient;
import discord4j.rest.service.ChannelService;
import discord4j.rest.util.MultipartRequest;
import io.quarkus.runtime.StartupEvent;
import discord4j.common.util.Snowflake;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.context.RequestScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;
import reactor.core.publisher.Mono;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@RequestScoped
@Path("/discord")
public class DiscordBot {
    private static final Logger logger = LoggerFactory.getLogger(DiscordBot.class);

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
        // Validate input
        if (msg == null || msg.trim().isEmpty()) {
            logger.warn("Attempted to send an empty message");
            return Mono.error(new IllegalArgumentException("Message cannot be empty"));
        }

        if (channelId == null || channelId.trim().isEmpty()) {
            logger.warn("No channel ID provided");
            return Mono.error(new IllegalArgumentException("Channel ID is required"));
        }

        // Create REST client
        RestClient restClient = RestClient.create(discordBot.token());
        
        // Get the channel service
        ChannelService channelService = restClient.getChannelService();

        // Create message request
        MessageCreateRequest messageRequest = MessageCreateRequest.builder()
            .content(msg)
            .build();

        // Create multipart request
        MultipartRequest<MessageCreateRequest> multipartRequest = MultipartRequest.ofRequest(messageRequest);

        // Send message using the correct method signature
        return channelService.createMessage(Long.parseLong(channelId), multipartRequest)
            .doOnSuccess(message -> logger.info("Message sent successfully to channel: {}", channelId))
            .doOnError(error -> logger.error("Failed to send message", error))
            .onErrorResume(error -> {
                logger.error("Error details: {}", error.getMessage(), error);
                return Mono.empty();
            })
            .then();
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
     