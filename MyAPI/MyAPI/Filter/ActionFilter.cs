using Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using MyAPI.Logger;
using Newtonsoft.Json.Linq;
using System.Diagnostics;
using System.Text;

namespace MyAPI.Filter
{
    public class ActionFilter : IActionFilter, IAsyncActionFilter
    {
        private static ISysLog _logger = null;
        public void OnActionExecuted(ActionExecutedContext context)
        {
            string controllerName = (string)context.RouteData.Values["Controller"];
            string actionName = (string)context.RouteData.Values["Action"];
            _logger = SysLog.GetLogger(controllerName);

            // capture page rendered time - START
            ControllerBase controller = context.Controller as ControllerBase;

            if (controller != null)
            {
                var timer = controller.HttpContext.Items["_ActionTimer"] as Stopwatch;

                if (timer != null)
                {
                    var elapsedTime = timer.Elapsed;

                    var perfLog = string.Format("[ControllerName:{0}, ActionName:{1}]", controllerName, actionName);
                    _logger.Performance(perfLog, Math.Round(elapsedTime.TotalMilliseconds));
                }
            }
        }

        public async Task<string> InvokeAsync(HttpContext httpContext)
        {
            httpContext.Request.EnableBuffering();
            string body = string.Empty;

            // Leave the body open so the next middleware can read it.
            using (var reader = new StreamReader(
                httpContext.Request.Body,
                encoding: Encoding.UTF8,
                detectEncodingFromByteOrderMarks: false,
                bufferSize: 1024,
                leaveOpen: true))
            {
                body = await reader.ReadToEndAsync();
                // Do some processing with body…
                // Reset the request body stream position so the next middleware can read it
                httpContext.Request.Body.Position = 0;
            }

            return body;
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            var a = InvokeAsync(context.HttpContext);

            // capture page rendered time - START
            ControllerBase controller = context.Controller as ControllerBase;

            if (controller != null)
            {
                var timer = new Stopwatch();

                controller.HttpContext.Items["_Parameters"] = "Parameters Placeholder"; // Adjust as needed
                controller.HttpContext.Items["_ActionTimer"] = timer;
                timer.Start();
            }
            // capture page rendered time - END
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            this.OnActionExecuting(context);
            var resultContext = await next();
            this.OnActionExecuted(resultContext);
        }
    }
}
