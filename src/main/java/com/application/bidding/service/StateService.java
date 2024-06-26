package com.application.auction.service;

import com.application.auction.model.State;
import com.application.auction.repository.StateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class StateService {

    @Autowired
    private StateRepository stateRepository;

    public Set<State> getAllStates(){
        Set<State> states = new HashSet<>();
        stateRepository.findAll().forEach(states::add);
        return states;
    }

    public State addState(State newState){
        return stateRepository.save(newState);
    }

    public State updateState(State updatedState){
        return stateRepository.save(updatedState);
    }

    public void deleteState(Long stateId){
        stateRepository.deleteById(stateId);
    }

    public State getState(Long stateId){
        return stateRepository.findById(stateId).orElse(null);
    }
}
