import React, { useState } from 'react';
import { Search, Plus, Atom } from 'lucide-react';
import { SCIENTIFIC_CONSTANTS, ScientificConstant } from '../utils/constantsAndUnits';

interface ConstantsSheetProps {
  onInsertConstant: (constant: ScientificConstant) => void;
}

export const ConstantsSheet: React.FC<ConstantsSheetProps> = ({ onInsertConstant }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Universal', 'Physics', 'Chemistry', 'Atomic'];

  const filtered = SCIENTIFIC_CONSTANTS.filter((c) => {
    const matchesCat = selectedCategory === 'All' || c.category === selectedCategory;
    const query = search.toLowerCase();
    const matchesSearch =
      c.name.toLowerCase().includes(query) ||
      c.symbol.toLowerCase().includes(query) ||
      c.unit.toLowerCase().includes(query);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <Atom className="w-4 h-4 text-cyan-400" />
          <span>Scientific Constants</span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-2">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search constants (e.g. Planck, c, G)..."
          className="w-full bg-[#121A2A] border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-cyan-500/60 transition-colors"
        />
      </div>

      {/* Category Pills (Functional interactive tabs) */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-2 scrollbar-none text-[11px]">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === cat
                ? 'bg-cyan-500/20 text-cyan-300 font-medium border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Constants List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No matching constants found.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.symbol}
              onClick={() => onInsertConstant(item)}
              className="p-2.5 rounded-xl bg-[#121A2A] border border-slate-800/80 hover:border-cyan-500/40 hover:bg-[#162238] transition-all cursor-pointer group flex items-center justify-between gap-3 shadow-sm"
              title={`Click to insert ${item.symbol} (${item.valueStr})`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-cyan-400 group-hover:text-cyan-300">
                    {item.symbol}
                  </span>
                  <span className="text-xs text-slate-300 font-medium truncate">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 text-[11px] font-mono text-slate-400">
                  <span className="text-slate-200 font-semibold">{item.valueStr}</span>
                  <span className="text-slate-500 font-sans">{item.unit}</span>
                </div>
              </div>

              <button
                type="button"
                className="shrink-0 p-1.5 rounded-lg bg-cyan-950/40 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors"
                title="Insert value into formula"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
