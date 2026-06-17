namespace PanchayatApp.Models
{
    public record RegisterRequest(string Username, string Password, string? ConfirmPassword, string Email, string PhoneNumber);
    public record LoginRequest(string Username, string Password);
}
