using Microsoft.EntityFrameworkCore;
using PanchayatApp.Data;
using PanchayatApp.Services;

namespace PanchayatApp
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            // Add CORS
            services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    policy.SetIsOriginAllowed(origin => true) // Allow any origin (Vercel, Localhost, etc)
                          .AllowAnyMethod()
                          .AllowAnyHeader()
                          .AllowCredentials();
                });
            });

            // Configure EF Core (PostgreSQL for Prod, SQLite for Local)
            var pgConnection = Configuration.GetConnectionString("PostgreSQLConnection");
            
            // Render provides URL-style connection strings (postgres://user:pass@host/db), Npgsql needs ADO.NET format
            if (!string.IsNullOrEmpty(pgConnection) && pgConnection.StartsWith("postgres"))
            {
                var uri = new Uri(pgConnection);
                var userInfo = uri.UserInfo.Split(':');
                pgConnection = $"Host={uri.Host};Port={(uri.Port > 0 ? uri.Port : 5432)};Database={uri.LocalPath.TrimStart('/')};Username={userInfo[0]};Password={userInfo[1]};Ssl Mode=Require;Trust Server Certificate=true;";
            }

            services.AddDbContext<AppDbContext>(options =>
            {
                if (!string.IsNullOrEmpty(pgConnection))
                {
                    options.UseNpgsql(pgConnection);
                }
                else
                {
                    options.UseSqlite(Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=PanchayatSystem.db");
                }
            });

            // Add Memory Cache
            services.AddMemoryCache();

            // Add Services
            services.AddScoped<IEmailService, EmailService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IVillageOfficialService, VillageOfficialService>();
            services.AddScoped<IVillageEmployeeService, VillageEmployeeService>();
            services.AddScoped<IGovernmentOfficialService, GovernmentOfficialService>();
            services.AddScoped<IPeopleDirectoryService, PeopleDirectoryService>();
            services.AddScoped<IDashboardService, DashboardService>();

            // Add Controllers
            services.AddControllers();
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();
            app.UseCors("AllowFrontend");
            app.UseStaticFiles();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
