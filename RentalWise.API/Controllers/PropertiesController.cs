using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentalWise.Application.DTOs;
using RentalWise.Domain.Entities;
using RentalWise.Infrastructure.Persistence;
using System.Security.Claims;
using RentalWise.Application.Mappings;
namespace RentalWise.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PropertiesController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public PropertiesController(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    // GET: api/properties
    [HttpGet]
    [Authorize]
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

    // GET: api/properties/5
    [HttpGet("{id}")]
    [Authorize]
    public async Task<ActionResult<PropertyDto>> GetById(int id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return Unauthorized();

        var property = await _context.Properties.FindAsync(id);
        if (property == null)
            return NotFound();

        if (property.UserId != userId)
            return Forbid(); // 403 Forbidden

        var result = _mapper.Map<PropertyDto>(property);


        return Ok(result);
    }

    // POST: api/properties
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create(CreatePropertyDto model)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return Unauthorized();

        // Map from DTO to Entity
        var property = _mapper.Map<Property>(model);
        property.UserId = userId; // assign manually

        _context.Properties.Add(property);
        await _context.SaveChangesAsync();

        // Map from Entity to DTO
        var result = _mapper.Map<PropertyDto>(property);

        return CreatedAtAction(nameof(GetById), new { id = property.Id }, result);
    }

    // PUT: api/properties/5
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Update(int id, UpdatePropertyDto model)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return Unauthorized();

        var property = await _context.Properties.FindAsync(id);
        if (property == null)
            return NotFound();

        if (property.UserId != userId)
            return Forbid();

        _mapper.Map(model, property);// AutoMapper does the field mapping

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/properties/5
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
            return Unauthorized();

        var property = await _context.Properties.FindAsync(id);
        if (property == null)
            return NotFound();

        // Check if the property belongs to the current user
        if (property.UserId != userId)
            return Forbid(); // or return StatusCode(403);

        _context.Properties.Remove(property);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}