using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RentalWise.Domain.Entities;

public class Property
{
    public int Id { get; set; }
     
    public string Name { get; set; } = null!;
    public string Address { get; set; } = null!;
    public decimal RentAmount { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public string UserId { get; set; } = null!; // FK to AspNetUsers

    public ICollection<Lease> Leases { get; set; } = new List<Lease>();
}
