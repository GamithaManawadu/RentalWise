using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentalWise.Application.DTOs.Landlord;
using RentalWise.Domain.Entities;
using RentalWise.Infrastructure.Persistence;
using System.Security.Claims;

namespace RentalWise.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Landlord")]
public class LandlordController: ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public LandlordController(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpPost]
    [Authorize(Roles = "Landlord")]
    public async Task<IActionResult> AddProfile([FromBody] CreateLandlordDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId))
            return Unauthorized("Invalid user ID.");

        // Check if profile already exists
        var existingProfile = await _context.LandLord.FirstOrDefaultAsync(l => l.UserId == userId);
        if (existingProfile != null)
            return Conflict("Profile already exists for this user.");

        var profile = _mapper.Map<Landlord>(dto);
        profile.UserId = userId;

        _context.LandLord.Add(profile);
        await _context.SaveChangesAsync();

        var resultDto = _mapper.Map<LandlordDto>(profile);
        return CreatedAtAction(nameof(GetMyProfile), new { id = profile.Id }, resultDto);

            }

    [HttpGet]
    [Authorize(Roles = "Landlord")]
    public async Task<IActionResult> GetMyProfile()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId))
            return Unauthorized("Invalid user ID.");

        var profile = await _context.LandLord
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.UserId == userId);

        if (profile == null)
            return NotFound();

        var responseDto = _mapper.Map<LandlordDto>(profile);
        return Ok(responseDto);
    }

    // Update landlord profile
    [HttpPut]
    [Authorize(Roles = "Landlord")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateLandlordDto dto)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId))
            return Unauthorized("Invalid user ID.");

        var profile = await _context.LandLord.FirstOrDefaultAsync(p => p.UserId == userId);
        if (profile == null)
            return NotFound();

        // Map updated fields from DTO to entity
        _mapper.Map(dto, profile);

        _context.LandLord.Update(profile);
        await _context.SaveChangesAsync();

        var updatedDto = _mapper.Map<LandlordDto>(profile);
        return Ok(updatedDto);
    }
}
