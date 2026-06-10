'use client';

import { useState } from 'react';
import { Mail, Check, AlertCircle, Loader2 } from 'lucide-react';

const TOPICS = [
  { id: 'AI', name: 'Artificial Intelligence', description: 'LLMs, GPT-4, automation & machine learning' },
  { id: 'Tech', name: 'Technology', description: 'Gadgets, dev news, software, and startup trends' },
  { id: 'Finance', name: 'Finance & Markets', description: 'Stocks, macro-economics, and business news' },
  { id: 'Crypto', name: 'Crypto & Web3', description: 'Bitcoin, Ethereum, DeFi, and blockchain space' },
  { id: 'Health', name: 'Health & Wellness', description: 'Medicine breakthroughs, fitness, and nutrition' },
  { id: 'Sports', name: 'Sports', description: 'Football, basketball, global sports and results' },
  { id: 'Science', name: 'Science', description: 'Space exploration, physics, and environment' },
  { id: 'World News', name: 'World News', description: 'Global events, geopolitics, and world affairs' },
];

export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const toggleTopic = (topicId: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((id) => id !== topicId)
        : [...prev, topicId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTopics.length === TOPICS.length) {
      setSelectedTopics([]);
    } else {
      setSelectedTopics(TOPICS.map((t) => t.id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    if (!email) {
      setStatus('error');
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (selectedTopics.length === 0) {
      setStatus('error');
      setErrorMessage('Please select at least one topic of interest.');
      return;
    }

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          topics: selectedTopics,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setStatus('success');
    } catch (error: unknown) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred.');
    }
  };

  if (status === 'success') {
    return (
      <div className="w-full max-w-xl mx-auto bg-slate-900/60 backdrop-blur-md border border-indigo-500/30 rounded-2xl p-8 text-center animate-fade-in shadow-2xl shadow-indigo-500/10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 mb-6">
          <Check className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">You&apos;re Subscribed!</h3>
        <p className="text-slate-300 mb-6 leading-relaxed">
          We&apos;ve added <span className="font-semibold text-indigo-400">{email}</span> to the AI Digest list. 
          You will receive your first personalized newsletter on your selected topics starting tomorrow morning.
        </p>
        <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 mb-6 max-h-40 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Selected Interests</p>
          <div className="flex flex-wrap justify-center gap-2">
            {selectedTopics.map((topicId) => {
              const topic = TOPICS.find((t) => t.id === topicId);
              return (
                <span
                  key={topicId}
                  className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs rounded-full"
                >
                  {topic?.name || topicId}
                </span>
              );
            })}
          </div>
        </div>
        <button
          onClick={() => {
            setEmail('');
            setSelectedTopics([]);
            setStatus('idle');
          }}
          className="text-slate-400 hover:text-white text-sm transition-colors underline underline-offset-4"
        >
          Subscribe another email
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-8">
      {/* Email Input Field */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl">
        <label htmlFor="email" className="block text-sm font-semibold text-slate-200 mb-3">
          Where should we send your daily news digest?
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <Mail className="w-5 h-5" />
          </div>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
            className="w-full pl-12 pr-4 py-4 bg-slate-950/80 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all disabled:opacity-50"
            required
          />
        </div>
      </div>

      {/* Topics Multi-Select Grid */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-semibold text-slate-200">Select Your Topics of Interest</h4>
            <p className="text-xs text-slate-400 mt-1">We will only write articles on topics you select below.</p>
          </div>
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-350 transition-colors"
          >
            {selectedTopics.length === TOPICS.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TOPICS.map((topic) => {
            const isSelected = selectedTopics.includes(topic.id);
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => toggleTopic(topic.id)}
                disabled={status === 'loading'}
                className={`flex items-start text-left p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-indigo-500/10 border-indigo-500 text-white shadow-lg shadow-indigo-500/5'
                    : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950/60'
                }`}
              >
                <div
                  className={`mt-0.5 flex-shrink-0 flex items-center justify-center w-5 h-5 rounded border transition-all mr-3 ${
                    isSelected
                      ? 'bg-indigo-500 border-indigo-500 text-white'
                      : 'border-slate-700 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{topic.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5 leading-snug">{topic.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Error Message */}
      {status === 'error' && (
        <div className="flex items-start space-x-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-4 text-sm animate-pulse">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full flex items-center justify-center py-4 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-750 text-white text-base font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-950 shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/30 active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="w-5 h-5 mr-3 animate-spin" />
            Subscribing to newsletter...
          </>
        ) : (
          'Subscribe for Free'
        )}
      </button>
    </form>
  );
}
