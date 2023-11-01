using Core.Entities.OrderAggregate;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Specifications
{
    public class OrderPaymentIntentIdSpecification : BaseSpecification<Order>
    {
        public OrderPaymentIntentIdSpecification(string paymentIntentId) : base(o => o.PaymentIntentId == paymentIntentId) {}
    }
}
