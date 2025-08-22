import { type LoadEvent } from '@sveltejs/kit'
import { dev } from '$app/environment';

export async function load({ fetch }: { fetch: LoadEvent['fetch'] }) {
  // Use dummy data in development, real API in production
  if (dev) {
    return {
      stars: '42' // Your dummy data
    };
  }

  try {
    // Production code - fetch from your real API
    const response = await fetch('/api/github/stars');
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    return {
      stars: data.stars
    };
  } catch (error) {
    console.error('Error fetching GitHub stars:', error);
    return {
      stars: null,
      error: 'Failed to load GitHub stars'
    };
  }
}
