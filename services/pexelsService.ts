
const PEXELS_API_KEY = "0ayyu6rl2ATmjDXFlVzWKQHvgd9Ds5ayKl3d3DEru96sMjvec2zNsYM5";

export const fetchPexelsImages = async (query: string, count: number = 4): Promise<string[]> => {
  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape&size=large`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Pexels API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.photos.map((photo: any) => photo.src.large2x || photo.src.large);
  } catch (error) {
    console.error("Error fetching images from Pexels:", error);
    // Fallback to picsum if API fails or quota exceeded
    return Array.from({ length: count }).map((_, i) => `https://picsum.photos/1920/1080?random=${Math.random() + i}`);
  }
};
