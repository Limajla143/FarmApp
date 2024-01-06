using Core.Interfaces;
using MyAPI.Middleware.Errors;
using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace MyAPI.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        //private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;
        private static ISysLog _logger;

        public ExceptionMiddleware(RequestDelegate next, IHostEnvironment env, ISysLog logger) //ILogger<ExceptionMiddleware> logger,
        {
            _env = env;
            _logger = logger;
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.Exception(ex.Message, ex);
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;


                var response = _env.IsDevelopment()
                    ? new ApiException((int)HttpStatusCode.InternalServerError, ex.Message, ex.StackTrace.ToString())
                    : new ApiException((int)HttpStatusCode.InternalServerError);

                var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase};

                var json = JsonSerializer.Serialize(response, options);

                await context.Response.WriteAsync(json);
            }
        }
    }
}
