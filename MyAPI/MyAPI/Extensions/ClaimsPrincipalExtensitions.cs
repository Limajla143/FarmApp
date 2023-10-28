using System.Security.Claims;

namespace MyAPI.Extensions
{
    public static class ClaimsPrincipalExtensitions
    {
        public static string RetrieveNameFromPrincipal(this ClaimsPrincipal user)
        {
            return user.FindFirstValue(ClaimTypes.Name);
        }
    }
}
