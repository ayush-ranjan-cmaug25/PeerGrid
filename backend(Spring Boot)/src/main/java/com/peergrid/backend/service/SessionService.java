package com.peergrid.backend.service;

import com.peergrid.backend.entity.Session;
import com.peergrid.backend.entity.Transaction;
import com.peergrid.backend.entity.User;
import com.peergrid.backend.repository.SessionRepository;
import com.peergrid.backend.repository.TransactionRepository;
import com.peergrid.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class SessionService {

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Transactional
    public Session createDoubt(@NonNull Integer userId, String title, String description, String topic, BigDecimal bounty) {
        User learner = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        if (learner.getGridPoints().compareTo(bounty) < 0) {
            throw new RuntimeException("Insufficient GridPoints");
        }

        // Lock points
        learner.setGridPoints(learner.getGridPoints().subtract(bounty));
        learner.setLockedPoints(learner.getLockedPoints().add(bounty));
        userRepository.save(learner);

        Session session = new Session();
        session.setLearner(learner);
        session.setTitle(title);
        session.setDescription(description);
        session.setTopic(topic);
        session.setCost(bounty);
        session.setStatus("Open");
        session.setStartTime(LocalDateTime.now());
        session.setEndTime(LocalDateTime.now().plusHours(1));

        return sessionRepository.save(session);
    }

    @Transactional
    public void acceptDoubt(@NonNull Integer sessionId, @NonNull Integer tutorId) {
        Session session = sessionRepository.findById(sessionId).orElseThrow(() -> new RuntimeException("Session not found"));
        User tutor = userRepository.findById(tutorId).orElseThrow(() -> new RuntimeException("Tutor not found"));

        if (!"Open".equals(session.getStatus())) {
            throw new RuntimeException("Session is not open");
        }

        session.setTutor(tutor);
        session.setStatus("Confirmed");
        session.setStartTime(LocalDateTime.now()); // Or scheduled time
        sessionRepository.save(session);
    }

    @Transactional
    public void bookSession(@NonNull Integer learnerId, @NonNull Integer tutorId, BigDecimal cost, String topic, LocalDateTime startTime) {
        User learner = userRepository.findById(learnerId).orElseThrow(() -> new RuntimeException("Learner not found"));
        User tutor = userRepository.findById(tutorId).orElseThrow(() -> new RuntimeException("Tutor not found"));

        if (learner.getGridPoints().compareTo(cost) < 0) {
            throw new RuntimeException("Insufficient GridPoints");
        }

        learner.setGridPoints(learner.getGridPoints().subtract(cost));
        learner.setLockedPoints(learner.getLockedPoints().add(cost));
        userRepository.save(learner);

        Session session = new Session();
        session.setLearner(learner);
        session.setTutor(tutor);
        session.setTopic(topic);
        session.setCost(cost);
        session.setStatus("Pending");
        session.setStartTime(startTime);
        session.setEndTime(startTime.plusHours(1)); // Default 1 hour
        sessionRepository.save(session);
    }

    @Transactional
    public void acceptSessionRequest(@NonNull Integer sessionId) {
        Session session = sessionRepository.findById(sessionId).orElseThrow(() -> new RuntimeException("Session not found"));
        if (!"Pending".equals(session.getStatus())) {
            throw new RuntimeException("Session is not pending");
        }
        session.setStatus("Confirmed");
        sessionRepository.save(session);
    }

    @Transactional
    public void rejectSessionRequest(@NonNull Integer sessionId) {
        Session session = sessionRepository.findById(sessionId).orElseThrow(() -> new RuntimeException("Session not found"));
        if (!"Pending".equals(session.getStatus())) {
            throw new RuntimeException("Session is not pending");
        }
        
        // Refund learner
        User learner = session.getLearner();
        BigDecimal cost = session.getCost();
        learner.setLockedPoints(learner.getLockedPoints().subtract(cost));
        learner.setGridPoints(learner.getGridPoints().add(cost));
        userRepository.save(learner);

        session.setStatus("Cancelled");
        sessionRepository.save(session);
    }

    @Transactional
    public Transaction completeSession(@NonNull Integer learnerId, @NonNull Integer tutorId, BigDecimal cost) {
        User learner = userRepository.findById(learnerId).orElseThrow(() -> new RuntimeException("Learner not found"));
        User tutor = userRepository.findById(tutorId).orElseThrow(() -> new RuntimeException("Tutor not found"));

        // Unlock points and transfer
        learner.setLockedPoints(learner.getLockedPoints().subtract(cost));
        tutor.setGridPoints(tutor.getGridPoints().add(cost));
        
        userRepository.save(learner);
        userRepository.save(tutor);

        // Find session to mark completed (simplified logic, assumes last active session)
        // In real app, pass sessionId
        
        Transaction transaction = new Transaction();
        transaction.setLearner(learner);
        transaction.setTutor(tutor);
        transaction.setPoints(cost);
        transaction.setTimestamp(LocalDateTime.now());
        transaction.setType("Transfer");
        
        return transactionRepository.save(transaction);
    }

    @Autowired
    private com.peergrid.backend.repository.FeedbackRepository feedbackRepository;

    @Transactional
    public void rateSession(@NonNull Integer transactionId, Integer sessionId, Double rating, String comment) {
        Transaction transaction = transactionRepository.findById(transactionId).orElseThrow(() -> new RuntimeException("Transaction not found"));
        transaction.setRating(rating);
        transactionRepository.save(transaction);

        if (sessionId != null) {
            Session session = sessionRepository.findById(sessionId).orElse(null);
            if (session != null) {
                if (!"Completed".equals(session.getStatus())) {
                    session.setStatus("Completed");
                    sessionRepository.save(session);
                }
                
                com.peergrid.backend.entity.Feedback feedback = new com.peergrid.backend.entity.Feedback();
                feedback.setSession(session);
                feedback.setFromUserId(transaction.getLearner().getId());
                feedback.setRating(rating.intValue());
                feedback.setComment(comment != null ? comment : "");
                feedbackRepository.save(feedback);
            }
        }
    }
}
