using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentalWise.Domain.Entities;
using RentalWise.Infrastructure.Persistence;
using System.Security.Claims;
using RentalWise.Application.Mappings;
using RentalWise.Application.DTOs.Property;
namespace RentalWise.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Landlord")]
public class PropertiesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public PropertiesController(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    
    [HttpGet]
    [Authorize(Roles = "Landlord")]
    public async Task<ActionResult<IEnumerable<PropertyDto>>> GetAll(int pageNumber = 1, int pageSize = 10) //pagination 10 per page
    {
        var properties = await _context.Properties
       .Skip((pageNumber - 1) * pageSize)
       .Take(pageSize)
       .Select(p => new PropertyDto
       {
            Id = p.Id,
            Name = p.Name,
            Address = p.Address,
            RentAmount = p.RentAmount
        })
        .ToListAsync();
        var result = _mapper.Map<List<PropertyDto>>(properties);

        return Ok(properties);
    }

    
   /* [HttpGet("my")]
    [Authorize(Roles = "Landlord")]
    public async Task<ActionResult<IEnumerable<PropertyDto>>> GetMyProperty(int pageNumber = 1, int pageSize = 10)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdString, out var userId))
            return Unauthorized("Invalid user ID.");

        var property = await _context.Properties.FirstOrDefaultAsync(p => p.UserId == userId);
        if (property == null)
            return NotFound();

        if (property.UserId != userId)
            return Forbid(); // 403 Forbidden

        var result = _mapper.Map<PropertyDto>(property);


        return Ok(result);
    }*/

    [HttpGet("my")]
    [Authorize(Roles = "Landlord")]
    public async Task<ActionResult<IEnumerable<PropertyDto>>> GetMyProperties(int pageNumber = 1, int pageSize = 10)
    {
        var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(userIdString, out var userId))
            return Unauthorized("Invalid user ID.");

        var query = _context.Properties
            .Where(p => p.UserId == userId) //  Guid FK
            .OrderByDescending(p => p.CreatedAt); // Optional ordering

        var totalCount = await query.CountAsync();
        var properties = await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var result = _mapper.Map<List<PropertyDto>>(properties);

        // Optional: include pagination metadata
        return Ok(new
        {
            TotalCount = totalCount,
            PageNumber = pageNumber,
            PageSize = pageSize,
            Items = result
        });
    }

    // POST: api/properties
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create(CreatePropertyDto model)
    {
        if (model == null)
        {
            return BadRequest("Property data is required.");
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId))
            return Unauthorized("Invalid user ID.");

        // Map from DTO to Entity
        var property = _mapper.Map<Property>(model);
        property.UserId = userId; // assign manually

        if (model.RentAmount < 0)
        {
            ModelState.AddModelError("RentAmount", "Rent amount cannot be negative.");
            return BadRequest(ModelState);
        }

        _context.Properties.Add(property);
        await _context.SaveChangesAsync();

        // Map from Entity to DTO
        var result = _mapper.Map<PropertyDto>(property);

        return CreatedAtAction(nameof(GetMyProperties), new { id = property.Id }, result);
    }

    // PUT: api/properties/5
    [HttpPut("{id}")]
    [Authorize(Roles = "Landlord")]
    public async Task<IActionResult> Update(int id, UpdatePropertyDto model)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId))
            return Unauthorized("Invalid user ID.");
        

        if (model == null)
        {
            return BadRequest();
        }

        var property = await _context.Properties
         .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);

        if (property == null)
            return NotFound("Property not found or not owned by user.");

        
        _mapper.Map(model, property);// AutoMapper does the field mapping

        if (model.RentAmount < 0)
        {
            ModelState.AddModelError("RentAmount", "Rent amount cannot be negative.");
            return BadRequest(ModelState);
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/properties/5
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId))
            return Unauthorized("Invalid user ID.");

        var property = await _context.Properties.FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId);
        if (property == null)
            return NotFound("Property not found or not owned by user.");

        _context.Properties.Remove(property);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}