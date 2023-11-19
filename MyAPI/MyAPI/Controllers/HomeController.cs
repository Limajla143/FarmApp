using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace MyAPI.Controllers
{
    public class HomeController : BaseApiController
    {
        private readonly IConfiguration _config;
        public HomeController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet("GetHomeImages")]
        public async Task<IList<string>> GetImages()
        {
            IList<string> images = new List<string>();
            var imageExtensions = new[] { ".jpg", ".png", ".gif" };
            var imagesDirectory = Path.Combine(Directory.GetCurrentDirectory(), "Content\\statics");
            var files = await Task.Run(() => Directory.GetFiles(imagesDirectory, "*.*", SearchOption.AllDirectories));

            // Filter image files
            var imageFiles = files
                .Where(s => imageExtensions.Any(ext => s.EndsWith(ext, StringComparison.OrdinalIgnoreCase)))
                .Select(filePath => new
                {
                    FileName = Path.GetFileName(filePath)
                })
                .ToList();

            foreach (var imageFile in imageFiles)
            {
                images.Add(_config["ApiUrlStaticImages"] + "/statics/" + imageFile.FileName);
            }

            return images;
        }
    }
}
