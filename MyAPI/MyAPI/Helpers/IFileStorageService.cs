namespace MyAPI.Helpers
{
    public interface IFileStorageService
    {
        Task<string> SaveFile(string containerName, IFormFile file);
        Task DeleteFile(string fileRoute, string containerName);
        Task<string> EditFile(string containerName, IFormFile file, string fileRoute);
    }
}
