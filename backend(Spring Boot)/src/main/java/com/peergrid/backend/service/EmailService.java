package com.peergrid.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendRegistrationEmail(String toEmail, String name) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@peergrid.com");
            message.setTo(toEmail);
            message.setSubject("Welcome to PeerGrid!");
            message.setText("Hello " + name + ",\n\n" +
                    "Welcome to PeerGrid! Your registration was successful.\n" +
                    "We have credited 100 Grid Points to your account as a welcome bonus.\n\n" +
                    "Happy Learning!\n" +
                    "The PeerGrid Team");

            mailSender.send(message);
            System.out.println("Registration email sent to " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
            // Don't block registration if email fails
        }
    }
    public void sendWebinarRegistrationEmail(String toEmail, String userName, String webinarTitle, String time, String link) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@peergrid.com");
            message.setTo(toEmail);
            message.setSubject("Webinar Registration Confirmed: " + webinarTitle);
            message.setText("Hello " + userName + ",\n\n" +
                    "You have successfully registered for the webinar: " + webinarTitle + ".\n" +
                    "Scheduled Time: " + time + "\n" +
                    "Meeting Link: " + link + "\n\n" +
                    "See you there!\n" +
                    "The PeerGrid Team");

            mailSender.send(message);
            System.out.println("Webinar email sent to " + toEmail);
        } catch (Exception e) {
            System.err.println("Failed to send webinar email: " + e.getMessage());
        }
    }
}
