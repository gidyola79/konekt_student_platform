import { motion } from 'motion/react';
import { BookOpen, Star, RefreshCw, Layers, Shield, Sparkles, FolderDown } from 'lucide-react';

export default function AcademicSection() {
  const points = [
    {
      icon: Layers,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      title: 'Structured by Course Keys',
      desc: 'No more generic searching. Instantly look up exam notes, formula guides, and worksheets formatted by the EXACT course module code of your specific syllabus (e.g., MATH202, CS110).'
    },
    {
      icon: Star,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      title: 'Reputation & Quality Scores',
      desc: 'Our student community rates every single uploaded PDF or study document. You can clearly review, download top-rated guidelines, and check peer satisfaction before studying.'
    },
    {
      icon: Shield,
      color: 'text-cyan-600 bg-cyan-50 border-cyan-100',
      title: 'Free Academic Exchanges',
      desc: 'Contribute notes to build academic credits, or browse public assets uploaded by upperclassmen looking to help their cohort. Build collaborative, open reference hubs.'
    }
  ];

  return (
    <section id="resources" className="py-24 bg-transparent border-t border-slate-205 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
          
          {/* Right Visual Sandbox Display */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="relative rounded-3xl p-6 sm:p-8 bg-white border border-slate-200 shadow-lg backdrop-blur-md">
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-650">
                    <BookOpen className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-slate-900 text-sm">Exam Resource Repository</h4>
                    <p className="text-[10px] text-slate-500">Live community uploaded educational files</p>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-cyan-700 uppercase bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                  MATH & SCi VAULT
                </span>
              </div>

              {/* Sample Document List */}
              <div className="space-y-4 mt-6">
                <div className="p-3 bg-slate-50 border border-slate-150 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-mono bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">CS220</span>
                    <h5 className="font-display font-semibold text-slate-900 text-sm mt-1">Sorting & Graph Algorithms Matrix</h5>
                    <p className="text-[10px] text-slate-500 mt-1">Uploaded by Sarah • 84 downloads • ⭐ 5.0</p>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-950 hover:bg-slate-50 transition-colors cursor-pointer shadow-sm">
                    <FolderDown className="w-4 h-4" />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-150 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-mono bg-indigo-105 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">MATH202</span>
                    <h5 className="font-display font-semibold text-slate-900 text-sm mt-1">Cheat Sheets of Double & Triple Integrals</h5>
                    <p className="text-[10px] text-slate-500 mt-1">Uploaded by David • 112 downloads • ⭐ 4.9</p>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-205 text-slate-500 hover:text-slate-955 hover:bg-slate-50 transition-colors cursor-pointer shadow-sm">
                    <FolderDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Simulated Global Feed stats */}
              <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5 text-indigo-600 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>Updates every class period</span>
                </div>
                <span>4.8k downloads this term</span>
              </div>
            </div>

            {/* Float decal */}
            <div className="absolute -top-6 -left-6 p-4 rounded-2xl bg-white border border-slate-200 shadow-2xl flex items-center gap-3 scale-90 sm:scale-100 backdrop-blur-md">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-ping" />
              <div className="text-xs font-mono text-slate-500">
                Popular: <span className="text-slate-950 font-bold">PHYS101 Final review</span>
              </div>
            </div>
          </motion.div>

          {/* Left Text Detail */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full text-xs font-mono uppercase tracking-wider mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Coordinated Study Networks
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900"
            >
              Crowdsourced Academic Vaults curated by classmates
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 text-slate-650 text-base sm:text-lg leading-relaxed"
            >
              Stop wastefully scrubbing random internet forums for lecture slides. Konekt consolidates educational structures by course code. Find study outlines written by students who took the precise midterm exam.
            </motion.p>

            {/* Vertical points */}
            <div className="grid grid-cols-1 gap-6 mt-10">
              {points.map((pt, index) => {
                const Icon = pt.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex gap-4"
                  >
                    <div className={`p-3.5 rounded-xl border shrink-0 h-fit ${pt.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-slate-900 text-base">{pt.title}</h4>
                      <p className="text-slate-600 text-xs sm:text-sm mt-1.5 leading-relaxed">{pt.desc}</p>
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
