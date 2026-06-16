using System.Net;
using System.Net.Mail;

namespace PanchayatApp.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string body);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            var smtpHost = _configuration["Smtp:Host"];
            var smtpPortString = _configuration["Smtp:Port"];
            var smtpUser = _configuration["Smtp:Username"];
            var smtpPass = _configuration["Smtp:Password"];

            // For local development, if SMTP is not configured, just log the OTP
            if (string.IsNullOrEmpty(smtpHost) || string.IsNullOrEmpty(smtpUser))
            {
                _logger.LogWarning("SMTP Configuration is missing. Logging email instead.");
                _logger.LogInformation($"--- MOCK EMAIL ---");
                _logger.LogInformation($"To: {toEmail}");
                _logger.LogInformation($"Subject: {subject}");
                _logger.LogInformation($"Body: {body}");
                _logger.LogInformation($"------------------");
                return;
            }

            int smtpPort = int.TryParse(smtpPortString, out int port) ? port : 587;

            using var client = new SmtpClient(smtpHost, smtpPort)
            {
                Credentials = new NetworkCredential(smtpUser, smtpPass),
                EnableSsl = true
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(smtpUser, "Panchayat App"),
                Subject = subject,
                Body = body,
                IsBodyHtml = true,
            };
            
            mailMessage.To.Add(toEmail);

            await client.SendMailAsync(mailMessage);
            _logger.LogInformation($"Email sent successfully to {toEmail}");
        }
    }
}
