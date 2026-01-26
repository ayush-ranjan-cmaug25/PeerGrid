package com.peergrid.backend.controller;

import com.peergrid.backend.entity.User;
import com.peergrid.backend.service.MatchingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matching")
@CrossOrigin(origins = "*")
public class MatchingController {

    @Autowired
    private MatchingService matchingService;

    @GetMapping("/direct")
    public ResponseEntity<List<User>> findMatches(@RequestParam String skillNeeded, @RequestParam Integer requesterId) {
        List<User> matches = matchingService.findMatchesWithScore(skillNeeded, requesterId);
        return ResponseEntity.ok(matches);
    }

    @GetMapping("/triangular")
    public ResponseEntity<?> findTriangularMatch(@RequestParam Integer userId) {
        List<User> match = matchingService.findTriangularMatch(userId);
        if (match == null || match.isEmpty()) {
            return ResponseEntity.status(404).body("{\"message\": \"No triangular match found\"}");
        }
        return ResponseEntity.ok(match);
    }
}
