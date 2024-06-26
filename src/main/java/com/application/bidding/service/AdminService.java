package com.application.auction.service;

import com.application.auction.model.Admin;
import com.application.auction.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    public Set<Admin> getAllAdmins(){
        Set<Admin> admins = new HashSet<>();
        adminRepository.findAll().forEach(admins::add);
        return admins;
    }

    public Admin updateAdmin(Admin updatedAdmin){
        return adminRepository.save(updatedAdmin);
    }

    public Admin addAdmin(Admin newAdmin){
        return adminRepository.save(newAdmin);
    }

    public void deleteAdmin(Long adminId){
        adminRepository.deleteById(adminId);
    }

    public Admin getAdmin(Long adminId){
        return adminRepository.findById(adminId).orElse(null);
    }
}
