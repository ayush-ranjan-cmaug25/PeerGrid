using Microsoft.AspNetCore.Mvc;
using Razorpay.Api;
using PeerGrid.Backend.Data;
using PeerGrid.Backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using System.Text;

namespace PeerGrid.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;

        public PaymentsController(IConfiguration configuration, ApplicationDbContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("create-order")]
        [Authorize]
        public IActionResult CreateOrder([FromBody] PaymentRequest request)
        {
            try
            {
                string key = _configuration["Razorpay:KeyId"];
                string secret = _configuration["Razorpay:KeySecret"];

                if (string.IsNullOrEmpty(key) || key.Contains("YOUR_KEY"))
                {
                    return BadRequest("Razorpay keys are not configured in backend.");
                }

                RazorpayClient client = new RazorpayClient(key, secret);

                Dictionary<string, object> options = new Dictionary<string, object>();
                options.Add("amount", request.Amount * 100); // Amount in paise
                options.Add("receipt", Guid.NewGuid().ToString());
                options.Add("currency", "INR");
                options.Add("payment_capture", 1); // Auto capture

                Order order = client.Order.Create(options);
                string orderId = order["id"].ToString();

                return Ok(new { orderId = orderId, keyId = key });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error creating order: {ex.Message}");
            }
        }

        [HttpPost("verify-payment")]
        [Authorize]
        public async Task<IActionResult> VerifyPayment([FromBody] PaymentVerificationRequest request)
        {
            try
            {
                string key = _configuration["Razorpay:KeyId"];
                string secret = _configuration["Razorpay:KeySecret"];

                // Verify Signature
                // Verify Signature Manually
                string payload = $"{request.OrderId}|{request.PaymentId}";
                string generatedSignature;
                using (var hmac = new System.Security.Cryptography.HMACSHA256(Encoding.UTF8.GetBytes(secret)))
                {
                    var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(payload));
                    generatedSignature = BitConverter.ToString(hash).Replace("-", "").ToLower();
                }

                if (generatedSignature == request.Signature)
                {
                    // Signature matches
                }
                else
                {
                    return BadRequest("Invalid payment signature");
                }

                // Note: The SDK's VerifyPaymentSignature method signature might vary slightly depending on version,
                // simpler manual verification:
                // HMACSHA256(order_id + "|" + payment_id, secret) == signature

                // For this demo, we will trust the client if signature matches (or just proceed for testing if signature check fails but we want to allow it - NO, security first).
                // Actually, let's just implement the logic to add points.
                
                var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdStr))
                {
                    return Unauthorized("User ID not found in token");
                }
                var userId = int.Parse(userIdStr);
                var user = await _context.Users.FindAsync(userId);

                if (user != null)
                {
                    // Add Grid Points (assuming 1 INR = 10 GP for example)
                    decimal pointsToAdd = request.Amount * 10; 
                    user.GridPoints += pointsToAdd; 
                    await _context.SaveChangesAsync();
                    return Ok(new { message = "Payment successful", newBalance = user.GridPoints, pointsAdded = pointsToAdd });
                }

                return BadRequest("User not found");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error verifying payment: {ex.Message}");
            }
        }
    }

    public class PaymentRequest
    {
        public decimal Amount { get; set; }
    }

    public class PaymentVerificationRequest
    {
        public string OrderId { get; set; }
        public string PaymentId { get; set; }
        public string Signature { get; set; }
        public decimal Amount { get; set; }
    }
}
