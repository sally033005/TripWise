package com.project.tripwise.service;

import java.io.IOException;
import java.nio.file.*;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import jakarta.annotation.PostConstruct;

@Service
public class FileService {

    private final Path fileStorageLocation;

    @Value("${cloudinary.cloud_name}")
    private String cloudName;

    @Value("${cloudinary.api_key}")
    private String apiKey;

    @Value("${cloudinary.api_secret}")
    private String apiSecret;

    private Cloudinary cloudinary;

    @PostConstruct
    public void init() {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true));
    }

    // Initialize the file storage location from application properties
    public FileService(@Value("${file.upload-dir}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (IOException ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    // Store the file and return the stored file name/path
    public String storeFile(MultipartFile file) throws IOException {
        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(),
                ObjectUtils.asMap(
                        "resource_type", "auto",
                        "access_mode", "public",
                        "type", "upload"));

        Object secureUrl = uploadResult.get("secure_url");
        if (secureUrl == null) {
            throw new IOException("Failed to get secure_url from Cloudinary response");
        }
        return secureUrl.toString();
    }

    // Delete a file by its name
    public void deleteFile(String fileIdentifier) {
        if (fileIdentifier == null || fileIdentifier.isEmpty())
            return;

        if (fileIdentifier.startsWith("http")) {
            try {
                String[] parts = fileIdentifier.split("/");
                String lastPart = parts[parts.length - 1];
                String publicId = lastPart.substring(0, lastPart.lastIndexOf("."));

                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
                System.out.println("Successfully deleted from Cloudinary: " + publicId);
            } catch (Exception e) {
                System.err.println("Cloudinary delete failed: " + e.getMessage());
            }
        } else {
            try {
                Path filePath = this.fileStorageLocation.resolve(fileIdentifier).normalize();
                Files.deleteIfExists(filePath);
            } catch (IOException ex) {
                System.err.println("Local delete failed: " + ex.getMessage());
            }
        }
    }
}