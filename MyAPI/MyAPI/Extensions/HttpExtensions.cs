using MyAPI.Helpers;
using System.Text.Json;

namespace MyAPI.Extensions
{
    public static class HttpExtensions
    {
        public static void AddPaginationHeader(this HttpResponse response, Metadata metaData)
        {
            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

            response.Headers.Add("Pagination", JsonSerializer.Serialize(metaData, options));
           // response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }
    }
}
