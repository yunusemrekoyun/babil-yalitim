import { describe, expect, it } from "vitest";
import { buildRichContentHtml, getYouTubeEmbedUrl } from "./richContent";

describe("richContent utils", () => {
  it("youtube watch urlini embed urline cevirir", () => {
    expect(
      getYouTubeEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
    ).toBe("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ");
  });

  it("tek satir url blog icerigini linke cevirir", () => {
    expect(buildRichContentHtml("https://ornek.com")).toContain(
      'href="https://ornek.com"'
    );
  });

  it("youtube iframe veya url satirini iframe block olarak uretir", () => {
    const html = buildRichContentHtml(
      "Giris metni\n\nhttps://youtu.be/dQw4w9WgXcQ"
    );

    expect(html).toContain("<p>Giris metni</p>");
    expect(html).toContain("<iframe");
    expect(html).toContain("youtube-nocookie.com/embed/dQw4w9WgXcQ");
  });
});
