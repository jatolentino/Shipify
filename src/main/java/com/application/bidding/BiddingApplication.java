package com.application.bidding;

import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import org.bson.types.ObjectId;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@EnableMongoRepositories(basePackages = "com.application.bidding.repository")
@SpringBootApplication
public class BiddingApplication {

    public static void main(String[] args) {
        SpringApplication.run(BiddingApplication.class, args);
    }

    @Bean
    public Jackson2ObjectMapperBuilderCustomizer customizer()
    {
        return builder -> builder.serializerByType(ObjectId.class,new ToStringSerializer());
    }
}
