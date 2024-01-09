using Hangfire.Annotations;
using Hangfire.Dashboard;

namespace MyAPI.Filter
{
    public class HangfireAuthorizationFilter : IDashboardAuthorizationFilter
    {
        public bool Authorize(DashboardContext context)
        {
            var httpContext = context.GetHttpContext();
            if (httpContext.Connection.LocalIpAddress.ToString() == httpContext.Connection.RemoteIpAddress.ToString())
                return true;
            else
                return false;
        }
    }
}
