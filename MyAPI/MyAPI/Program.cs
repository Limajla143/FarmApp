using Core;
using Infrastructure;
using Infrastructure.Data;
using Infrastructure.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using MyAPI.Extensions;
using MyAPI.Middleware;
using MyAPI.Filter;
using Hangfire.Dashboard;
using Hangfire;
using Core.Interfaces;

var builder = WebApplication.CreateBuilder(args);


// Add services to the container.

builder.Services.AddControllers(opt =>
{
    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    opt.Filters.Add(new AuthorizeFilter(policy));
});

builder.Services.AddIdentityServices(builder.Configuration);
builder.Services.AddApplicationServices(builder.Configuration);

builder.Services.AddControllersWithViews(options =>
{
    options.Filters.Add<ActionFilter>();
});


builder.Logging.AddLog4Net();

builder.Services.AddSwaggerDocumentation();

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

//app.UseStatusCodePagesWithReExecute("/errors/{0}", "?statusCode={0}");

app.UseSwaggerDocumentation();

app.UseCors("CorsPolicy");

app.UseAuthentication();
app.UseAuthorization();

//app.UseHttpsRedirection();

app.UseHangfireDashboard($"/{builder.Configuration["HangfireSettings:HangfireDashboardControllerName"]}"
    , new DashboardOptions
    {
        Authorization = new[] { new HangfireAuthorizationFilter() },
        IsReadOnlyFunc = (DashboardContext context) => false,
        DashboardTitle = "MyFarm Hangfire",
});

app.UseDefaultFiles();
app.UseStaticFiles();
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "Content")),
    RequestPath = "/Content"
});

app.MapControllers();

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
var entityContext = services.GetRequiredService<EntityDbContext>();
var identityContext = services.GetRequiredService<AppIdentityDbContext>();
var userManager = services.GetRequiredService<UserManager<AppUser>>();
var roleManager = services.GetRequiredService<RoleManager<AppRole>>();
var logger = services.GetRequiredService<ILogger<Program>>();


try
{
    await entityContext.Database.MigrateAsync();
    await identityContext.Database.MigrateAsync();
    await StoreContextSeed.SeedAsync(entityContext);
    await SeedUser.SeedUsersAsync(userManager, roleManager);
}
catch (Exception ex)
{
    logger.LogError(ex, "An error occured during migration.");
}

RecurringJob.AddOrUpdate<IHangfireActions>("Clean Unused Token", x => x.CleanTokens(), builder.Configuration["HangfireSettings:JobRunCleanUnusedTokens"]);

app.Run();
