using FluentValidation;
using FluentValidation.AspNetCore;
using SecondHandCarSellingAPI.Services;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using SecondHandCarSelling.Services;
using SecondHandCarSellingAPI.Data;     
using SecondHandCarSellingAPI.Validators;

var builder = WebApplication.CreateBuilder(args);

// 1. COMBINED CORS POLICY (Supports both Local Dev and Vercel Production)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins(
                    "http://localhost:5173", 
                    "http://localhost:5174",
                    "https://second-hand-car-selling.vercel.app/"
                   )
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});

builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddFluentValidationClientsideAdapters();

builder.Services.AddControllers();

// Register DbContext
// builder.Services.AddDbContext<CarSellingDbContext>(options =>
//     options.UseSqlServer(builder.Configuration.GetConnectionString("myconnecion")));

// PostgreSQL registration:
builder.Services.AddDbContext<CarSellingDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("myconnecion")));

// File service registration
builder.Services.AddScoped<IFileService, FileService>();

// Limit file upload size (15MB)
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 15 * 1024 * 1024; 
});

// Register TokenService
builder.Services.AddScoped<ITokenService, TokenService>();

// JWT Authentication Configuration
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var key = System.Text.Encoding.ASCII.GetBytes(jwtSettings["Key"]);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(key)
    };
});

// Add Swagger with JWT Support
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "SecondHandCarSelling API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

#region Validators
builder.Services.AddValidatorsFromAssemblyContaining<UserUpdateDTOValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<UserONLYCreateDTOValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<UpdateReviewDTOValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<CreateReviewDTOValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<PurchaseUpdateDTOValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<PurchaseCreateDTOValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<CarStatusCreateUpdateDTOValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<CarCreateUpdateDTOValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<UpdateCarImageDTOValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<CreateCarImageDTOValidator>();
builder.Services.AddValidatorsFromAssemblyContaining<CarBrandCreateUpdateDTOValidator>();
#endregion

var app = builder.Build();

// Enable static files for serving uploads
app.UseStaticFiles();

// 2. ACTIVATE THE PIPELINE CORRECTLY
app.UseCors("AllowFrontend");

// Keep Swagger visible in production for testing on Render if you like, 
// or keep it wrapped in IsDevelopment() as you had it.
app.UseSwagger();
app.UseSwaggerUI(c => {
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "SecondHandCarSelling API v1");
    c.RoutePrefix = string.Empty; // Makes Swagger load at the root URL of your Render service
});

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
