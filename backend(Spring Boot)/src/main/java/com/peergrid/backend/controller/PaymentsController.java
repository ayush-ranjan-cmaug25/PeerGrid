package com.peergrid.backend.controller;

import com.peergrid.backend.dto.PaymentRequest;
import com.peergrid.backend.dto.PaymentVerificationRequest;
import com.peergrid.backend.entity.User;
import com.peergrid.backend.repository.UserRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentsController {

    @Autowired
    private UserRepository userRepository;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody PaymentRequest request) {
        try {
            if (razorpayKeyId == null || razorpayKeyId.contains("YOUR_KEY")) {
                return ResponseEntity.badRequest().body("Razorpay keys are not configured in backend.");
            }

            RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

            JSONObject options = new JSONObject();
            options.put("amount", request.getAmount().multiply(new BigDecimal(100)).intValue()); // Amount in paise
            options.put("currency", "INR");
            options.put("receipt", UUID.randomUUID().toString());
            options.put("payment_capture", 1); // Auto capture

            Order order = client.orders.create(options);
            String orderId = order.get("id");

            Map<String, Object> response = new HashMap<>();
            response.put("orderId", orderId);
            response.put("keyId", razorpayKeyId);
            return ResponseEntity.ok(response);
        } catch (RazorpayException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating order: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<?> verifyPayment(@RequestBody PaymentVerificationRequest request) {
        try {
            // Verify Signature
            String payload = request.getOrderId() + "|" + request.getPaymentId();
            String generatedSignature;

            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(razorpayKeySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256_HMAC.init(secret_key);
            byte[] hash = sha256_HMAC.doFinal(payload.getBytes(StandardCharsets.UTF_8));

            StringBuilder result = new StringBuilder();
            for (byte b : hash) {
                result.append(String.format("%02x", b));
            }
            generatedSignature = result.toString();

            if (generatedSignature.equals(request.getSignature())) {
                User user = getAuthenticatedUser();
                
                // Add Grid Points (1 INR = 10 GP)
                BigDecimal pointsToAdd = request.getAmount().multiply(new BigDecimal(10));
                user.setGridPoints(user.getGridPoints().add(pointsToAdd));
                userRepository.save(user);

                Map<String, Object> response = new HashMap<>();
                response.put("message", "Payment successful");
                response.put("newBalance", user.getGridPoints());
                response.put("pointsAdded", pointsToAdd);
                
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body("Invalid payment signature");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error verifying payment: " + e.getMessage());
        }
    }
}
