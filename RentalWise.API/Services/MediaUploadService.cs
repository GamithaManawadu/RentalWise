using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using RentalWise.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace RentalWise.Application.Services;

public class MediaUploadService : IMediaUploadService
{
    private readonly CloudinaryDotNet.Cloudinary _cloudinary;

    public MediaUploadService(CloudinaryDotNet.Cloudinary cloudinary)
    {
        _cloudinary = cloudinary;
    }

    public async Task<List<PropertyMedia>> UploadPropertyMediaAsync(List<IFormFile> images, IFormFile? video)
    {
        var uploaded = new List<PropertyMedia>();

        foreach (var image in images.Take(20))
        {
            using var stream = image.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(image.FileName, stream),
                Folder = "RentalWise/Properties/Images"
            };
            var result = await _cloudinary.UploadAsync(uploadParams);
            if (result.StatusCode == System.Net.HttpStatusCode.OK)
            {
                uploaded.Add(new PropertyMedia
                {
                    Url = result.SecureUrl.ToString(),
                    PublicId = result.PublicId,
                    MediaType = "image"
                });
            }
        }

        if (video != null)
        {
            using var stream = video.OpenReadStream();
            var uploadParams = new VideoUploadParams
            {
                File = new FileDescription(video.FileName, stream),
                Folder = "RentalWise/Properties/Videos"
            };
            var result = await _cloudinary.UploadAsync(uploadParams);
            if (result.StatusCode == System.Net.HttpStatusCode.OK)
            {
                uploaded.Add(new PropertyMedia
                {
                    Url = result.SecureUrl.ToString(),
                    PublicId = result.PublicId,
                    MediaType = "video"
                });
            }
        }

        return uploaded;
    }
}
