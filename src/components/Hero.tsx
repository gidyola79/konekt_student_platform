import { motion } from 'motion/react';
import { ArrowRight, Sparkles, ShoppingBag, FolderGit2, MessagesSquare, Users2, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onExploreDemo: () => void;
}

export default function Hero({ onExploreDemo }: HeroProps) {
  return (
    <section className="relative min-h-screen pt-32 pb-24 flex items-center justify-center overflow-hidden bg-transparent">
      {/* Decorative Grid and Ambient Lights */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      {/* Glowing Neon Blobs */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none animate-pulse duration-10000" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex flex-col items-center">
          {/* Top Pill Accent */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs sm:text-sm text-indigo-600 font-medium mb-8 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-indigo-500 animate-spin" style={{ animationDuration: '4s' }} />
            <span>The Social & Economic Ecosystem for Campus Life</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight leading-[1.1] max-w-5xl"
          >
            Connect, Share, and <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">
              Launch Student Empires
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-slate-650 max-w-3xl leading-relaxed"
          >
            Konekt bridges the gap between academic collaboration and campus commerce. 
            Share top-grade study resources, trade goods in a student-run marketplace, 
            and build thriving class networks.
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md"
          >
            <button
              onClick={onExploreDemo}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/25 transition-all text-base hover:-translate-y-0.5 pointer-events-auto cursor-pointer"
            >
              Explore Live Demo
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('marketplace');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 font-semibold transition-all text-base hover:-translate-y-0.5 cursor-pointer shadow-sm"
            >
              Browse Marketplace
              <ShoppingBag className="w-5 h-5 text-slate-500" />
            </button>
          </motion.div>

          {/* Key Trust Signals / Numbers */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 py-8 px-6 sm:px-12 rounded-3xl bg-white/80 border border-slate-200/80 shadow-md shadow-slate-100/50 backdrop-blur-sm max-w-5xl w-full"
          >
            <div className="text-center md:border-r border-slate-200 md:pr-4">
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">4.8k+</div>
              <div className="text-xs sm:text-sm text-slate-500 mt-1 font-sans">Active Campuses</div>
            </div>
            <div className="text-center md:border-r border-slate-200 md:px-4">
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-cyan-600">12k+</div>
              <div className="text-xs sm:text-sm text-slate-500 mt-1 font-sans">Resources Shared</div>
            </div>
            <div className="text-center md:border-r border-slate-200 md:px-4">
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-indigo-600">$45,000+</div>
              <div className="text-xs sm:text-sm text-slate-500 mt-1 font-sans">Student Revenue Earned</div>
            </div>
            <div className="text-center md:pl-4">
              <div className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900">99.8%</div>
              <div className="text-xs sm:text-sm text-slate-500 mt-1 font-sans">Safe-Trade Verified</div>
            </div>
          </motion.div>

          {/* Feature Badge Strip */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-12 flex flex-wrap justify-center gap-6 text-xs text-slate-600 font-mono tracking-wider uppercase mb-2"
          >
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified Student Access</span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5"><FolderGit2 className="w-4 h-4 text-cyan-600" /> PDF & Formula Vaults</span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5"><ShoppingBag className="w-4 h-4 text-indigo-600" /> Student Storefronts</span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5"><MessagesSquare className="w-4 h-4 text-purple-600" /> High-Speed Chat</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
