import React, { useState, useEffect, useMemo } from 'react';

const APP_TITLE = 'MaxLift Tracker';
const STORAGE_KEY = 'maxlift_v3';
const CATEGORIES = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio', 'Other'];

const DEFAULT_EXERCISES = [
  { id: 'c1', name: 'Barbell Bench Press', category: 'Chest', currentWeight: 0, maxWeight: 0, unit: 'kg', date: null, history: [] },
  { id: 'c2', name: 'Incline Dumbbell Press', category: 'Chest', currentWeight: 0, maxWeight: 0, unit: 'kg', date: null, history: [] },
  { id: 'c3', name: 'Dips', category: 'Chest', currentWeight: 0, maxWeight: 0, unit: 'reps', date: null, history: [] }, 
  { id: 'b1', name: 'Deadlift (Conventional)', category: 'Back', currentWeight: 0, maxWeight: 0, unit: 'kg', date: null, history: [] },
  { id: 'b2', name: 'Barbell Row', category: 'Back', currentWeight: 0, maxWeight: 0, unit: 'kg', date: null, history: [] },
  { id: 'b3', name: 'Pull-Ups', category: 'Back', currentWeight: 0, maxWeight: 0, unit: 'reps', date: null, history: [] }, 
  { id: 'l1', name: 'Back Squat', category: 'Legs', currentWeight: 0, maxWeight: 0, unit: 'kg', date: null, history: [] },
  { id: 's1', name: 'Overhead Press (Military)', category: 'Shoulders', currentWeight: 0, maxWeight: 0, unit: 'kg', date: null, history: [] },
  { id: 'o1', name: 'Press-Ups (Push-Ups)', category: 'Other', currentWeight: 0, maxWeight: 0, unit: 'reps', date: null, history: [] }, 
];

function Icon({ children, size = 24, className = "", onClick }: { children: React.ReactNode, size?: number, className?: string, onClick?: () => void }) {
    return (
        <svg onClick={onClick} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            {children}
        </svg>
    );
}

const Trophy = (p: any) => <Icon {...p}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M3 9v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9"/><path d="M12 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/></Icon>;
const Search = (p: any) => <Icon {...p}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></Icon>;
const Plus = (p: any) => <Icon {...p}><path d="M12 5v14"/><path d="M5 12h14"/></Icon>;
const X = (p: any) => <Icon {...p}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></Icon>;
const XCircle = (p: any) => <Icon {...p}><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></Icon>;
const Save = (p: any) => <Icon {...p}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></Icon>;
const TrendingUp = (p: any) => <Icon {...p}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></Icon>;
const AlertCircle = (p: any) => <Icon {...p}><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></Icon>;
const HistoryIcon = (p: any) => <Icon {...p}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></Icon>;
const Trash2 = (p: any) => <Icon {...p}><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></Icon>;
const SettingsIcon = (p: any) => <Icon {...p}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></Icon>;
const Download = (p: any) => <Icon {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></Icon>;
const Upload = (p: any) => <Icon {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></Icon>;

function ExerciseCard({ exercise, onClick }: { exercise: any, onClick: () => void }) {
    const history = exercise.history || [];
    const displayWeight = exercise.currentWeight || 0;
    const maxWeight = exercise.maxWeight || 0;
    const isPB = history.length > 0 && displayWeight >= maxWeight && displayWeight > 0;

    return (
        <div onClick={onClick} className="bg-slate-800/50 border border-slate-800 p-4 rounded-2xl flex items-center justify-between active:scale-95 transition-all cursor-pointer">
            <div className="flex-1 min-w-0 pr-4">
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-1">{exercise.category}</p>
                <h3 className="text-white font-bold text-lg truncate leading-tight">{exercise.name}</h3>
                <p className="text-xs text-slate-500 mt-1">
                    {exercise.date ? `Last: ${new Date(exercise.date).toLocaleDateString()}` : 'No logs yet'}
                </p>
            </div>
            <div className="text-right flex flex-col items-end">
                <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-black ${displayWeight > 0 ? 'text-white' : 'text-slate-700'}`}>
                        {displayWeight}
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{exercise.unit}</span>
                </div>
                {isPB && (
                    <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full mt-1">
                        <TrendingUp size={10} /> PB
                    </div>
                )}
            </div>
        </div>
    );
}

function ConfirmModal({ message, onConfirm, onCancel }: { message: string, onConfirm: () => void, onCancel: () => void }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-800 w-full max-w-xs rounded-2xl border border-slate-700 p-6 shadow-2xl">
               <h3 className="text-xl font-bold text-red-400 mb-2 flex items-center gap-2"><AlertCircle size={24}/> Confirm</h3>
               <p className="text-slate-300 text-sm mb-6">{message}</p>
               <div className="flex gap-3">
                    <button onClick={onCancel} className="flex-1 py-3 rounded-xl font-bold text-slate-400 bg-slate-700 outline-none">Cancel</button>
                    <button onClick={onConfirm} className="flex-1 py-3 rounded-xl font-bold text-white bg-red-600 outline-none">Delete</button>
               </div>
            </div>
        </div>
    );
}

function SettingsModal({ onClose, onExport, onImport }: { onClose: () => void, onExport: () => void, onImport: (e: any) => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center align-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 w-full max-w-sm rounded-3xl border border-slate-800 p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2"><SettingsIcon size={20}/> Settings</h2>
                    <button onClick={onClose} className="text-slate-500 outline-none"><X size={24} /></button>
                </div>
                <div className="space-y-4">
                    <button onClick={onExport} className="w-full flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 rounded-2xl text-white font-bold transition-colors outline-none">
                        <span className="flex items-center gap-3"><Download size={20} className="text-blue-500"/> Export Backup</span>
                        <span className="text-[10px] text-slate-500 font-normal">.json</span>
                    </button>
                    <label className="w-full flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 rounded-2xl text-white font-bold transition-colors cursor-pointer outline-none">
                        <span className="flex items-center gap-3"><Upload size={20} className="text-emerald-500"/> Import Data</span>
                        <input type="file" accept=".json" onChange={onImport} className="hidden" />
                        <span className="text-[10px] text-slate-500 font-normal">Select file</span>
                    </label>
                </div>
            </div>
        </div>
    )
}

function UpdateWeightModal({ exercise, onClose, onSave, onDeleteRequest, onDeleteHistoryItem }: { exercise: any, onClose: () => void, onSave: (id: string, val: string, unit: string) => void, onDeleteRequest: (id: string) => void, onDeleteHistoryItem: (id: string, ts: string) => void }) {
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState(exercise.unit); 
  const [showHistory, setShowHistory] = useState(false);
  const history = exercise.history || [];

  return (
    <div className="fixed inset-0 z-[50] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-hidden">
      <div className="bg-slate-900 w-full max-w-sm rounded-3xl border border-slate-800 p-6 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col shadow-2xl">
        <div className="flex justify-between items-start mb-6 shrink-0">
            <div>
                <p className="text-xs text-blue-400 font-bold uppercase">{exercise.category}</p>
                <h2 className="text-xl font-bold text-white leading-tight">{exercise.name}</h2>
            </div>
            <button onClick={onClose} className="text-slate-500 shrink-0 ml-4 p-1 active:bg-slate-800 rounded-full outline-none"><X size={24} /></button>
        </div>
        
        <div className="overflow-y-auto custom-scrollbar flex-1 pb-2">
            {!showHistory ? (
              <>
                <div className="flex items-stretch gap-3 mb-8 h-20">
                    <input 
                      type="number" 
                      inputMode="decimal"
                      value={value} 
                      onChange={e => setValue(e.target.value)} 
                      placeholder={exercise.currentWeight || "0"} 
                      autoFocus 
                      className="flex-1 min-w-0 bg-slate-800 text-white text-4xl font-black rounded-2xl border-2 border-transparent focus:border-blue-600 text-center outline-none appearance-none" 
                    />
                    <div className="flex flex-col gap-2 w-20">
                        {['kg', 'reps'].map(u => (
                            <button 
                              key={u} 
                              onClick={() => setUnit(u)} 
                              className={`flex-1 rounded-xl text-xs font-bold uppercase transition-colors ${unit === u ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'} outline-none`}
                            >
                              {u}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex gap-3">
                        <button onClick={() => onDeleteRequest(exercise.id)} className="flex-1 py-4 rounded-xl font-bold text-red-400 bg-red-900/10 active:bg-red-900/20 outline-none">Delete</button>
                        <button onClick={() => onSave(exercise.id, value, unit)} className="flex-[2] py-4 rounded-xl font-bold text-white bg-blue-600 active:bg-blue-700 flex items-center justify-center gap-2 outline-none">
                            <Save size={20}/> Save Log
                        </button>
                    </div>
                    <button onClick={() => setShowHistory(true)} className="w-full py-3 rounded-xl font-bold text-slate-400 bg-slate-800 flex items-center justify-center gap-2 text-sm active:bg-slate-700 outline-none">
                        <HistoryIcon size={16}/> View History ({history.length})
                    </button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between sticky top-0 bg-slate-900 py-2 z-10">
                    <h3 className="text-white font-bold flex items-center gap-2"><HistoryIcon size={18} className="text-blue-500"/> Activity Log</h3>
                    <button onClick={() => setShowHistory(false)} className="text-xs text-blue-400 font-bold uppercase px-2 py-1 active:bg-blue-900/20 rounded outline-none">Back</button>
                </div>
                <div className="space-y-2">
                    {history.length === 0 ? (
                        <p className="text-slate-600 text-sm italic text-center py-8">No logs yet.</p>
                    ) : (
                        history.slice().reverse().map((log: any) => {
                            const isMaxInHistory = log.weight >= exercise.maxWeight && log.weight > 0;
                            return (
                                <div key={log.timestamp} className="flex items-center justify-between p-3 bg-slate-800/40 rounded-xl border border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <p className="text-white font-black">{log.weight}<span className="text-[10px] text-slate-500 uppercase ml-1">{log.unit}</span></p>
                                            <p className="text-[10px] text-slate-500 uppercase">{new Date(log.timestamp).toLocaleDateString()}</p>
                                        </div>
                                        {isMaxInHistory && <TrendingUp size={12} className="text-emerald-500" />}
                                    </div>
                                    <button onClick={() => onDeleteHistoryItem(exercise.id, log.timestamp)} className="p-2 text-slate-600 hover:text-red-400 transition-colors outline-none">
                                        <Trash2 size={16}/>
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}

function AddExerciseModal({ onClose, onAdd, categories }: { onClose: () => void, onAdd: (n: string, c: string, u: string) => void, categories: string[] }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Other');
  const [unit, setUnit] = useState('kg');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 w-full max-w-sm rounded-3xl border border-slate-800 p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Add Exercise</h2>
            <button onClick={onClose} className="text-slate-500 outline-none"><X size={24} /></button>
        </div>
        <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Exercise name..." className="w-full bg-slate-800 text-white p-4 rounded-xl mb-4 border-2 border-transparent focus:border-blue-600 outline-none" />
        <div className="grid grid-cols-3 gap-2 mb-4">
            {categories.filter(c => c !== 'All').map(cat => (
                <button key={cat} onClick={() => setCategory(cat)} className={`p-2 rounded-lg text-[10px] font-bold border transition-all ${category === cat ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-800 border-slate-700 text-slate-500'} outline-none`}>{cat}</button>
            ))}
        </div>
        <div className="flex gap-2 mb-6 h-12">
            {['kg', 'reps'].map(u => (
                <button key={u} onClick={() => setUnit(u)} className={`flex-1 rounded-lg text-xs font-bold uppercase transition-colors ${unit === u ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'} outline-none`}>{u}</button>
            ))}
        </div>
        <button onClick={() => onAdd(name, category, unit)} disabled={!name} className="w-full py-4 rounded-xl font-bold text-white bg-blue-600 disabled:opacity-50 active:bg-blue-700 outline-none">Create</button>
      </div>
    </div>
  );
}

export default function App() {
  const [exercises, setExercises] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_EXERCISES;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [editingExercise, setEditingExercise] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [confirmState, setConfirmState] = useState<any>({ isOpen: false, id: null });

  useEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(exercises)), [exercises]);

  const filtered = useMemo(() => {
    return exercises.filter((ex: any) => (selectedCategory === 'All' || ex.category === selectedCategory) && 
      ex.name.toLowerCase().includes(searchQuery.toLowerCase()))
      .sort((a: any, b: any) => (b.date !== null) - (a.date !== null) || a.name.localeCompare(b.name));
  }, [exercises, searchQuery, selectedCategory]);

  const updateWeight = (id: string, val: string, unit: string) => {
    if (!val) { setEditingExercise(null); return; };
    const numVal = parseFloat(val);
    setExercises((prev: any[]) => prev.map(ex => {
      if (ex.id === id) {
        const history = Array.isArray(ex.history) ? [...ex.history] : [];
        
        const newLog = { 
            weight: numVal, 
            unit, 
            timestamp: new Date().toISOString() 
        };
        
        const newHistory = [...history, newLog];
        const newMax = Math.max(...newHistory.map(h => h.weight));
        
        return { 
          ...ex, 
          currentWeight: numVal,
          maxWeight: newMax,
          unit, 
          date: newLog.timestamp, 
          history: newHistory 
        };
      }
      return ex;
    }));
    setEditingExercise(null);
  };

  const deleteHistoryItem = (exId: string, timestamp: string) => {
    setExercises((prev: any[]) => prev.map(ex => {
      if (ex.id === exId) {
        const history = Array.isArray(ex.history) ? ex.history : [];
        const newHistory = history.filter(h => h.timestamp !== timestamp);
        const newMax = newHistory.length > 0 ? Math.max(...newHistory.map(h => h.weight)) : 0;
        const latest = newHistory.length > 0 ? newHistory[newHistory.length - 1] : null;
        
        const updated = { 
          ...ex, 
          history: newHistory, 
          maxWeight: newMax, 
          currentWeight: latest ? latest.weight : 0,
          date: latest ? latest.timestamp : null,
          unit: latest ? latest.unit : ex.unit
        };
        if (editingExercise?.id === exId) setEditingExercise(updated);
        return updated;
      }
      return ex;
    }));
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exercises, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `maxlift_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (event: any) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      try {
        let imported = JSON.parse(e.target.result);
        
        const sanitized = imported.map((ex: any) => {
            const history = Array.isArray(ex.history) ? ex.history : [];
            
            if (history.length === 0 && (ex.maxWeight > 0 || ex.currentWeight > 0)) {
                history.push({
                    weight: ex.maxWeight || ex.currentWeight,
                    unit: ex.unit || 'kg',
                    timestamp: ex.date || new Date().toISOString()
                });
            }

            return {
                ...ex,
                history,
                maxWeight: history.length > 0 ? Math.max(...history.map((h: any) => h.weight)) : (ex.maxWeight || 0),
                currentWeight: history.length > 0 ? history[history.length - 1].weight : (ex.currentWeight || 0)
            };
        });

        setExercises(sanitized);
        setIsSettingsOpen(false);
      } catch (err) { 
          console.error("Import error", err); 
          alert("Failed to import. Ensure the file is a valid JSON backup.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-md mx-auto h-full flex flex-col relative overflow-hidden">
      <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md p-4 space-y-4 border-b border-slate-800 shrink-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Trophy size={20} className="text-blue-500" />
            <h1 className="text-xl font-black text-white">{APP_TITLE}</h1>
          </div>
          <div className="flex gap-2">
              <button onClick={() => setIsSettingsOpen(true)} className="p-2 bg-slate-800 text-slate-400 rounded-full active:scale-95 outline-none"><SettingsIcon size={24}/></button>
              <button onClick={() => setIsAddModalOpen(true)} className="p-2 bg-blue-600 text-white rounded-full active:scale-95 outline-none"><Plus size={24}/></button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input type="text" placeholder="Search exercises..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-slate-800 text-white pl-10 pr-10 py-3 rounded-xl border-2 border-transparent focus:border-blue-600 outline-none" />
          {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-white outline-none">
                <XCircle size={20} fill="currentColor" className="text-slate-700 hover:text-slate-500" />
              </button>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-500'} outline-none`}>{cat}</button>
          ))}
        </div>
      </header>

      <main className="px-4 py-4 space-y-3 flex-1 overflow-y-auto">
        {filtered.map((ex: any) => <ExerciseCard key={ex.id} exercise={ex} onClick={() => setEditingExercise(ex)} />)}
        {filtered.length === 0 && <div className="py-20 text-center text-slate-600 italic">No exercises found.</div>}
      </main>

      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} onExport={handleExport} onImport={handleImport} />}
      {editingExercise && (
        <UpdateWeightModal 
            exercise={editingExercise} 
            onClose={() => setEditingExercise(null)} 
            onSave={updateWeight} 
            onDeleteHistoryItem={deleteHistoryItem} 
            onDeleteRequest={id => { setEditingExercise(null); setConfirmState({ isOpen: true, id }); }} 
        />
      )}
      {isAddModalOpen && <AddExerciseModal onClose={() => setIsAddModalOpen(false)} onAdd={(n, c, u) => { setExercises([...exercises, { id: Date.now().toString(), name: n, category: c, currentWeight: 0, maxWeight: 0, unit: u, date: null, history: [] }]); setIsAddModalOpen(false); }} categories={CATEGORIES} />}
      {confirmState.isOpen && <ConfirmModal message="Remove this exercise and all its history forever?" onConfirm={() => { setExercises(exercises.filter((e: any) => e.id !== confirmState.id)); setConfirmState({ isOpen: false, id: null }); }} onCancel={() => setConfirmState({ isOpen: false, id: null })} />}
    </div>
  );
}
