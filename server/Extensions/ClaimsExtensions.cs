using System.Security.Claims;

namespace server.Extensions
{
    public static class ClaimsExtensions
    {
        public static string GetUserId(this ClaimsPrincipal user)
        {
            return user.FindFirstValue(ClaimTypes.NameIdentifier)!;
        }
    }
}