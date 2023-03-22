package com.application.bidding.repository;

import com.application.bidding.model.Auction;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IAuctionRepository extends MongoRepository<Auction, String> {
    // Define custom finder methods here
    Optional<Auction> findById(ObjectId objectId);
    void deleteById(ObjectId objectId);
}
