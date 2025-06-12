using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RentalWise.Domain.Entities;

public class Landlord
{
    [Key]
    public int Id { get; set; }

    // Foreign Key to Identity User
    [Required]
    public Guid UserId { get; set; }

    [ForeignKey("UserId")]
    public ApplicationUser User { get; set; } = null!;

    [Required]
    public string FullName { get; set; } = null!;
    public string? Gender { get; set; }
    public string? ContactNumber { get; set; }
    public string? Address { get; set; }
    public string? Suburb { get; set; }
    public string? City { get; set; }
    public int? PostCode { get; set; }

    
    
}
