import React, { useState } from 'react';
import { ArrowRightLeft, Scale, Plus } from 'lucide-react';
import { UNIT_CATEGORIES, convertUnits } from '../utils/constantsAndUnits';
import { formatResult } from '../utils/mathParser';

interface UnitConverterProps {
  onInsertValue: (valStr: string) => void;
}

export const UnitConverter: React.FC<UnitConverterProps> = ({ onInsertValue }) => {
  const [selectedCatId, setSelectedCatId] = useState<string>('length');
  const [amountStr, setAmountStr] = useState<string>('1');

  const currentCat = UNIT_CATEGORIES.find((c) => c.id === selectedCatId) || UNIT_CATEGORIES[0];
  const [fromUnitId, setFromUnitId] = useState<string>(currentCat.units[0].id);
  const [toUnitId, setToUnitId] = useState<string>(currentCat.units[1]?.id || currentCat.units[0].id);

  // If category changes, update unit selections
  const handleCategoryChange = (catId: string) => {
    setSelectedCatId(catId);
    const cat = UNIT_CATEGORIES.find((c) => c.id === catId);
    if (cat && cat.units.length >= 2) {
      setFromUnitId(cat.units[0].id);
      setToUnitId(cat.units[1].id);
    }
  };

  const handleSwap = () => {
    const prevFrom = fromUnitId;
    setFromUnitId(toUnitId);
    setToUnitId(prevFrom);
  };

  const amountNum = parseFloat(amountStr) || 0;
  const converted = convertUnits(selectedCatId, fromUnitId, toUnitId, amountNum);
  const formattedConverted = formatResult(converted);

  const fromUnit = currentCat.units.find((u) => u.id === fromUnitId);
  const toUnit = currentCat.units.find((u) => u.id === toUnitId);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <Scale className="w-4 h-4 text-cyan-400" />
          <span>Precision Unit Converter</span>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-3 scrollbar-none text-[11px]">
        {UNIT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleCategoryChange(cat.id)}
            className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              selectedCatId === cat.id
                ? 'bg-cyan-500/20 text-cyan-300 font-medium border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Converter Body */}
      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
        {/* From Box */}
        <div className="p-3 rounded-xl bg-[#121A2A] border border-slate-800 flex flex-col gap-2">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>From</span>
            <span className="font-mono text-cyan-400">{fromUnit?.symbol}</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="number"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              className="flex-1 bg-[#182238] border border-slate-700/80 rounded-lg px-3 py-1.5 text-slate-100 font-mono text-base focus:outline-none focus:border-cyan-500"
              placeholder="0"
            />
            <select
              value={fromUnitId}
              onChange={(e) => setFromUnitId(e.target.value)}
              className="bg-[#182238] border border-slate-700/80 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer max-w-[130px] truncate"
            >
              {currentCat.units.map((u) => (
                <option key={u.id} value={u.id} className="bg-slate-900 text-white">
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button Divider */}
        <div className="flex justify-center -my-1">
          <button
            type="button"
            onClick={handleSwap}
            className="p-1.5 rounded-full bg-[#182238] border border-slate-700 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-all shadow-md active:scale-95 cursor-pointer"
            title="Swap Units"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* To Box */}
        <div className="p-3 rounded-xl bg-[#121A2A] border border-slate-800 flex flex-col gap-2">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>To</span>
            <span className="font-mono text-cyan-400">{toUnit?.symbol}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 bg-[#182238] border border-slate-700/80 rounded-lg px-3 py-1.5 text-slate-100 font-mono text-base truncate select-all">
              {formattedConverted}
            </div>
            <select
              value={toUnitId}
              onChange={(e) => setToUnitId(e.target.value)}
              className="bg-[#182238] border border-slate-700/80 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer max-w-[130px] truncate"
            >
              {currentCat.units.map((u) => (
                <option key={u.id} value={u.id} className="bg-slate-900 text-white">
                  {u.name} ({u.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Button: Insert to Calculator */}
        <button
          type="button"
          onClick={() => onInsertValue(formattedConverted.replace(/,/g, ''))}
          className="w-full py-2.5 px-3 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-800/40 text-cyan-300 hover:text-cyan-200 text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Insert Result into Calculator ({formattedConverted})</span>
        </button>
      </div>
    </div>
  );
};
