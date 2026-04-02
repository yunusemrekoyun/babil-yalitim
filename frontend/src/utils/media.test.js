import { describe, expect, it } from "vitest";
import {
  getMediaKey,
  getMediaUrl,
  getOptimizedImageUrl,
  getOptimizedVideoUrl,
  getVideoPosterUrl,
  looksVideo,
} from "./media";

describe("media utils", () => {
  it("detects video urls", () => {
    expect(looksVideo("https://example.com/file.mp4")).toBe(true);
    expect(looksVideo("https://example.com/file.jpg")).toBe(false);
  });

  it("returns direct urls for local image and video media", () => {
    expect(
      getOptimizedImageUrl("https://cdn.example.com/projects/cover.jpg")
    ).toBe("https://cdn.example.com/projects/cover.jpg");
    expect(
      getOptimizedVideoUrl("https://cdn.example.com/projects/hero.mp4")
    ).toBe("https://cdn.example.com/projects/hero.mp4");
  });

  it("normalizes relative media urls against the backend origin", () => {
    expect(getMediaUrl("/media/projects/cover.jpg").endsWith("/media/projects/cover.jpg")).toBe(
      true
    );
  });

  it("uses posterUrl for video previews", () => {
    const media = {
      url: "https://cdn.example.com/services/demo.mp4",
      posterUrl: "https://cdn.example.com/services/demo.poster.jpg",
      resourceType: "video",
      storageKey: "services/demo.mp4",
    };

    expect(getVideoPosterUrl(media)).toBe(media.posterUrl);
    expect(getOptimizedImageUrl(media)).toBe(media.posterUrl);
    expect(getMediaKey(media)).toBe(media.storageKey);
  });
});
