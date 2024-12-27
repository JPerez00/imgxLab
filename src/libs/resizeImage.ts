// src/utils/resizeImage.ts

type ResizeOptions = {
    width?: number;
    height?: number;
    percentage?: number;
    format: 'jpeg' | 'png' | 'webp';
    aspectRatioLocked: boolean;
  };
  
  export default function resizeImage(
    imageSrc: string,
    options: ResizeOptions
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageSrc;
  
      img.onload = () => {
        let { width, height } = options;
        const { percentage, format, aspectRatioLocked } = options;
  
        if (percentage && percentage !== 100) {
          width = img.width * (percentage / 100);
          height = img.height * (percentage / 100);
        }
  
        if (aspectRatioLocked && width && !height) {
          height = (width / img.width) * img.height;
        } else if (aspectRatioLocked && height && !width) {
          width = (height / img.height) * img.width;
        }
  
        width = width || img.width;
        height = height || img.height;
  
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
  
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
  
        ctx.drawImage(img, 0, 0, width, height);
  
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedImageUrl = URL.createObjectURL(blob);
              resolve(resizedImageUrl);
            } else {
              reject(new Error('Failed to create resized image'));
            }
          },
          `image/${format}`,
          format === 'jpeg' ? 0.8 : undefined // Adjust quality for JPEG if needed
        );
      };
  
      img.onerror = (error) => {
        reject(error);
      };
    });
  }
  