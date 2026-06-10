import SubscribeForm from '@/components/SubscribeForm';
import { Newspaper, Sparkles, Send, Zap } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Header / Navbar */}
      <header className="border-b border-slate-900 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Newspaper className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              AI Personal Digest
            </span>
          </div>
          <div className="flex items-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ● Pipeline Active
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex flex-col items-center justify-center text-center">
        <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/25 px-4 py-1.5 rounded-full text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-8 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Personalization Engine Powered by GPT-4o-mini</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-6 max-w-3xl leading-[1.1]">
          Your AI-Powered <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            Daily Newsletter
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
          Get a personalised news digest delivered to your inbox every morning — curated and written by AI.
          No fluff, no noise, just the stories you care about.
        </p>

        {/* Form Container */}
        <div className="w-full mb-20">
          <SubscribeForm />
        </div>

        {/* Features / Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full border-t border-slate-900 pt-16">
          <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-6 text-left hover:border-slate-800 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-indigo-400 mb-5 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/25 transition-all">
              <Zap className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Smart Ingestion</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              We query search engines for actual fresh news across your selected categories every day to find the top articles.
            </p>
          </div>

          <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-6 text-left hover:border-slate-800 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-indigo-400 mb-5 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/25 transition-all">
              <Sparkles className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">AI-Synthesized Summaries</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Our AI writes friendly, engaging 2-to-3 sentence briefs that highlight critical context without wasting your time.
            </p>
          </div>

          <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-6 text-left hover:border-slate-800 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-indigo-400 mb-5 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/25 transition-all">
              <Send className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Automated Delivery</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Sent straight to your inbox via Resend using clean, mobile-responsive layouts. Set it once and read on the go.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 text-center text-sm text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between">
          <p>&copy; {new Date().getFullYear()} AI Personal Digest. Curated by AI, tailored by you.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="https://github.com" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
