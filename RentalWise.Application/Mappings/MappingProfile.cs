using AutoMapper;
using RentalWise.Application.DTOs;
using RentalWise.Domain.Entities;

namespace RentalWise.Application.Mappings
{

    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Property, PropertyDto>();
            CreateMap<CreatePropertyDto, Property>();
            CreateMap<UpdatePropertyDto, Property>();
        }
    }
}
