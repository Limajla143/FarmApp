using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace MyAPI.Controllers
{
    [AllowAnonymous]
    public class HomeController : BaseApiController
    {
        private readonly IConfig _config;
        public HomeController(IConfig config)
        {
            _config = config;
        }

        [HttpGet]
        public IActionResult Index()
        {
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(),
                "wwwroot", "index.html"), "text/HTML");
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
                images.Add($"{_config.ApiUrlStaticImages}/{imageFile.FileName}");
            }

            return images;
        }
    }
}
