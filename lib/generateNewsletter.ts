import OpenAI from 'openai';
import { Article } from './fetchNews';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function generateNewsletter(
  topics: string[],
  articlesByTopic: Record<string, Article[]>
): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing environment variable: OPENAI_API_KEY');
  }

  // Format the articles list into a readable structure for the prompt
  let articlesContext = '';
  for (const topic of topics) {
    const articles = articlesByTopic[topic] || [];
    articlesContext += `### Topic: ${topic}\n`;
    if (articles.length === 0) {
      articlesContext += `No new articles found for this topic today.\n\n`;
      continue;
    }
    articles.forEach((art, index) => {
      articlesContext += `${index + 1}. Title: ${art.title}\n`;
      articlesContext += `   Source: ${art.source?.name || 'Unknown'}\n`;
      articlesContext += `   URL: ${art.url}\n`;
      articlesContext += `   Description: ${art.description || 'N/A'}\n`;
      articlesContext += `   Content: ${art.content || 'N/A'}\n\n`;
    });
  }

  const systemPrompt = `You are a professional, warm, and engaging newsletter writer. 
Your task is to write a personalized newsletter digest for a reader based on their chosen topics.
You must return your output formatted in clean, modern HTML suitable for email.
Do not include \`<html>\`, \`<head>\`, or \`<body>\` tags. Only return the inner HTML structure (e.g., headers, paragraphs, links, sections).

Follow these design guidelines for the HTML output:
1. Wrap each topic section in a div with some padding and a subtle bottom border or spacing.
2. Use beautiful headings: \`<h2 style="color: #4f46e5; font-size: 20px; margin-top: 24px; margin-bottom: 8px; font-family: sans-serif;">Topic: [Topic Name]</h2>\`.
3. For each article, write a warm, engaging 2-3 sentence summary.
4. Provide a clickable link to the source: \`<a href="[URL]" style="color: #2563eb; text-decoration: underline; font-weight: 500;" target="_blank">Read more on [Source Name]</a>\`.
5. Maintain a friendly, human-like voice throughout the newsletter.
6. Begin with a warm greeting (e.g., "Hello there!", "Happy reading!") and end with a friendly sign-off (e.g., "Wishing you a great day ahead, The AI Digest Team").`;

  const userPrompt = `Write a personalized newsletter for a reader interested in these topics: ${topics.join(', ')}.

Here are the news articles to use for writing the digest:
${articlesContext}

Remember: Write a clean, human-feeling digest. Do not copy paste the articles verbatim. Write engaging 2-3 sentence summaries for each article and link to them properly.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Failed to generate content from OpenAI');
    }

    // Clean up any potential markdown code block wrappers (e.g. ```html ... ```)
    return content
      .replace(/^```html\s*/i, '')
      .replace(/```$/, '')
      .trim();
  } catch (error) {
    console.error('Error generating newsletter with OpenAI:', error);
    throw error;
  }
}
