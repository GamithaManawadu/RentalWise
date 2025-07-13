﻿using RentalWise.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RentalWise.Application.DTOs.Property;

public class PropertySearchDto
{
    public string? Keyword { get; set; }
    public int? RegionId { get; set; }
    public int? DistrictId { get; set; }
    public List<int>? SuburbIds { get; set; }

    public int? Bedrooms { get; set; }
    public int? Bathrooms { get; set; }
    public int? ParkingSpaces { get; set; }

    public int? MinRent { get; set; }
    public int? MaxRent { get; set; }

    public DateTime? MoveInDate { get; set; }

    public List<int>? PropertyTypes { get; set; }
    public bool? PetsAllowed { get; set; }
    public int? PropertyFeatures { get; set; }

    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
