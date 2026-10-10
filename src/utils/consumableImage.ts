// WebP supports at most 16,383 pixels on either axis. Official detail images
// can be much taller, even when their width is below the thumbnail target.
export function getFramedImageDimensions(sourceWidth: number, sourceHeight: number) {
  const width = Math.min(960, sourceWidth, Math.floor((16000 * sourceWidth) / sourceHeight));
  return {
    width,
    height: Math.round((sourceHeight * width) / sourceWidth),
    widths: [...new Set([Math.min(480, width), width])],
  };
}
