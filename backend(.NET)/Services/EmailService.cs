using Microsoft.Extensions.Configuration;
using System;
using System.Net.Mail;
using System.Net;

namespace PeerGrid.Backend.Services
{
    public interface IEmailService
    {
        void SendRegistrationEmail(string toEmail, string name);
        void SendWebinarRegistrationEmail(string toEmail, string userName, string webinarTitle, string time, string link);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public void SendRegistrationEmail(string toEmail, string name)
        {
            SendEmail(toEmail, "Welcome to PeerGrid!",
                $"Hello {name},\n\n" +
                "Welcome to PeerGrid! Your registration was successful.\n" +
                "We have credited 100 Grid Points to your account as a welcome bonus.\n\n" +
                "Happy Learning!\n" +
                "The PeerGrid Team");
        }

        public void SendWebinarRegistrationEmail(string toEmail, string userName, string webinarTitle, string time, string link)
        {
            SendEmail(toEmail, $"Webinar Registration Confirmed: {webinarTitle}",
                $"Hello {userName},\n\n" +
                $"You have successfully registered for the webinar: {webinarTitle}.\n" +
                $"Scheduled Time: {time}\n" +
                $"Meeting Link: {link}\n\n" +
                "See you there!\n" +
                "The PeerGrid Team");
        }

        private void SendEmail(string toEmail, string subject, string body)
        {
            try
            {
                var smtpHost = _configuration["Email:Host"] ?? "smtp.gmail.com";
                var smtpPort = int.Parse(_configuration["Email:Port"] ?? "587");
                var smtpUser = _configuration["Email:Username"] ?? "your-email@gmail.com";
                var smtpPass = _configuration["Email:Password"] ?? "your-app-password";

                using (var client = new SmtpClient(smtpHost, smtpPort))
                {
                    client.EnableSsl = true;
                    client.Credentials = new NetworkCredential(smtpUser, smtpPass);

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress(smtpUser, "PeerGrid"),
                        Subject = subject,
                        Body = body,
                        IsBodyHtml = false
                    };
                    mailMessage.To.Add(toEmail);

                    client.Send(mailMessage);
                }
            }
            catch (Exception ex)
            {
                // Log error
                Console.WriteLine($"Failed to send email: {ex.Message}");
            }
        }
    }
}
