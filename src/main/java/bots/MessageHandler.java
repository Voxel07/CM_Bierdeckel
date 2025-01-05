package bots;

import java.sql.Time;
import java.text.SimpleDateFormat;
import java.util.Calendar;

import discord4j.core.DiscordClient;
import discord4j.core.event.domain.message.MessageCreateEvent;
import discord4j.core.object.entity.Message;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import reactor.core.publisher.Mono;

@ApplicationScoped
public class MessageHandler {

    @Inject
    IdiscordBot discordBot;

    @Inject
    DocuSeal docuSeal;

    public Mono<Void> handleMessages() {
        DiscordClient client = DiscordClient.create(discordBot.token());

        return client.withGateway(gateway -> 
            gateway.on(MessageCreateEvent.class, event -> {
                Message message = event.getMessage();
                
                // Ignore messages from bots to prevent potential loops
                if (message.getAuthor().map(user -> user.isBot()).orElse(false)) {
                    return Mono.empty();
                }

                // Get the content of the message
                String content = message.getContent().toLowerCase();

                // Handle different types of messages
                return handleMessageCommands(message, content);
            })
            .then()
        );
    }

    private Mono<Void> handleMessageCommands(Message message, String content) {
        // Example command handlers
        if (content.startsWith("!hello")) {
            return replyToMessage(message, "Hi there! How are you today?");
        }

        if (content.startsWith("!id")) {
            String dcUsername = message.getAuthor().get().getUsername();
            String url = docuSeal.sendPostRequest(dcUsername);
            // System.out.println(res.getEntity().toString());
            return replyToMessage(message, "Hi there " + dcUsername + " " + url);
        }

        if (content.startsWith("!ping")) {
            return replyToMessage(message, "Pong!");
        }

        if (content.startsWith("!help")) {
            return replyToMessage(message, 
                "Available commands:\n" +
                "!hello - Get a greeting\n" +
                "!ping - Check bot responsiveness\n" +
                "!help - Show this help message" +
                "!id - To get a link to the Verzichtserklärung document"
            );
        }

        if (content.startsWith("!date"))
        {
            String timeStamp = new SimpleDateFormat("dd.MM.yyyy HH:mm:ss").format(Calendar.getInstance().getTime());
            return replyToMessage(message, timeStamp);
        }

        // Add more complex command handling as needed
        // For example, you could add more sophisticated commands
        if (content.startsWith("!quote")) {
            return handleQuoteCommand(message);
        }

        // Optional: default response for unrecognized commands
        if (content.startsWith("!")) {
            return replyToMessage(message, "Sorry, I don't recognize that command. Type !help for available commands.");
        }

        // For messages without commands, you can add optional logic
        // For example, a simple response to mentions
        if (message.getUserMentionIds().contains(message.getClient().getSelfId())) {
            return replyToMessage(message, "You mentioned me! How can I help?");
        }

        // Return empty Mono for messages that don't match any specific handling
        return Mono.empty();
    }

    private Mono<Void> replyToMessage(Message message, String response) {
        return message.getChannel()
            .flatMap(channel -> channel.createMessage(response))
            .then();
    }

    private Mono<Void> handleQuoteCommand(Message message) {
        // Example of a more complex command
        String[] quotes = {
            "Wisdom is not in knowing all the answers, but in asking the right questions.",
            "Success is not final, failure is not fatal: it is the courage to continue that counts.",
            "The only way to do great work is to love what you do."
        };

        // Randomly select a quote
        String quote = quotes[(int) (Math.random() * quotes.length)];
        return replyToMessage(message, "Here's a quote: \"" + quote + "\"");
    }

    
}