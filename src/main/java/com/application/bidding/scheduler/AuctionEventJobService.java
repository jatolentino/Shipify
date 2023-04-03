package com.application.auction.scheduler;

import com.application.auction.model.Auction;
import com.application.auction.websocket.LiveUpdateController;
import org.quartz.JobBuilder;
import org.quartz.JobDetail;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuctionEventJobService {

    @Autowired
    private LiveUpdateController liveUpdateController;

    private Logger logger = LoggerFactory.getLogger(getClass());

    public void executeSampleJob(Long auctionId, String message) {

        logger.info("The auction event job with auciton id " + auctionId + " has " + message + "ed...");
        liveUpdateController.sendAuctionId(auctionId, message);
    }
}
