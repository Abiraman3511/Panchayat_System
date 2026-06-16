using PanchayatApp;
using PanchayatApp.Data;

var builder = WebApplication.CreateBuilder(args);

// Bind strictly to http://127.0.0.1:8000 to match frontend
builder.WebHost.UseUrls("http://127.0.0.1:8000");

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
