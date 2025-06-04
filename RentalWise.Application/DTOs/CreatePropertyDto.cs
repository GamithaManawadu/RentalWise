using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RentalWise.Application.DTOs;

public class CreatePropertyDto
{
    public string Name { get; set; } = null!;
    public string Address { get; set; } = null!;
    public decimal RentAmount { get; set; }
}
