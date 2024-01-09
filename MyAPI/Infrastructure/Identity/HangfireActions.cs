using Core.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Identity
{
    public class HangfireActions : IHangfireActions
    {
        private readonly AppIdentityDbContext _context;
        public HangfireActions(AppIdentityDbContext context)
        {
            _context = context;
        }
        public async Task CleanTokens()
        {
            var toRemove = _context.RefreshToken.Where(u => u.Expires < DateTime.Now.AddDays(-1) || u.Revoked < DateTime.Now.AddDays(-1)).ToList();

            _context.RefreshToken.RemoveRange(toRemove);

            await _context.SaveChangesAsync();
        }
    }
}
