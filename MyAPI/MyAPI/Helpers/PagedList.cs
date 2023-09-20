namespace MyAPI.Helpers
{
    public class PagedList<T> where T : class
    {
        public PagedList(IReadOnlyList<T> items, int count, int pageNumber, int pageSize)
        {
            PageNumber = pageNumber;
            PageSize = pageSize;
            Count = count;
            Items = items;
        }

        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int Count { get; set; }
        public IReadOnlyList<T> Items{ get; set; }
    }
}
