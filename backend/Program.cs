using PanchayatApp;
using PanchayatApp.Data;

var builder = WebApplication.CreateBuilder(args);

// Allow Render to dynamically assign the port
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// Initialize Startup and Configure Services
var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "people");
if (!Directory.Exists(uploadsPath))
{
    Directory.CreateDirectory(uploadsPath);
}

var startup = new Startup(builder.Configuration);
startup.ConfigureServices(builder.Services);

var app = builder.Build();

// Ensure the SQLite database exists and seed data
using (var scope = app.Services.CreateScope())
{
    var appDb = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    DbInitializer.Initialize(appDb);
}

// Configure HTTP pipeline via Startup
startup.Configure(app, app.Environment);

app.Run();
