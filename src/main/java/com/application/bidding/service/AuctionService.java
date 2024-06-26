package com.application.auction.service;

import com.application.auction.Holder.AuctionHolder;
import com.application.auction.Holder.ItemHolder;
import com.application.auction.model.*;
import com.application.auction.repository.AuctionRepository;
import com.application.auction.repository.UserRepository;
//import com.application.auction.scheduler.AuctionEventJob;
//import com.application.auction.scheduler.TestJob;
import org.quartz.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.converter.Converter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class AuctionService {

    @Autowired
    private AuctionRepository auctionRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private BidService bidService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private ItemService itemService;

    @Autowired
    private Scheduler scheduler;

    private static final Logger log = LoggerFactory.getLogger(AuctionService.class);


    // TODO: change all the lists into Set.
    public List<Auction> getAllAuctions(){
        return auctionRepository.findAll();
    }


    public Set<Auction> getAllAuctionOnDate(LocalDate today) {
        HashSet<Auction> auctions = new HashSet<>(auctionRepository.findAllByAuctionDate(today));
        return auctions;
    }

    public Set<Long> getAllAuctionIds(){

        List<Auction> auctions = getAllAuctions();

        Set<Long> auctionIds = new HashSet<>();
        for (Auction auction : auctions){
            auctionIds.add(auction.getAuctionId());
        }

        return auctionIds;
    }

    public Auction updateAuction(Auction updatedAuction){
        return auctionRepository.save(updatedAuction);
    }

    public Auction addAuction(Auction newAuction){
        return auctionRepository.save(newAuction);
    }

    public void deleteAuction(Long auctionId){
        auctionRepository.deleteById(auctionId);
    }

    public Auction getAuction(Long auctionId){
        return auctionRepository.findById(auctionId).orElse(null);
    }

    public Auction createAuction(AuctionHolder auctionHolder) {
        // TODO: handle editing and deletion of auction

        log.info(auctionHolder.toString());

        String auctionName = auctionHolder.getAuctionName();
        LocalTime auctionTime = LocalTime.parse(auctionHolder.getAuctionTime());
        LocalDate auctionDate = LocalDate.parse(auctionHolder.getAuctionDate());
        String auctionDetails = auctionHolder.getAuctionDetails();

        // TODO: pass duration in number of seconds
        //LocalTime auctionDuration = LocalTime.parse(auctionHolder.getAuctionDuration());
        Long auctionDuration = Long.valueOf(auctionHolder.getAuctionDuration());
        Auction auction = addAuction(new Auction(auctionName, auctionTime, auctionDate, auctionDetails,
                auctionDuration));

        Long seller = auctionHolder.getSeller();
        System.out.println("Seller is: " +seller);
        auction.setSeller(userService.getUser(seller));

        List<Long> bidders = auctionHolder.getBidders();
        for (Long id : bidders){
            User bidder = userService.getUser(id);
            auction.getBidders().add(bidder);
        }

        List<Long> bids = auctionHolder.getBids();
        for (Long id : bids){
            Bid bid = bidService.getBid(id);
            auction.getBids().add(bid);
        }

        List<ItemHolder> itemHolders = auctionHolder.getItemHolderList();
        List<Item> items = new ArrayList<>();

            for (ItemHolder itemHolder : itemHolders) {

                String itemName = itemHolder.getItemName();
                String itemDescription = itemHolder.getItemDescription();
                double startingBid = itemHolder.getStartingBid();
                String image = itemHolder.getImage();

                List<Long> itemCategories = itemHolder.getItemCategories();
                Long seller_item = itemHolder.getSeller();
                Long auction_item = itemHolder.getAuction();   // nope
                List<Long> bids_item = itemHolder.getBids();

                Item item = itemService.addItem(new Item(itemName, itemDescription, startingBid, image));
                item.setSeller(userService.getUser(seller_item));

                // add categories
                List<Category> categories = new ArrayList<>();
                for (Long cat : itemCategories) {

                    Category category = categoryService.getCategory(cat);
                    category.setItem(item);

                    categoryService.updateCategory(category);

                    categories.add(category);
                }
                item.setItemCategories(new HashSet<>(categories));

                // update the item finally
                item.setAuction(auction);
                item = itemService.updateItem(item);
//                auction.getItems().add(item);
                items.add(item);
            }

        // set items for auction
        auction.setItems(new HashSet<>(items));
        return updateAuction(auction);
    }

    public void participate(Long auctionId, Long bidderId) {
        Auction auction = getAuction(auctionId);
        User bidder = userService.getUser(bidderId);

        auction.getBidders().add(bidder);
        bidder.getAuctionsParticipated().add(auction);

        updateAuction(auction);
        userService.updateUser(bidder);
    }

    public Set<Bid> allBids(Long auctionId){
        Auction auction = getAuction(auctionId);
        return auction.getBids();
    }

    public void unsubscribe(Long auctionId, Long bidderId) {
        // remove the auction from the user's list and vice-versa
        Auction auction = getAuction(auctionId);
        User bidder = userService.getUser(bidderId);

        auction.getBidders().remove(bidder);
        bidder.getAuctionsParticipated().remove(auction);

        updateAuction(auction);
        userService.updateUser(bidder);
    }

//    public void schedule(Auction auction) {
//
//        LocalDate date = LocalDate.parse(auction.getAuctionDate());
//        LocalTime time = LocalTime.parse(auction.getAuctionTime());
//        LocalDateTime startDateTime = date.atTime(time);
//
//        LocalTime duration = LocalTime.parse(auction.getAuctionDuration());
//        LocalTime endTime = time.plusSeconds(duration.getSecond())
//                .plusMinutes(duration.getMinute())
//                .plusHours(duration.getHour());
//
//        LocalDate endDate = LocalDate.parse(auction.getAuctionDate());
//        LocalDateTime endDateTime = endDate.atTime(endTime);
//
//
//        JobDataMap dataMap = new JobDataMap();
//        dataMap.put("auctionId", auction.getAuctionId());
//
//        JobDetail jobDetail = JobBuilder.newJob(TestJob.class)
//                .setJobData(dataMap)
//                .build();
//
//        Trigger trigger = TriggerBuilder.newTrigger()
//                .forJob(jobDetail)
//                .startAt(Time.valueOf(time))
//                .endAt(Time.valueOf(endTime))
//                .build();
//
//        try {
//            scheduler.scheduleJob(jobDetail, trigger);
//            log.info("Successfully registered trigger for auction id: {} @ {}", auction.getAuctionId(), time);
//        } catch (SchedulerException e) {
//            e.printStackTrace();
//        }
//    }
}
