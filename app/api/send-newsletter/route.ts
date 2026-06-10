import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { fetchNewsForTopic, Article } from '@/lib/fetchNews';
import { generateNewsletter } from '@/lib/generateNewsletter';
import { sendEmail } from '@/lib/sendEmail';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isTest = searchParams.get('test') === 'true';
    const testEmail = searchParams.get('test_email');

    // 1. Authorization check for production
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    // In production, require either the Vercel Cron bearer token or a matching CRON_SECRET query parameter
    if (
      process.env.NODE_ENV === 'production' && 
      !isTest && // Allow test query if it has a secret or bypass
      authHeader !== `Bearer ${cronSecret}`
    ) {
      console.warn('Unauthorized cron invocation attempt.');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Fetch subscribers to process
    let subscribers = [];
    
    if (isTest && testEmail) {
      // If testing, we process only one simulated or existing subscriber
      console.log(`[Cron Test] Running test pipeline for email: ${testEmail}`);
      const testTopics = searchParams.get('topics')?.split(',') || ['AI', 'Tech'];
      subscribers = [{ email: testEmail, topics: testTopics, is_active: true }];
    } else {
      console.log('[Cron] Fetching all active subscribers...');
      const { data, error } = await supabaseAdmin
        .from('subscribers')
        .select('email, topics')
        .eq('is_active', true);

      if (error) {
        console.error('Supabase error fetching subscribers:', error);
        return NextResponse.json({ error: 'Database fetch failed' }, { status: 500 });
      }
      subscribers = data || [];
    }

    if (subscribers.length === 0) {
      console.log('[Cron] No active subscribers found.');
      return NextResponse.json({ message: 'No active subscribers to process.' });
    }

    console.log(`[Cron] Found ${subscribers.length} subscriber(s) to process.`);

    // 3. Extract all unique topics across all subscribers
    const allTopics = new Set<string>();
    subscribers.forEach((sub) => {
      sub.topics.forEach((topic: string) => allTopics.add(topic));
    });

    const uniqueTopics = Array.from(allTopics);
    console.log(`[Cron] Unique topics to fetch: ${uniqueTopics.join(', ')}`);

    // 4. Fetch news for each unique topic (cached in fetchNews.ts to prevent redundant API calls)
    const articlesByTopic: Record<string, Article[]> = {};
    for (const topic of uniqueTopics) {
      try {
        const articles = await fetchNewsForTopic(topic);
        articlesByTopic[topic] = articles;
      } catch (err) {
        console.error(`Failed to fetch articles for topic "${topic}":`, err);
        articlesByTopic[topic] = [];
      }
    }

    // 5. Generate and send newsletters for each subscriber
    const results = {
      total: subscribers.length,
      success: 0,
      failed: 0,
      details: [] as Array<{ email: string; status: string; error?: string }>,
    };

    for (const subscriber of subscribers) {
      const { email, topics } = subscriber;
      
      try {
        console.log(`[Pipeline] Processing newsletter for ${email} on topics: ${topics.join(', ')}`);
        
        // Generate personalized HTML content
        const htmlContent = await generateNewsletter(topics, articlesByTopic);
        
        // Send email via Resend
        const subject = `Your Personal AI News Digest - ${new Date().toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
        })}`;
        
        await sendEmail({
          to: email,
          subject,
          htmlContent,
        });

        results.success++;
        results.details.push({ email, status: 'success' });
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        console.error(`Pipeline failed for subscriber ${email}:`, err);
        results.failed++;
        results.details.push({ email, status: 'failed', error: errMsg });
      }
    }

    console.log(`[Cron] Pipeline completed. Success: ${results.success}, Failed: ${results.failed}`);
    return NextResponse.json({
      message: 'Newsletter delivery pipeline completed.',
      summary: results,
    });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('Fatal cron handler error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: errMsg },
      { status: 500 }
    );
  }
}
