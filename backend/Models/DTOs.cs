namespace PanchayatApp.Models
{
    public record RegisterRequest(string Username, string Password, string? ConfirmPassword, string Email, string PhoneNumber, string OtpCode);
    public record LoginRequest(string Username, string Password);
    public record SendOtpRequest(string Email);
}
