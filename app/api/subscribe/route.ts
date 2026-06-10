import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// Regex for basic email validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Allowed topics list for server-side validation
const ALLOWED_TOPICS = ['AI', 'Tech', 'Finance', 'Crypto', 'Health', 'Sports', 'Science', 'World News'];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, topics } = body;

    // 1. Validation
    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    if (!topics || !Array.isArray(topics) || topics.length === 0) {
      return NextResponse.json(
        { error: 'Please select at least one interest topic.' },
        { status: 400 }
      );
    }

    // Validate that all selected topics are valid
    const cleanEmail = email.trim().toLowerCase();
    const cleanTopics = topics.filter((t) => ALLOWED_TOPICS.includes(t));

    if (cleanTopics.length === 0) {
      return NextResponse.json(
        { error: 'No valid topics selected.' },
        { status: 400 }
      );
    }

    // 2. Database Upsert: Insert or Update if subscriber already exists
    // This allows active subscribers to change their topics, or inactive ones to reactivate.
    const { data, error } = await supabase
      .from('subscribers')
      .upsert(
        {
          email: cleanEmail,
          topics: cleanTopics,
          is_active: true,
        },
        { onConflict: 'email' }
      )
      .select();

    if (error) {
      console.error('Supabase error inserting subscriber:', error);
      return NextResponse.json(
        { error: 'Database error occurred. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Successfully subscribed!', data },
      { status: 200 }
    );
  } catch (error) {
    console.error('API route error in subscribe:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
