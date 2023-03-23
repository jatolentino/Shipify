package com.application.bidding.repository;

import com.application.bidding.model.Product;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IProductRepository extends MongoRepository<Product, String> {
    // Define custom finder methods here
    Optional<Product> findById(ObjectId objectId);
    void deleteById(ObjectId objectId);
}
