package com.peergrid.backend.service;

import com.peergrid.backend.entity.User;
import com.peergrid.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MatchingService {

    @Autowired
    private UserRepository userRepository;

    public List<User> findMatchesWithScore(String skillNeeded, Integer requesterId) {
        List<User> allUsers = userRepository.findAll();
        
        return allUsers.stream()
                .filter(u -> !u.getId().equals(requesterId))
                .filter(u -> !"Admin".equalsIgnoreCase(u.getRole()))
                .filter(u -> u.getSkillsOffered().contains(skillNeeded))
                .collect(Collectors.toList());
    }

    public List<User> findTriangularMatch(Integer userId) {

        return new ArrayList<>();
    }
}
