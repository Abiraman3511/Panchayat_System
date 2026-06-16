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
