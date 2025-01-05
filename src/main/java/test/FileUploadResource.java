package test;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.resteasy.reactive.RestForm;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@jakarta.ws.rs.Path("/upload")
public class FileUploadResource {

    private static final String UPLOAD_DIRECTORY = "uploads";
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

    public FileUploadResource() {
        File uploadDir = new File(UPLOAD_DIRECTORY);
        if (!uploadDir.exists()) {
            if (!uploadDir.mkdirs()) {
                throw new RuntimeException("Failed to create upload directory");
            }
        }
    }

    @POST
    @jakarta.ws.rs.Path("/pdf")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response uploadPdf(@RestForm("file") Path uploadedFilePath) {
        if (uploadedFilePath == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(new UploadResponse(null, "No file provided"))
                    .build();
        }

        try {
            // Validate file size
            if (Files.size(uploadedFilePath) > MAX_FILE_SIZE) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity(new UploadResponse(null, "File size exceeds maximum limit"))
                        .build();
            }

            // Validate content type
            // String contentType = Files.probeContentType(uploadedFilePath);
            // if (contentType == null || !contentType.equals("multipart/form-data")) {
            //     return Response.status(Response.Status.BAD_REQUEST)
            //             .entity(new UploadResponse(null, "Only PDF files are allowed"))
            //             .build();
            // }

            // Generate unique filename
            String fileName = UUID.randomUUID().toString() + ".pdf";
            Path destinationPath = Paths.get(UPLOAD_DIRECTORY, fileName).toAbsolutePath();

            // Move uploaded file to the uploads directory
            // Files.copy(uploadedFilePath, destinationPath); //TODO: commented to avoid uploads while in development
            Files.delete(uploadedFilePath); // Clean up the temporary file

            return Response.ok(new UploadResponse(fileName, "File uploaded successfully")).build();
        } catch (IOException e) {
            return Response.serverError()
                    .entity(new UploadResponse(null, "Failed to upload file: " + e.getMessage()))
                    .build();
        }
    }

    public static class UploadResponse {
        public final String fileName;
        public final String message;

        public UploadResponse(String fileName, String message) {
            this.fileName = fileName;
            this.message = message;
        }
    }
}