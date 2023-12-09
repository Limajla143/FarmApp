using Core.Identity;
using Core.Interfaces;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Twilio;
using Twilio.Exceptions;
using Twilio.Rest.Api.V2010.Account;

namespace Infrastructure.Services
{
    public class SmsSenderService : ISmsSenderService
    {
        private readonly TwilioSettings _twilioSettings;
        public SmsSenderService(IOptions<TwilioSettings> twilioSettins)
        {
            _twilioSettings = twilioSettins.Value;
        }
        public async Task SendSmsAsync(string number, string message)
        {
            TwilioClient.Init(_twilioSettings.AccountSId, _twilioSettings.AuthToken);

            try
            {
                await MessageResource.CreateAsync(
                to: number,
                from: _twilioSettings.FromPhoneNumber,
                body: message
                );
            }
            catch (ApiException e)
            {
                if (e.Code == 21614)
                {
                    Console.WriteLine("Uh oh, looks like this caller can't receive SMS messages.");
                }
            }
            
        }
    }
}
