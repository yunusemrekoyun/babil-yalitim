import { describe, expect, it } from "vitest";
import {
  extractCloudinaryAsset,
  getOptimizedImageUrl,
  getOptimizedVideoUrl,
} from "./cloudinary";

describe("cloudinary utils", () => {
  it("extracts asset info from transformed delivery URLs", () => {
    const asset = extractCloudinaryAsset(
      "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/v1234/blogs/cover-image.jpg"
    );

    expect(asset).toEqual({
      cloudName: "demo",
      publicId: "blogs/cover-image",
      resourceType: "image",
    });
  });

  it("builds optimized image and video URLs from Cloudinary sources", () => {
    const imageUrl = getOptimizedImageUrl(
      "https://res.cloudinary.com/demo/image/upload/v1234/projects/cover.jpg",
      { width: 800, quality: "auto:eco" }
    );
    const videoUrl = getOptimizedVideoUrl(
      "https://res.cloudinary.com/demo/video/upload/v5678/projects/hero.mp4",
      { width: 1280, quality: "auto:good" }
    );

    expect(imageUrl).toContain("/image/upload/f_auto,dpr_auto,q_auto:eco,w_800");
    expect(imageUrl).toContain("/projects/cover");
    expect(videoUrl).toContain(
      "/video/upload/f_auto:video,vc_auto,q_auto:good,ac_none,w_1280,c_limit"
    );
    expect(videoUrl).toContain("/projects/hero");
  });

  it("can keep audio tracks when requested", () => {
    const videoUrl = getOptimizedVideoUrl(
      "https://res.cloudinary.com/demo/video/upload/v5678/projects/hero.mp4",
      { width: 1280, quality: "auto:good", stripAudio: false }
    );

    expect(videoUrl).toContain(
      "/video/upload/f_auto:video,vc_auto,q_auto:good,w_1280,c_limit"
    );
    expect(videoUrl).not.toContain("ac_none");
  });

  it("keeps derived video poster URLs stable instead of rebuilding them as images", () => {
    const posterUrl =
      "https://res.cloudinary.com/demo/video/upload/so_0,f_auto,q_auto,w_1280/projects/hero.jpg";

    expect(getOptimizedImageUrl(posterUrl)).toBe(posterUrl);
  });
});
