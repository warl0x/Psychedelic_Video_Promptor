
/**
 * Fetches an image from a URL and converts it to a Base64 string,
 * stripping the data URL prefix.
 * @param {string} url The URL of the image.
 * @returns {Promise<string>} A promise that resolves with the Base64 string.
 */
export async function urlToBase64(url: string): Promise<string> {
  try {
    // Using a proxy to bypass potential CORS issues, common with i.redd.it.
    // In a production environment, a self-hosted CORS proxy would be more reliable.
    const proxyUrl = `https://cors-anywhere.herokuapp.com/${url}`;
    
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        // Strip the data URL prefix (e.g., "data:image/jpeg;base64,")
        resolve(dataUrlToBase64(base64data));
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error(`Error converting URL to Base64 for ${url}:`, error);
    // Fallback or re-throw as needed.
    throw new Error(`Could not process image from URL: ${url}. This might be a CORS issue.`);
  }
}

/**
 * Extracts the Base64 encoded string from a data URL.
 * @param {string} dataUrl The data URL (e.g., "data:image/jpeg;base64,...").
 * @returns {string} The Base64 encoded string.
 */
export function dataUrlToBase64(dataUrl: string): string {
  const base64String = dataUrl.split(',')[1];
  if (!base64String) {
      throw new Error("Invalid data URL provided.");
  }
  return base64String;
}
