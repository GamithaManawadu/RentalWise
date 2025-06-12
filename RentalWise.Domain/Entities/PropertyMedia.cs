using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RentalWise.Domain.Entities;

public class PropertyMedia
{
    public int Id { get; set; }
    public string Url { get; set; } = string.Empty;
    public string PublicId { get; set; } = string.Empty;
    public string MediaType { get; set; } = "image"; // "image" or "video"
    public int PropertyId { get; set; }
    public Property Property { get; set; } = null!;
}
