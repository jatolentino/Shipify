package com.application.auction.controller;

import com.application.auction.model.State;
import com.application.auction.service.StateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
public class StateController {

    @Autowired
    private StateService stateService;

    @GetMapping("/states")
    public @ResponseBody Set<State> getAllStates(){
        return stateService.getAllStates();
    }

    @GetMapping("/states/{stateId}")
    public @ResponseBody State getState(@PathVariable Long stateId){
        return stateService.getState(stateId);
    }

    @PostMapping("/states")
    public @ResponseBody State addState(@RequestBody State newState){
        return stateService.addState(newState);
    }

    @PutMapping("/states")
    public @ResponseBody State updateState(@RequestBody State updatedState){
        return stateService.updateState(updatedState);
    }

    @DeleteMapping("/states/{stateId}")
    public void deleteState(@PathVariable Long stateId){
        stateService.deleteState(stateId);
    }
}
