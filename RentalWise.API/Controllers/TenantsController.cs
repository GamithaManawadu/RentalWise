using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using RentalWise.Application.DTOs.Tenant;
using RentalWise.Domain.Entities;
using RentalWise.Infrastructure.Persistence;
using System.Security.Claims;

namespace RentalWise.API.Controllers;

public class TenantsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;

    public TenantsController(AppDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTenantDto model)
    {
        if (model == null) return BadRequest();

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var tenant = _mapper.Map<Tenant>(model);
        tenant.UserId = userId;

        _context.Tenants.Add(tenant);
        await _context.SaveChangesAsync();

        var dto = _mapper.Map<TenantDto>(tenant);
        return CreatedAtAction(nameof(GetById), new { id = tenant.Id }, dto);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TenantDto>> GetById(int id)
    {
        var tenant = await _context.Tenants.FindAsync(id);
        if (tenant == null) return NotFound();

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (tenant.UserId != userId) return Forbid();

        return Ok(_mapper.Map<TenantDto>(tenant));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateTenantDto model)
    {
        if (model == null) return BadRequest();

        var tenant = await _context.Tenants.FindAsync(id);
        if (tenant == null) return NotFound();

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (tenant.UserId != userId) return Forbid();

        _mapper.Map(model, tenant);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var tenant = await _context.Tenants.FindAsync(id);
        if (tenant == null) return NotFound();

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (tenant.UserId != userId) return Forbid();

        _context.Tenants.Remove(tenant);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
