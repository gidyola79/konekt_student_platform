import { motion } from 'motion/react';
import { BadgeDollarSign, Heart, Sparkles, HelpCircle, GraduationCap, Scale, Lock } from 'lucide-react';

export default function EntrepreneurSection() {
  const steps = [
    {
      icon: GraduationCap,
      title: 'Host Your Services',
      description: 'Offer peer-to-peer coding bootcamps, detailed essay feedback, language reviews, digital resume audits, or personal fitness sessions right on campus.'
    },
    {
      icon: BadgeDollarSign,
      title: 'Monetize Handmade Crafts',
      description: 'Do you create custom illustrations, handcraft sustainable crochet dorm decorations, or paint custom shoes? Showcase your works to thousands of student purchasers.'
    },
    {
      icon: Scale,
      title: 'Keep 100% of What You Earn',
      description: 'Unlike standard gig-economy apps that extract 20%+, Konekt operates with a strict 0% platform fee model for active student sellers.'
    }
  ];

  return (
    <section id="marketplace" className="py-24 bg-transparent border-t border-slate-200 relative">
      <div className="absolute top-1/3 left-10 w-80 h-80 bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Visual Panel Left */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 relative"
          >
            {/* Double Frame Effect representing student store */}
            <div className="relative rounded-3xl p-8 bg-white border border-slate-200 shadow-lg backdrop-blur-md overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl" />
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <BadgeDollarSign className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h4 className="font-display font-extrabold text-slate-900 text-sm">Your Entrepreneur Console</h4>
                    <p className="text-[10px] text-slate-500">Live Campus Storefront Stat Panel</p>
                  </div>
                </div>

                <div className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold animate-pulse">
                  STORE ACTIVE
                </div>
              </div>

              {/* Stat card simulated rows */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-150 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-mono text-slate-500">Total Store Earnings</div>
                    <div className="text-2xl font-display font-black text-slate-900 mt-1">$1,452.00</div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-md">
                    +24% this month
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-150">
                    <div className="text-[10px] uppercase font-mono text-slate-500">Store Views</div>
                    <div className="text-lg font-bold text-slate-900 mt-1">412 students</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-150">
                    <div className="text-[10px] uppercase font-mono text-slate-500">Active Listings</div>
                    <div className="text-lg font-bold text-slate-900 mt-1">4 products</div>
                  </div>
                </div>

                {/* Simulated Recent Review */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-150 text-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <img 
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120" 
                      className="w-5 h-5 rounded-full object-cover" 
                      alt="Student" 
                    />
                    <span className="font-bold text-slate-900">Sarah Jenkins</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-[10px] text-slate-500">Purchased: JavaScript Coaching Block</span>
                  </div>
                  <p className="text-slate-600 italic font-medium leading-relaxed">
                    "Honestly, Zoe is such a helpful React mentor. Taught me more about context and hooks in 2 hours than a whole week of lecture videos!"
                  </p>
                </div>
              </div>
            </div>
            
            {/* Background floating visual badge */}
            <div className="absolute -bottom-6 -right-6 p-4 rounded-2xl bg-indigo-600 border border-indigo-500 shadow-2xl flex items-center gap-3 scale-90 sm:scale-100">
              <div className="p-2 bg-indigo-500/20 rounded-xl text-white">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-mono text-indigo-200">Konekt Secure pay</div>
                <div className="text-sm font-bold text-white">Zero Handoff Fraud</div>
              </div>
            </div>
          </motion.div>

          {/* Text Right */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-50 text-cyan-705 border border-cyan-100 rounded-full text-xs font-mono uppercase tracking-wider mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> E-commerce Unleashed
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900"
            >
              Elevate Your Side Hustle, Direct to Your Classmates
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 text-slate-600 text-base sm:text-lg leading-relaxed"
            >
              Every student has skills to monetize—be it writing, programming, drafting notes, or making crafts. Konekt gives student entrepreneurs an instant audience with zero marketplace overhead.
            </motion.p>

            {/* Steps / Capabilities */}
            <div className="space-y-8 mt-10">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="p-3 bg-white border border-slate-205 text-cyan-600 rounded-2xl shrink-0 shadow-sm">
                      <Icon className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-slate-900 text-base sm:text-lg">{step.title}</h4>
                      <p className="text-slate-600 text-xs sm:text-sm mt-1.5 leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
