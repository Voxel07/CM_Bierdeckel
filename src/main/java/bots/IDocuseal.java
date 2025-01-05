package bots;
import io.smallrye.config.ConfigMapping;

@ConfigMapping(prefix = "docuseal")
public interface IDocuseal {

    String key();
    String url();
    
}
