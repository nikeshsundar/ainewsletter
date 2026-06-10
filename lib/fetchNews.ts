export interface Article {
  title: string;
  description: string;
  content: string;
  url: string;
  image?: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

// In-memory cache for the current execution lifecycle
const topicCache: Record<string, Article[]> = {};

// Map user-friendly topics to optimal search queries for GNews
const topicQueryMap: Record<string, string> = {
  'AI': 'artificial intelligence OR AI OR machine learning',
  'Tech': 'technology OR software OR tech news',
  'Finance': 'finance OR stock market OR economy',
  'Crypto': 'cryptocurrency OR crypto OR bitcoin OR ethereum',
  'Health': 'health OR medicine OR wellness OR healthcare',
  'Sports': 'sports OR football OR basketball OR athletics',
  'Science': 'science OR space OR physics OR biology',
  'World News': 'world news OR international affairs OR global events'
};

export async function fetchNewsForTopic(topic: string): Promise<Article[]> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    console.error('GNews API key is not configured (NEWS_API_KEY).');
    return [];
  }

  // Normalize topic
  const mappedQuery = topicQueryMap[topic] || topic;

  // Check cache first
  if (topicCache[topic]) {
    console.log(`[Cache Hit] Using cached news for topic: ${topic}`);
    return topicCache[topic];
  }

  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(mappedQuery)}&lang=en&max=3&apikey=${apiKey}`;

  try {
    console.log(`[Fetch] Fetching news for topic: ${topic} (query: "${mappedQuery}")`);
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GNews API returned status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const articles: Article[] = data.articles || [];

    // Cache the result
    topicCache[topic] = articles;
    return articles;
  } catch (error) {
    console.error(`Error fetching news for topic "${topic}":`, error);
    return [];
  }
}

// Helper to clear the cache (useful between test runs or if needed)
export function clearNewsCache() {
  for (const key in topicCache) {
    delete topicCache[key];
  }
}
