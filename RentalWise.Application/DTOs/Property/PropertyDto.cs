using RentalWise.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RentalWise.Application.DTOs.Property;

public class PropertyDto
{
    public int Id { get; set; }
    public Guid UserId { get; set; }
    public string Name { get; set; } = null!;
    public string Address { get; set; } = null!;
    public SuburbDto Suburb { get; set; } = null!;
    
    public decimal RentAmount { get; set; }
    public DateTime CreatedAt { get; set; }
    public int Bedrooms { get; set; }
    public int Bathrooms { get; set; }
    public int ParkingSpaces { get; set; }

    public PropertyType PropertyType { get; set; }
    public PropertyFeatures Features { get; set; }

    public bool PetsAllowed { get; set; }
    public DateTime AvailableDate { get; set; }
    public List<PropertyMediaDto> Media { get; set; } = new();
}
