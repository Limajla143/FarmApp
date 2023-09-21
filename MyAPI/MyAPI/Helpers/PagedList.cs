using Microsoft.EntityFrameworkCore;

namespace MyAPI.Helpers
{
    public class PagedList<T> : List<T>
    {
        public PagedList(List<T> items, int count, int pageNumber, int pageSize)
        {
            MetaData = new Metadata
            {
                Count = count,
                PageSize = pageSize,
                PageNumber = pageNumber,
                TotalPages = (int)Math.Ceiling(count / (double)pageSize)
            };
            AddRange(items);
        }

        public Metadata MetaData { get; set; }

        public static PagedList<T> ToPagedList(IReadOnlyList<T> query, int pageNumber, int pageSize, int totalCount)
        {
            var items = query.Skip((pageNumber - 1) * pageSize).Take(pageSize).AsQueryable();

            return new PagedList<T>(items.ToList(), totalCount, pageNumber, pageSize);
        }
    }
}
