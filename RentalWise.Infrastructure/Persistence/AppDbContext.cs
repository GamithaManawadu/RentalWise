using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RentalWise.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RentalWise.Infrastructure.Persistence;

public class AppDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, Guid>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Property> Properties => Set<Property>();
    public DbSet<Tenant> Tenants => Set<Tenant>();
    public DbSet<Lease> Leases => Set<Lease>();
    public DbSet<AppUser> LandLord => Set<AppUser>();
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Property - decimal configuration
        modelBuilder.Entity<Property>()
            .Property(p => p.RentAmount)
            .HasPrecision(18, 2); // 18 total digits, 2 after the decimal point

        // Add Fluent API configuration here if needed
        modelBuilder.Entity<Lease>()
            .HasOne(l => l.Property)
            .WithMany(p => p.Leases)
            .HasForeignKey(l => l.PropertyId);

        modelBuilder.Entity<Lease>()
            .HasOne(l => l.Tenant)
            .WithMany(t => t.Leases)
            .HasForeignKey(l => l.TenantId);
    }
}