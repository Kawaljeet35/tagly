package com.tagly.app.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class MinioProperties {

    @Value("${minio.bucket}")
    private String bucket;

    @Value("${minio.endpoint}")
    private String endpoint;

    @Value("${minio.public-url}")
    private String publicUrl;

    public String getBucket() {
        return bucket;
    }

    public String getEndpoint() {
        return endpoint;
    }

    public String getPublicUrl() {
        return publicUrl;
    }
}