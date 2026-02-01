using Microsoft.EntityFrameworkCore;
using PeerGrid.Backend.Data;
using PeerGrid.Backend.Services;
using PeerGrid.Backend.Hubs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// SQL Server Configuration
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

// JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? "THIS_IS_A_FALLBACK_KEY_MUST_BE_LONG_ENOUGH_FOR_HS256_ALGORITHM";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "PeerGrid",
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? "PeerGridUsers",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

// Register Services
builder.Services.AddScoped<SessionService>();
builder.Services.AddScoped<MatchingService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddSignalR();
builder.Services.AddHostedService<ShutdownService>();
builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder => builder
            .SetIsOriginAllowed(origin => true) // Allow any origin for development
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

var app = builder.Build();


app.UseCors("AllowReactApp");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<ChatHub>("/chatHub");

// Ensure DB is created
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    DbInitializer.Initialize(db);
}

app.Run();
