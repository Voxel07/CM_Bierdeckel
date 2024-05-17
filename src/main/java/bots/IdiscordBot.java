package bots;
import io.smallrye.config.ConfigMapping;

@ConfigMapping(prefix = "discord")
public interface IdiscordBot {

    String token();
    String clientId();
    String clientSecret();
    
}
