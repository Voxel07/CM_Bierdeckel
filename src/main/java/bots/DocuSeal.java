package bots;

import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.client.Entity;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.inject.Inject;
import jakarta.json.Json;

import java.util.List;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.Collections;
import java.util.Map;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

class SubmissionResponse {
    private Long id;
    private String slug;
    private String uuid;
    private String name;
    private String email;
    private String phone;
    private String completedAt;
    private String declinedAt;
    private String externalId;
    private Long submissionId;
    private Map<String, Object> metadata;
    private String openedAt;
    private String sentAt;
    private String createdAt;
    private String updatedAt;
    private String status;
    private String applicationKey;
    private String role;
    private String embedSrc;

    // Getters and setters
    @JsonProperty("embed_src")
    public String getEmbedSrc() { return embedSrc; }
    
    @JsonProperty("embed_src")
    public void setEmbedSrc(String embedSrc) { this.embedSrc = embedSrc; }
    
    // Other getters and setters...
}
class SubmissionPayload {
    @JsonProperty("template_id")
    private Integer templateId;
    @JsonProperty("send_email")
    private Boolean sendEmail;
    @JsonProperty("submitters")
    private List<Submitter> submitters;

    // Getters and setters
    public Integer getTemplateId() { return templateId; }
    public void setTemplateId(Integer templateId) { this.templateId = templateId; }
    
    public Boolean getSendEmail() { return sendEmail; }
    public void setSendEmail(Boolean sendEmail) { this.sendEmail = sendEmail; }
    
    public List<Submitter> getSubmitters() { return submitters; }
    public void setSubmitters(List<Submitter> submitters) { this.submitters = submitters; }

    @Override
    public String toString() {
        return "SubmissionPayload{" +
                "templateId=" + templateId +
                ", sendEmail=" + sendEmail +
                ", submitters=" + submitters +
                '}';
    }
}

// Field.java
class Field {
    private String name;
    @JsonProperty("default_value")
    private String defaultValue;

    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDefaultValue() { return defaultValue; }
    public void setDefaultValue(String defaultValue) { this.defaultValue = defaultValue; }

    @Override
    public String toString() {
        return "Field{" +
                "name='" + name + '\'' +
                ", defaultValue='" + defaultValue + '\'' +
                '}';
    }
}

// Submitter.java
class Submitter {
    private String name;
    @JsonProperty("Discord")
    private String discord;
    private List<Field> fields;

    // Getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getDiscord() { return discord; }
    public void setDiscord(String discord) { this.discord = discord; }
    
    public List<Field> getFields() { return fields; }
    public void setFields(List<Field> fields) { this.fields = fields; }

    @Override
    public String toString() {
        return "Submitter{" +
                "name='" + name + '\'' +
                ", discord='" + discord + '\'' +
                ", fields=" + fields +
                '}';
    }
}

@ApplicationScoped
public class DocuSeal {

    @Inject
    IDocuseal docuseal;

    @Inject
    ObjectMapper objectMapper;

    public String sendPostRequest(String dcUserName) {

        SubmissionPayload payload = new SubmissionPayload();
        payload.setTemplateId(4);
        payload.setSendEmail(false);
        
        Field field = new Field();
        field.setName("Discord");
        field.setDefaultValue(dcUserName);
        
        Submitter submitter = new Submitter();
        submitter.setName(dcUserName);
        submitter.setDiscord(dcUserName);
        submitter.setFields(Collections.singletonList(field));
        
        payload.setSubmitters(Collections.singletonList(submitter));
        
        Client client = ClientBuilder.newClient();

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            String jsonPayload = objectMapper.writeValueAsString(payload);

            // Make the POST request
            Response response = client
            .target(docuseal.url())
            .request(MediaType.APPLICATION_JSON)
            .header("X-Auth-Token", docuseal.key())
            .post(Entity.entity(jsonPayload, MediaType.APPLICATION_JSON));

            
            String responseString = response.readEntity(String.class);
            System.out.println("Response: " + responseString);
            List<Map<String, Object>> responseList = objectMapper.readValue(responseString, new TypeReference<List<Map<String, Object>>>() {});
            String embedSrc = null;
            // Access the embed_src
            if (!responseList.isEmpty() && responseList.get(0).containsKey("embed_src")) {
                embedSrc = (String) responseList.get(0).get("embed_src");
                System.out.println("Embed Source: " + embedSrc);

                // Store in a variable or use as needed
            } else {
                System.out.println("embed_src not found in the response.");
            }

            return embedSrc;
        }
        catch (Exception e) {
           System.out.println(e.getMessage());
           return null;
        }

    }
}

      
