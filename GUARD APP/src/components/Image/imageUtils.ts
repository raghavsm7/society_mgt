export const getImageUri = (imagePath: string | null) => {
    if (!imagePath) return null;
  
    // Server URL format
    if (imagePath.startsWith('/uploads/')) {
      return `http://46.202.162.203:3002${imagePath}`;
    }
  
    // Local file format
    if (imagePath.startsWith('file:///')) {
      // Direct return local file URI for React Native to handle
      return imagePath;
    }
  
    return imagePath;
  };

 