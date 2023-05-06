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

@SpringBootTest
class AuctionServiceTests {

    @Test
    void contestLoads(){
        
    }
}
