const { spawn } = require("child_process");
const ffmpegPath = require("ffmpeg-static");
const ffprobeStatic = require("ffprobe-static");

const FFPROBE_PATH = ffprobeStatic?.path || "";

const ensureBinary = (binaryPath, name) => {
  if (!binaryPath) {
    throw new Error(`${name} binary bulunamadı.`);
  }
  return binaryPath;
};

const runBinary = (binaryPath, args = [], { captureStdout = false } = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(binaryPath, args, {
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      if (captureStdout) stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", reject);

    child.on("close", (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }

      const error = new Error(
        stderr.trim() || `${binaryPath} işlemi ${code} koduyla sonlandı.`
      );
      error.code = code;
      error.stderr = stderr;
      reject(error);
    });
  });

const getScaleFilter = (size = "") => {
  if (!size) return "";

  const widthMatch = String(size).match(/^(\d+)x\?$/);
  if (widthMatch) {
    const width = Number(widthMatch[1]);
    return `scale='min(${width},iw)':-2:flags=lanczos`;
  }

  const heightMatch = String(size).match(/^\?x(\d+)$/);
  if (heightMatch) {
    const height = Number(heightMatch[1]);
    return `scale=-2:'min(${height},ih)':flags=lanczos`;
  }

  return "";
};

const runFfmpeg = (args = []) =>
  runBinary(ensureBinary(ffmpegPath, "ffmpeg"), args, { captureStdout: false });

const probeMedia = async (absoluteFilePath) => {
  const { stdout } = await runBinary(
    ensureBinary(FFPROBE_PATH, "ffprobe"),
    [
      "-v",
      "error",
      "-print_format",
      "json",
      "-show_streams",
      "-show_format",
      absoluteFilePath,
    ],
    { captureStdout: true }
  );

  return JSON.parse(stdout || "{}");
};

const generateVideoPoster = (absoluteVideoPath, absolutePosterPath) =>
  runFfmpeg([
    "-y",
    "-i",
    absoluteVideoPath,
    "-frames:v",
    "1",
    "-q:v",
    "2",
    absolutePosterPath,
  ]);

const remuxVideoForStreaming = (
  absoluteVideoPath,
  absoluteOutputPath,
  { stripMetadata = false, faststart = false } = {}
) => {
  const args = ["-y", "-i", absoluteVideoPath];

  if (stripMetadata) {
    args.push("-map_metadata", "-1");
  }

  args.push("-c", "copy");

  if (faststart) {
    args.push("-movflags", "+faststart");
  }

  args.push(absoluteOutputPath);

  return runFfmpeg(args);
};

const transcodeVideoVariant = (
  absoluteVideoPath,
  absoluteOutputPath,
  { size = "", crf = 23, includeAudio = true, audioBitrate = "128k" } = {}
) => {
  const args = ["-y", "-i", absoluteVideoPath];
  const scaleFilter = getScaleFilter(size);

  if (scaleFilter) {
    args.push("-vf", scaleFilter);
  }

  args.push(
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-crf",
    String(crf),
    "-movflags",
    "+faststart",
    "-pix_fmt",
    "yuv420p",
    "-profile:v",
    "high",
    "-level",
    "4.1"
  );

  if (includeAudio) {
    args.push("-c:a", "aac", "-b:a", String(audioBitrate || "128k"));
  } else {
    args.push("-an");
  }

  args.push("-f", "mp4", absoluteOutputPath);

  return runFfmpeg(args);
};

module.exports = {
  ffmpegPath,
  probeMedia,
  generateVideoPoster,
  remuxVideoForStreaming,
  transcodeVideoVariant,
};
