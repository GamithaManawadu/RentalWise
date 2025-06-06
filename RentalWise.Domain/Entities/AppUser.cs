using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RentalWise.Domain.Entities;

public class AppUser
{
    public Guid Id { get; set; } = Guid.NewGuid();  // Primary key
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string PasswordHash { get; set; } = null!;

    // Optional: Audit columns
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
