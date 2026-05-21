import { useState, FormEvent } from 'react';
import { Orbit, Send, Sparkles, Github, Twitter, Linkedin, MessageSquare } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 font-sans relative z-10">
      <div className="absolute top-0 left-1/3 w-64 h-64 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={scrollToTop}>
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white transition-transform group-hover:rotate-12">
                <Orbit className="w-4.5 h-4.5" />
              </div>
              <span className="font-display font-bold text-xl text-slate-900">
                Konekt<span className="text-indigo-600">.</span>
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Empowering students to co-create academic records, trade services, launch local enterprises, and cultivate social circles securely on campus.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-colors shadow-sm">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-colors shadow-sm">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-colors shadow-sm">
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-slate-900 text-sm tracking-wider uppercase">Platform Modules</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-500">
              <li>
                <a href="#features" className="hover:text-slate-900 transition-colors">Core Features</a>
              </li>
              <li>
                <a href="#marketplace" className="hover:text-slate-900 transition-colors">Student-Run Marketplace</a>
              </li>
              <li>
                <a href="#resources" className="hover:text-slate-900 transition-colors">Shared Resource Vault</a>
              </li>
              <li>
                <a href="#interactive-demo" className="hover:text-slate-900 transition-colors">Sandbox Simulator</a>
              </li>
            </ul>
          </div>

          {/* About & Trust */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-slate-900 text-sm tracking-wider uppercase">Rules & Verification</h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-500">
              <li>
                <a href="#" className="hover:text-slate-900 transition-colors">Campus Ambassador Positions</a>
              </li>
              <li>
                <a href="#" className="hover:text-slate-900 transition-colors">Peer-Review Guidelines</a>
              </li>
              <li>
                <a href="#" className="hover:text-slate-900 transition-colors">Student Safety Standards</a>
              </li>
              <li>
                <a href="#" className="hover:text-slate-900 transition-colors">0% Marketplace Fee Policy</a>
              </li>
            </ul>
          </div>

          {/* Newsletter / Mock action */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-slate-900 text-sm tracking-wider uppercase flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-650" /> Keep In Touch
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Don’t miss out! Get alert notifications when premium files for your degree or new student craftsmen listings are published.
            </p>
            
            {subscribed ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-650 text-xs font-semibold animate-in zoom-in-95 duration-200">
                Success! You are now subscribed to class updates.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  placeholder="name@school.edu"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-indigo-600/15"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom copyright details */}
        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Konekt Platform Inc . All campus rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy Principles</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Honor Code Policy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">DMCA Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
