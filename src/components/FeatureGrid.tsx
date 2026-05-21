import { motion } from 'motion/react';
import { BookOpen, ShoppingCart, MessageCircle, HeartHandshake, ArrowUpRight } from 'lucide-react';

export default function FeatureGrid() {
  const pillars = [
    {
      icon: BookOpen,
      iconColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      title: 'Academic Resource Vault',
      description: 'Exchange study notes, previous exam guides, formula cards, and cheatsheets. Browse resources structured by course code and rated by peers.',
      highlight: 'Crowdsourced top grades',
      badge: 'Resource Hub'
    },
    {
      icon: ShoppingCart,
      iconColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      title: 'Student-Entrepreneur Market',
      description: 'Host your own digital storefront to advertise custom crochet goods, dorm LED fittings, tutoring services, or essay proofreviews with ease.',
      highlight: '0% Platform Fee for Students',
      badge: 'Marketplace'
    },
    {
      icon: HeartHandshake,
      iconColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      title: 'Social & Academic Circles',
      description: 'Form study cohorts for hard modules, schedule neighborhood sunset running jogs, or orchestrate record swap meetups. Build belonging.',
      highlight: 'Active Student Orgs',
      badge: 'Community'
    },
    {
      icon: MessageCircle,
      iconColor: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
      title: 'Seamless Direct Messaging',
      description: 'Ask questions about classroom topics, align study group schedules, or securely negotiate pickup handoffs for marketplace transaction items.',
      highlight: 'Integrated secure inbox',
      badge: 'Direct Chat'
    }
  ];

  return (
    <section id="features" className="py-24 bg-[#fafbfc] border-t border-slate-200/80 relative">
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center px-3 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full text-xs font-mono uppercase tracking-wider mb-4"
          >
            The Konekt Framework
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-slate-900"
          >
            A Unified Hub for Campus Growth and Connection
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-slate-600 text-lg"
          >
            Students thrive when academic support, organic leadership opportunity, and casual social bonding exist in one secure, accessible ecosystem.
          </motion.p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pillars.map((pillar, idx) => {
            const IconComponent = pillar.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.1 }}
                className="group relative rounded-3xl p-8 bg-white hover:bg-slate-50/50 border border-slate-200/80 hover:border-indigo-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                {/* Visual Glow Effect on Hover */}
                <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div>
                  <div className="flex items-center justify-between">
                    <div className={`p-3.5 rounded-2xl border ${pillar.iconColor}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-slate-600 tracking-wide uppercase px-2.5 py-1 bg-slate-50 rounded-lg border border-slate-200">
                      {pillar.badge}
                    </span>
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl font-bold text-slate-900 mt-6 group-hover:text-indigo-650 transition-colors">
                    {pillar.title}
                  </h3>

                  <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-8 flex items-center justify-between">
                  <span className="text-xs font-semibold text-indigo-600 font-mono tracking-wider uppercase">
                    {pillar.highlight}
                  </span>
                  
                  <span className="p-1 px-3 text-xs font-medium text-slate-505 hover:text-slate-905 inline-flex items-center gap-1 transition-colors cursor-pointer">
                    Learn more
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
