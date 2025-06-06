using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RentalWise.Domain.Entities;

public class ApplicationUser : IdentityUser<Guid>
{
    // Common Fields
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
   
    public string FullName { get; set; } = string.Empty;

    //Tenant-Specific
    public string? NationalId { get; set; }
    public ICollection<Lease>? Leases { get; set; }

    //Landlord-Specific
    public string? BusinessName { get; set; }
    public string? LicenseNumber { get; set; }

    // A landlord can own many properties
    public ICollection<Property>? OwnedProperties { get; set; }
}
