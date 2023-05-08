package com.application.auction.service;

import com.application.auction.Holder.HighestBidInfo;
import com.application.auction.model.Auction;
import com.application.auction.model.Bid;
import com.application.auction.model.Item;
import com.application.auction.model.User;
import com.application.auction.repository.BidRepository;
import com.application.auction.websocket.LiveUpdateController;
import com.application.auction.websocket.LiveUpdateMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class BidServiceTests {

    @Test
    void contestLoads(){

    }
}
