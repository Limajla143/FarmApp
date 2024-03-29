﻿using Core.Entities.OrderAggregate;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Core.Specifications
{
    public class OrdersWithItemsSpecification : BaseSpecification<Order>
    {
        public OrdersWithItemsSpecification(OrderParams orderParams) : base(BuildCriteria(orderParams))
        {

            AddInclude(o => o.OrderItems);
            AddInclude(o => o.DeliveryMethod);
            AddOrderByDescending(o => o.OrderDate);
        }

        public OrdersWithItemsSpecification(int id, string user)
            : base(x => x.Id == id && x.Buyer == user)
        {
            AddInclude(o => o.OrderItems);
            AddInclude(o => o.DeliveryMethod);
        }

        private static Expression<Func<Order, bool>> BuildCriteria(OrderParams orderParams)
        {
            if (orderParams.DateFrom != null && orderParams.DateTo != null)
            {
                return o =>
                    o.Buyer == orderParams.username &&
                    o.IsDelete != true && (o.OrderDate >= orderParams.DateFrom &&
                    o.OrderDate <= orderParams.DateTo);
            }

            // If DateFrom or DateTo is null, return the base criteria without date range
            return o => o.Buyer == orderParams.username && o.IsDelete != true;
        }
    }
}
