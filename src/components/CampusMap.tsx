import { useState, useRef, MouseEvent, useEffect } from 'react';
import { MapPin, Search, Navigation, Info, ShieldCheck, Sparkles, Filter, CheckCircle, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface MapSpot {
  id: string;
  name: string;
  description: string;
  type: 'pickup' | 'meetup' | 'both';
  x: number; // percentage from left
  y: number; // percentage from top
  popularFor: string;
  iconBg: string;
}

export const CAMPUS_SPOTS: MapSpot[] = [
  {
    id: 'spot-union',
    name: 'Student Union Plaza',
    description: 'Bustling central cafe hub & lounge and prime exchange spot in front of the campus gates.',
    type: 'pickup',
    x: 62,
    y: 34,
    popularFor: 'Physical item transactions, coffee handovers, instant cash trades',
    iconBg: 'bg-emerald-550 border-emerald-400'
  },
  {
    id: 'spot-library',
    name: 'Central Quad Library',
    description: 'Quiet research corridors, peer tutoring desks, and main textbook swap shelves.',
    type: 'both',
    x: 38,
    y: 58,
    popularFor: 'Quiet study sessions, exam cheatsheet transfers, expert peer tutoring',
    iconBg: 'bg-indigo-650 border-indigo-400'
  },
  {
    id: 'spot-rotunda',
    name: 'Engineering Rotunda',
    description: 'Hardware prototyping suites, 3D printers, and campus technical workshops.',
    type: 'meetup',
    x: 24,
    y: 28,
    popularFor: 'Hackathon reviews, hardware part exchange, study groups',
    iconBg: 'bg-cyan-550 border-cyan-400'
  },
  {
    id: 'spot-science',
    name: 'Science Lab Plaza',
    description: 'Outdoor seating adjacent to chemical stores and biological laboratory blocks.',
    type: 'pickup',
    x: 78,
    y: 68,
    popularFor: 'Lab manual handovers, poster boards prep meetups',
    iconBg: 'bg-amber-550 border-amber-400'
  },
  {
    id: 'spot-hall',
    name: 'Academic Hall',
    description: 'Historic administrative columns and large lecture theater lobbies.',
    type: 'both',
    x: 18,
    y: 75,
    popularFor: 'General course handouts exchange, campus tours gathering',
    iconBg: 'bg-purple-550 border-purple-400'
  }
];

interface CampusMapProps {
  onSelectLocation?: (locationName: string) => void;
  onFilterLocation?: (locationName: string | null) => void;
  currentFilterLocation?: string | null;
  activeTab?: 'market' | 'groups' | 'resources' | 'chats';
}

export default function CampusMap({
  onSelectLocation,
  onFilterLocation,
  currentFilterLocation,
  activeTab = 'market'
}: CampusMapProps) {
  const [selectedSpot, setSelectedSpot] = useState<MapSpot | null>(CAMPUS_SPOTS[0]);
  const [customSpot, setCustomSpot] = useState<{ x: number; y: number; name: string } | null>(null);
  const [typingCustomName, setTypingCustomName] = useState(false);
  const [customNameInput, setCustomNameInput] = useState('East Entrance Benches');
  const [mapHoveredSpot, setMapHoveredSpot] = useState<MapSpot | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const handleMapClick = (e: MouseEvent<HTMLDivElement>) => {
    if (!mapContainerRef.current) return;
    
    // Prevent registering click if we clicked a marker specifically
    const target = e.target as HTMLElement;
    if (target.closest('.map-marker-btn')) {
      return;
    }

    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    // Keep within bounds
    const safeX = Math.max(2, Math.min(x, 98));
    const safeY = Math.max(2, Math.min(y, 98));

    setCustomSpot({
      x: safeX,
      y: safeY,
      name: customNameInput
    });
    setSelectedSpot(null);
    setTypingCustomName(true);
  };

  const saveCustomSpot = () => {
    if (customSpot) {
      const finalName = customNameInput.trim() || `Custom Spot (X: ${customSpot.x}%, Y: ${customSpot.y}%)`;
      const updated = { ...customSpot, name: finalName };
      setCustomSpot(updated);
      setTypingCustomName(false);
      
      if (onSelectLocation) {
        onSelectLocation(finalName);
      }
    }
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col md:flex-row h-[420px] shadow-2xl relative font-sans text-white">
      
      {/* Visual Canvas Panel */}
      <div className="flex-1 relative bg-slate-900 overflow-hidden select-none border-b md:border-b-0 md:border-r border-slate-800 flex items-center justify-center">
        
        {/* Fine Matrix grid backdrop */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#020617_1px,transparent_1px),linear-gradient(to_bottom,#020617_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />
        <div className="absolute inset-0 bg-radial-at-t from-indigo-950/20 via-slate-950/80 to-slate-950" />

        {/* Isometric Custom Campus Map Drawing */}
        <div 
          ref={mapContainerRef}
          onClick={handleMapClick}
          className="relative w-[92%] h-[92%] border border-slate-800/65 rounded-xl bg-slate-950/80 overflow-hidden cursor-crosshair group/map"
        >
          {/* Subtle outline representing campus zones */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            {/* Campus boundary walkway path */}
            <path d="M 10,10 L 90,15 L 95,85 L 15,90 Z" fill="none" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" className="opacity-40" />
            
            {/* Styled roads/walkways */}
            <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" className="opacity-50" />
            <line x1="50%" y1="10%" x2="50%" y2="90%" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" className="opacity-50" />
            <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" className="opacity-30" />
            <line x1="50%" y1="10%" x2="50%" y2="90%" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" className="opacity-30" />

            {/* Central Circle Rotunda walkthrough */}
            <circle cx="50%" cy="50%" r="32" fill="#0f172a" stroke="#1e293b" strokeWidth="4" className="opacity-80" />
            <circle cx="50%" cy="50%" r="28" fill="none" stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="3 3" className="opacity-30" />

            {/* Simulated Campus Building Outlines */}
            {/* Student Union Plaza block */}
            <rect x="58%" y="24%" width="12%" height="16%" rx="6" fill="#020617" stroke="#10b981" strokeWidth="1" className="opacity-40" />
            {/* Central Quad Library block */}
            <rect x="30%" y="50%" width="16%" height="14%" rx="6" fill="#020617" stroke="#4f46e5" strokeWidth="1" className="opacity-40" />
            {/* Engineering Rotunda block */}
            <rect x="18%" y="18%" width="12%" height="12%" rx="6" fill="#020617" stroke="#06b6d4" strokeWidth="1" className="opacity-40" />
            {/* Science Lab Plaza block */}
            <rect x="72%" y="58%" width="14%" height="16%" rx="6" fill="#020617" stroke="#f59e0b" strokeWidth="1" className="opacity-40" />
            {/* Academic Hall block */}
            <rect x="10%" y="68%" width="14%" height="14%" rx="6" fill="#020617" stroke="#a855f7" strokeWidth="1" className="opacity-40" />

            {/* Landscape elements */}
            <circle cx="20%" cy="45%" r="6" fill="#065f46" className="opacity-20" />
            <circle cx="78%" cy="20%" r="8" fill="#065f46" className="opacity-20" />
            <circle cx="74%" cy="26%" r="5" fill="#065f46" className="opacity-19" />
            <circle cx="85%" cy="30%" r="9" fill="#065f46" className="opacity-22" />
          </svg>

          {/* Map Compass / Help Note */}
          <div className="absolute bottom-2 left-2 text-[8.5px] text-slate-500 font-mono py-1 px-2 border border-slate-900/40 rounded-md bg-slate-950/60 select-none flex items-center gap-1.5">
            <Navigation className="w-2.5 h-2.5 text-indigo-500 transform -rotate-45" />
            <span>Konekt Campus Beta • Click grid for custom spot</span>
          </div>

          {/* Popular spots markers */}
          {CAMPUS_SPOTS.map((spot) => {
            const isSelected = selectedSpot?.id === spot.id;
            const isHovered = mapHoveredSpot?.id === spot.id;
            let themeColor = 'text-emerald-400';
            if (spot.id === 'spot-library') themeColor = 'text-indigo-400';
            else if (spot.id === 'spot-rotunda') themeColor = 'text-cyan-400';
            else if (spot.id === 'spot-science') themeColor = 'text-amber-400';
            else if (spot.id === 'spot-hall') themeColor = 'text-purple-400';

            const getPrimaryUse = (s: MapSpot) => {
              if (s.id === 'spot-union') return 'Ideal for item exchanges';
              if (s.id === 'spot-library') return 'Ideal for textbook swaps & studying';
              if (s.id === 'spot-rotunda') return 'Ideal for hardware & group meetups';
              if (s.id === 'spot-science') return 'Ideal for lab manual handovers';
              if (s.id === 'spot-hall') return 'Ideal for peer tutoring & meetups';
              return 'Ideal for exchanges & meetups';
            };

            return (
              <button
                key={spot.id}
                type="button"
                className="map-marker-btn absolute -translate-x-1/2 -translate-y-1/2 z-20 group/marker focus:outline-none"
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                onMouseEnter={() => setMapHoveredSpot(spot)}
                onMouseLeave={() => setMapHoveredSpot(null)}
                onClick={() => {
                  setSelectedSpot(spot);
                  setCustomSpot(null);
                  setTypingCustomName(false);
                  if (onSelectLocation) {
                    onSelectLocation(spot.name);
                  }
                }}
              >
                {/* Glow ring effect */}
                {isSelected ? (
                  <>
                    <span className="absolute inset-[-12px] rounded-full animate-ping opacity-40 bg-indigo-500" style={{ animationDuration: '1.2s' }} />
                    <span className="absolute inset-[-8px] rounded-full ring-2 ring-indigo-400 animate-pulse opacity-50 bg-indigo-500/20" />
                  </>
                ) : (
                  <span className="absolute inset-[-6px] rounded-full animate-ping opacity-25 bg-slate-400" style={{ animationDuration: '3s' }} />
                )}
                
                <span className={`absolute inset-[-4px] rounded-full opacity-60 transition-all scale-75 group-hover/marker:scale-110 ${
                  isSelected ? 'bg-indigo-600/45 ring-2 ring-indigo-400 scale-110' : 'bg-slate-950 ring-1 ring-slate-800'
                }`} />

                {/* Marker Pin */}
                <MapPin className={`transition-all duration-200 cursor-pointer ${
                  isSelected 
                    ? 'w-7 h-7 text-indigo-300 drop-shadow-[0_0_12px_rgba(99,102,241,1)] scale-125' 
                    : `${themeColor} w-5 h-5 opacity-85 group-hover/marker:opacity-100 group-hover/marker:scale-115`
                }`} />

                {/* Micro tooltip label snippet */}
                <div className={`absolute left-1/2 -translate-x-1/2 bottom-7 pointer-events-none transition-all duration-150 py-1.5 px-2.5 rounded-xl bg-slate-950 border text-[9px] tracking-wide font-sans shrink-0 select-none w-max max-w-[280px] shadow-xl z-50 text-center leading-normal ${
                  isSelected || isHovered
                    ? 'opacity-100 translate-y-0 scale-100 border-indigo-500/50 text-white' 
                    : 'opacity-0 translate-y-2 scale-90 border-slate-900 text-slate-500'
                }`}>
                  <div className="font-bold text-white text-[10.5px]">{spot.name}</div>
                  <div className="text-[8.5px] text-indigo-350 font-semibold mt-0.5 font-sans">
                    {getPrimaryUse(spot)}
                  </div>
                </div>
              </button>
            );
          })}

          {/* Interactive Custom spot placement marker */}
          {customSpot && (
            <div 
              className="absolute -translate-x-1/2 -translate-y-1/2 z-30"
              style={{ left: `${customSpot.x}%`, top: `${customSpot.y}%` }}
            >
              <div className="absolute inset-[-6px] bg-rose-500 rounded-full animate-ping opacity-40" />
              <MapPin className="w-5.5 h-5.5 text-rose-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              
              <div className="absolute left-1/2 -translate-x-1/2 bottom-5 pointer-events-none py-0.5 px-2 rounded bg-slate-950 border border-rose-500/40 text-[8.5px] font-mono text-rose-400 shrink-0 select-none w-max z-40">
                {customSpot.name || 'Precise Exchange Slot'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Control / Details Sidebar Panel */}
      <div className="w-full md:w-[260px] bg-slate-950 p-4 shrink-0 flex flex-col justify-between overflow-y-auto">
        
        {/* Spot presentation */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 border-b border-slate-900 pb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <h3 className="font-semibold text-xs text-white tracking-tight uppercase font-display">Exchange Locator</h3>
          </div>

          <AnimatePresence mode="wait">
            {selectedSpot ? (
              <motion.div
                key={selectedSpot.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-2.5 text-xs text-slate-350"
              >
                <div>
                  <h4 className="text-white font-bold inline-flex items-center gap-1.5 leading-snug">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" /> {selectedSpot.name}
                  </h4>
                  <p className="text-[10px] font-mono text-indigo-400 uppercase mt-0.5">Campus Spot</p>
                </div>

                <p className="leading-relaxed text-slate-400 text-[11px]">
                  {selectedSpot.description}
                </p>

                <div className="bg-slate-900 border border-slate-800/60 p-2.5 rounded-xl space-y-1">
                  <span className="text-[9px] font-bold uppercase tracking-wider font-mono text-slate-400 block">Popular Academic Action</span>
                  <p className="text-[10px] text-slate-300 font-medium leading-relaxed">
                    {selectedSpot.popularFor}
                  </p>
                </div>
                
                <div className="space-y-2 pt-1">
                  {onSelectLocation && (
                    <button
                      type="button"
                      onClick={() => onSelectLocation(selectedSpot.name)}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] uppercase font-mono font-bold rounded-xl transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Copy Spot to Form
                    </button>
                  )}

                  {onFilterLocation && (
                    <button
                      onClick={() => {
                        if (currentFilterLocation === selectedSpot.name) {
                          onFilterLocation(null);
                        } else {
                          onFilterLocation(selectedSpot.name);
                        }
                      }}
                      className={`w-full py-1.5 rounded-xl text-[10px] font-bold font-mono uppercase inline-flex items-center justify-center gap-2 border cursor-pointer transition-colors ${
                        currentFilterLocation === selectedSpot.name
                          ? 'bg-rose-950 border-rose-900/50 text-rose-400 hover:bg-rose-900/40'
                          : 'bg-indigo-600 border-indigo-550 text-white hover:bg-indigo-700'
                      }`}
                    >
                      <Filter className="w-3 h-3" />
                      {currentFilterLocation === selectedSpot.name ? 'Clear Map Filter' : `Filter to Spot Listings`}
                    </button>
                  )}
                </div>
              </motion.div>
            ) : customSpot ? (
              <motion.div
                key="custom-spot-details"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-3 text-xs"
              >
                <div className="bg-rose-950/20 border border-rose-900/20 p-2.5 rounded-xl">
                  <h4 className="text-rose-400 font-bold inline-flex items-center gap-1.5 select-none leading-snug">
                    <MapPin className="w-3.5 h-3.5" /> Customized Matchpoint
                  </h4>
                  <p className="text-[9px] font-mono text-rose-500 mt-1 uppercase">Coordinate Spot Specified</p>
                </div>

                {typingCustomName ? (
                  <div className="space-y-2">
                    <label className="block text-[9px] font-mono text-slate-400 uppercase font-bold">Custom Label / Spot Desk</label>
                    <input 
                      type="text"
                      className="w-full bg-slate-900 border border-slate-800 text-white text-xs px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-indigo-500"
                      value={customNameInput}
                      onChange={(e) => setCustomNameInput(e.target.value)}
                      placeholder="e.g. Quad North Fountain"
                      maxLength={32}
                    />
                    <button
                      type="button"
                      onClick={saveCustomSpot}
                      className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] uppercase font-mono font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Use Custom Target Spot
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 text-slate-350">
                    <h5 className="font-semibold text-white leading-normal">
                      Label: "{customSpot.name}"
                    </h5>
                    <p className="text-[10px] leading-relaxed">
                      Coordinates: <span className="text-rose-400 font-mono">X: {customSpot.x}% / Y: {customSpot.y}%</span> near the campus walking path. Ideal for private custom deliveries.
                    </p>
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => setTypingCustomName(true)}
                        className="w-full text-slate-400 hover:text-white bg-slate-900 border border-slate-800 text-[9px] uppercase font-mono tracking-wider py-1 rounded-lg"
                      >
                        Rename Spot Label
                      </button>
                      {onSelectLocation && (
                        <button
                          type="button"
                          onClick={() => onSelectLocation(customSpot.name)}
                          className="w-full text-emerald-400 bg-emerald-950 hover:bg-emerald-900 border border-emerald-900/40 text-[9px] uppercase font-mono tracking-wider py-1 rounded-lg inline-flex items-center justify-center gap-1"
                        >
                          <CheckCircle className="w-3 h-3" /> Copy Spot to Form
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="py-8 text-center text-slate-500 text-[11px] select-none">
                <p>Select any node or map area to load location data.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Sync/Form confirmation status info */}
        <div className="pt-3 border-t border-slate-900 mt-4 select-none">
          <div className="flex items-start gap-1.5 text-[10px] text-slate-500 leading-snug">
            <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
            <span>Clicking location pins updates and copies target spot names directly into your listing creators.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
