using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using RentalWise.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
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

    public async Task<List<PropertyMedia>> UploadPropertyMediaAsync(List<IFormFile> images, IFormFile? video, int existingImageCount,
    bool videoAlreadyExists)
    {
        var uploaded = new List<PropertyMedia>();

        // Prevent going over 20 image limit
        var allowedImageCount = Math.Max(0, 20 - existingImageCount);
        foreach (var image in images.Take(allowedImageCount))
        {
            using var stream = image.OpenReadStream();
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(image.FileName, stream),
                Folder = "RentalWise/Properties/Images"
            };
            var result = await _cloudinary.UploadAsync(uploadParams);
            if (result.StatusCode == HttpStatusCode.OK)
            {
                uploaded.Add(new PropertyMedia
                {
                    Url = result.SecureUrl.ToString(),
                    PublicId = result.PublicId,
                    MediaType = "image"
                });
            }
        }

        // Only upload new video if not already uploaded
        if (video != null && !videoAlreadyExists)
        {
            using var stream = video.OpenReadStream();
            var uploadParams = new VideoUploadParams
            {
                File = new FileDescription(video.FileName, stream),
                Folder = "RentalWise/Properties/Videos"
            };
            var result = await _cloudinary.UploadAsync(uploadParams);
            if (result.StatusCode == HttpStatusCode.OK)
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

    public async Task DeleteMediaOneByOneAsync(IEnumerable<PropertyMedia> mediaList)
    {
        foreach (var media in mediaList)
        {
            var deletionParams = new DeletionParams(media.PublicId);

            // If it's a video, you should explicitly set the resource type
            if (media.MediaType == "video")
            {
                deletionParams.ResourceType = ResourceType.Video;
            }

            await _cloudinary.DestroyAsync(deletionParams);
        }
    }

    public async Task DeleteMediaAsync(DeletionParams deletionParams)
    {
        var result = await _cloudinary.DestroyAsync(deletionParams);

        if (result.Result != "ok" && result.Result != "not found")
        {
            throw new Exception($"Failed to delete media: {result.Error?.Message}");
        }
    }
}
