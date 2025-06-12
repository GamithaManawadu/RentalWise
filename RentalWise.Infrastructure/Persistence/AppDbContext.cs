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

    public DbSet<Region> Regions => Set<Region>();
    public DbSet<District> Districts => Set<District>();
    public DbSet<Suburb> Suburbs => Set<Suburb>();
    public DbSet<Property> Properties => Set<Property>();
    public DbSet<Tenant> Tenants => Set<Tenant>();
    public DbSet<Lease> Leases => Set<Lease>();
    public DbSet<Landlord> LandLord => Set<Landlord>();
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

        // Landlord relationship
        modelBuilder.Entity<Landlord>()
            .HasOne(l => l.User)
            .WithMany() // Use .WithOne() if you plan to add: public Landlord Landlord { get; set; } in ApplicationUser
            .HasForeignKey(l => l.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<District>()
            .HasOne(d => d.Region)
            .WithMany(r => r.Districts)
            .HasForeignKey(d => d.RegionId);

        modelBuilder.Entity<Suburb>()
            .HasOne(s => s.District)
            .WithMany(d => d.Suburbs)
            .HasForeignKey(s => s.DistrictId);

        modelBuilder.Entity<Property>()
            .HasOne(p => p.Suburb)
            .WithMany()
            .HasForeignKey(p => p.SuburbId);
    }
}