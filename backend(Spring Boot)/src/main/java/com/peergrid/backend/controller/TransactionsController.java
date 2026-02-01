package com.peergrid.backend.controller;

import com.peergrid.backend.entity.Transaction;
import com.peergrid.backend.entity.User;
import com.peergrid.backend.repository.TransactionRepository;
import com.peergrid.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionsController {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping
    public List<Transaction> getTransactions() {
        return transactionRepository.findAll();
    }

    @GetMapping("/my")
    public ResponseEntity<List<Map<String, Object>>> getMyTransactions() {
        User currentUser = getAuthenticatedUser();
        Integer userId = currentUser.getId();

        List<Transaction> allTransactions = transactionRepository.findAll();

        List<Map<String, Object>> userTransactions = allTransactions.stream()
                .filter(tx -> (tx.getTutor() != null && tx.getTutor().getId().equals(userId)) 
                           || (tx.getLearner() != null && tx.getLearner().getId().equals(userId)))
                .sorted((t1, t2) -> t2.getTimestamp().compareTo(t1.getTimestamp()))
                .map(tx -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", tx.getId());
                    map.put("timestamp", tx.getTimestamp());
                    map.put("skill", tx.getSkill());
                    map.put("points", tx.getPoints());

                    // Determine if this was earned or spent by the current user
                    boolean isTutor = tx.getTutor() != null && tx.getTutor().getId().equals(userId);
                    map.put("type", isTutor ? "Earned" : "Spent");
                    map.put("otherPartyName", isTutor 
                            ? (tx.getLearner() != null ? tx.getLearner().getName() : "Unknown")
                            : (tx.getTutor() != null ? tx.getTutor().getName() : "Unknown"));

                    return map;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(userTransactions);
    }
}
