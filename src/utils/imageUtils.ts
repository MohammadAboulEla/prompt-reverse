/**
 * Convert File to base64 string
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Fetch an image URL and convert to base64
 */
export async function urlToBase64(url: string): Promise<{ dataUrl: string; mimeType: string }> {
  const response = await fetch(url);
  const blob = await response.blob();
  const mimeType = blob.type || 'image/jpeg';

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        dataUrl: reader.result as string,
        mimeType,
      });
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(blob);
  });
}

/**
 * Generate a downscaled thumbnail data URL for saving in localStorage without hitting quota
 */
export async function createThumbnail(dataUrl: string, maxDimension = 240): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        }
      } else {
        if (height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.75));
      } else {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

/**
 * Get image natural dimensions and calculate approximate aspect ratio string
 */
export async function getImageMetadata(dataUrl: string): Promise<{ width: number; height: number; aspectRatioString: string }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;
      const ratio = width / height;

      let aspectRatioString = '1:1';
      if (Math.abs(ratio - 16 / 9) < 0.15) aspectRatioString = '16:9';
      else if (Math.abs(ratio - 9 / 16) < 0.15) aspectRatioString = '9:16';
      else if (Math.abs(ratio - 4 / 3) < 0.15) aspectRatioString = '4:3';
      else if (Math.abs(ratio - 3 / 4) < 0.15) aspectRatioString = '3:4';
      else if (Math.abs(ratio - 3 / 2) < 0.15) aspectRatioString = '3:2';
      else if (Math.abs(ratio - 2 / 3) < 0.15) aspectRatioString = '2:3';
      else if (Math.abs(ratio - 21 / 9) < 0.2) aspectRatioString = '21:9';
      else if (Math.abs(ratio - 4 / 5) < 0.15) aspectRatioString = '4:5';

      resolve({ width, height, aspectRatioString });
    };
    img.onerror = () => resolve({ width: 0, height: 0, aspectRatioString: '1:1' });
    img.src = dataUrl;
  });
}

/**
 * Calculate approximate binary byte size from a base64 string or data URL
 */
export function calculateBase64Bytes(dataUrl: string): number {
  const base64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;
  return Math.round((base64.length * 3) / 4);
}

/**
 * Format bytes into human-readable string (e.g. "820 KB", "1.4 MB")
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Resize and compress an image data URL so that its total scale is <= 1 MB (default 1024 * 1024 bytes)
 * before sending to the AI model. Preserves high visual fidelity while keeping total payload under 1 MB.
 */
export async function resizeImageToTargetSize(
  dataUrl: string,
  maxSizeBytes: number = 1024 * 1024 // 1 MB
): Promise<{ dataUrl: string; mimeType: string; sizeBytes: number; width: number; height: number }> {
  return new Promise((resolve) => {
    const currentBytes = calculateBase64Bytes(dataUrl);

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;

      // If already under 1MB and not excessively large (<= 2048px on max edge), keep as is
      const maxEdge = Math.max(width, height);
      if (currentBytes <= maxSizeBytes && maxEdge <= 2048) {
        const mimeType = dataUrl.startsWith('data:')
          ? dataUrl.split(';')[0].replace('data:', '')
          : 'image/jpeg';
        resolve({
          dataUrl,
          mimeType,
          sizeBytes: currentBytes,
          width,
          height,
        });
        return;
      }

      // Calculate initial scaling
      let targetMaxDimension = 1920;
      if (currentBytes > maxSizeBytes) {
        // Estimate dimension scale factor
        const scaleFactor = Math.min(0.9, Math.sqrt(maxSizeBytes / currentBytes) * 0.95);
        targetMaxDimension = Math.max(800, Math.round(maxEdge * scaleFactor));
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      let currentQuality = 0.88;
      let finalDataUrl = dataUrl;
      let finalBytes = currentBytes;
      let finalWidth = width;
      let finalHeight = height;

      // Iteratively reduce dimensions and/or quality until size <= maxSizeBytes
      let attempts = 0;
      while (attempts < 6) {
        attempts++;

        let scaledWidth = width;
        let scaledHeight = height;

        if (Math.max(scaledWidth, scaledHeight) > targetMaxDimension) {
          if (scaledWidth > scaledHeight) {
            scaledHeight = Math.round((height * targetMaxDimension) / width);
            scaledWidth = targetMaxDimension;
          } else {
            scaledWidth = Math.round((width * targetMaxDimension) / height);
            scaledHeight = targetMaxDimension;
          }
        }

        canvas.width = scaledWidth;
        canvas.height = scaledHeight;

        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.clearRect(0, 0, scaledWidth, scaledHeight);
          ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
        }

        // Always compress to image/jpeg for reliable predictable byte size
        finalDataUrl = canvas.toDataURL('image/jpeg', currentQuality);
        finalBytes = calculateBase64Bytes(finalDataUrl);
        finalWidth = scaledWidth;
        finalHeight = scaledHeight;

        if (finalBytes <= maxSizeBytes) {
          break;
        }

        // If still > 1MB, reduce target dimension by 18% and quality slightly
        targetMaxDimension = Math.round(targetMaxDimension * 0.82);
        currentQuality = Math.max(0.65, currentQuality - 0.08);
      }

      resolve({
        dataUrl: finalDataUrl,
        mimeType: 'image/jpeg',
        sizeBytes: finalBytes,
        width: finalWidth,
        height: finalHeight,
      });
    };

    img.onerror = () => {
      // Fallback if image load fails
      resolve({
        dataUrl,
        mimeType: 'image/jpeg',
        sizeBytes: currentBytes,
        width: 0,
        height: 0,
      });
    };

    img.src = dataUrl;
  });
}
