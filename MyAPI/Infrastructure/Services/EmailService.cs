using Core.Interfaces;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Core.Identity;

namespace Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly IOptions<SmtpSetting> _smtpSetting;

        public EmailService(IOptions<SmtpSetting> smtpSetting)
        {
            _smtpSetting = smtpSetting;
        }
        public async Task SendAsync(string to, string subject, string body)
        {
            var message = new MailMessage(_smtpSetting.Value.User,
               to,
               subject,
               body);
            message.IsBodyHtml = true;

            using (var emailClient = new SmtpClient(_smtpSetting.Value.Host, _smtpSetting.Value.Port))
            {
                emailClient.UseDefaultCredentials = false;
                emailClient.Credentials = new NetworkCredential(
                    _smtpSetting.Value.User,
                    _smtpSetting.Value.Password
                    );
                emailClient.EnableSsl = _smtpSetting.Value.EnableSsl;

                try
                {
                    await emailClient.SendMailAsync(message);
                }
                catch (Exception ex)
                {
                }
            }
        }
        
    }
}
