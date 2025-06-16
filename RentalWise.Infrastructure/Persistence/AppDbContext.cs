﻿using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
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
    public DbSet<PropertyMedia> PropertyMedia => Set<PropertyMedia>();
    public DbSet<Tenant> Tenants => Set<Tenant>();
    public DbSet<Lease> Leases => Set<Lease>();
    public DbSet<Landlord> LandLords => Set<Landlord>();
    public DbSet<Payment> Payments => Set<Payment>();
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Property - decimal configuration
        modelBuilder.Entity<Property>()
            .Property(p => p.RentAmount)
            .HasPrecision(18, 2); // 18 total digits, 2 after the decimal point

        modelBuilder.Entity<Lease>()
            .Property(l => l.RentAmount)
            .HasPrecision(18, 2); 

        modelBuilder.Entity<Payment>()
            .Property(p => p.Amount)
            .HasPrecision(18, 2); 

        // Add Fluent API configuration here if needed
        modelBuilder.Entity<Lease>()
            .HasOne(l => l.Property)
            .WithMany(p => p.Leases)
            .HasForeignKey(l => l.PropertyId)
            .OnDelete(DeleteBehavior.Restrict); //prevent deleting a Tenant or Property that has active leases

        modelBuilder.Entity<Lease>()
            .HasOne(l => l.Tenant)
            .WithMany(t => t.Leases)
            .HasForeignKey(l => l.TenantId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ApplicationUser>()
            .HasOne(u => u.Landlord)
            .WithOne(l => l.User)
            .HasForeignKey<Landlord>(l => l.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ApplicationUser>()
            .HasOne(u => u.Tenant)
            .WithOne(t => t.User)
            .HasForeignKey<Tenant>(t => t.UserId)
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

        modelBuilder.Entity<Payment>()
            .HasOne(p => p.Tenant)
            .WithMany(t => t.Payments)
            .HasForeignKey(p => p.TenantId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Payment>()
            .HasOne(p => p.Lease)
            .WithMany(l => l.Payments)
            .HasForeignKey(p => p.LeaseId)
            .OnDelete(DeleteBehavior.Cascade);



    }
}