import React from 'react';
import { Trash2, Copy, ArrowUpLeft, History as HistoryIcon } from 'lucide-react';
import { CalculationRecord } from '../types/calculator';

interface HistoryPanelProps {
  records: CalculationRecord[];
  onSelectExpression: (expression: string) => void;
  onInsertResult: (resultStr: string) => void;
  onClearHistory: () => void;
  onDeleteRecord: (id: string) => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  records,
  onSelectExpression,
  onInsertResult,
  onClearHistory,
  onDeleteRecord,
}) => {
  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text.replace(/,/g, ''));
    } catch {
      // fallback
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header with Title and Clear Action */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
          <HistoryIcon className="w-4 h-4 text-cyan-400" />
          <span>Calculation Tape</span>
          <span className="text-xs text-slate-500 font-mono font-normal">({records.length})</span>
        </div>
        {records.length > 0 && (
          <button
            type="button"
            onClick={onClearHistory}
            className="text-xs text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-rose-500/10 cursor-pointer"
            title="Clear all calculation history"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* History Items List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {records.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <HistoryIcon className="w-8 h-8 text-slate-700 mb-2 stroke-[1.5]" />
            <p className="text-sm font-medium text-slate-400">No calculations yet</p>
            <p className="text-xs text-slate-600 mt-1 max-w-[200px]">
              Evaluated expressions and answers will be saved here automatically.
            </p>
          </div>
        ) : (
          records.map((rec) => (
            <div
              key={rec.id}
              className="p-3 rounded-xl bg-[#121A2A] border border-slate-800/80 hover:border-slate-700/80 transition-all group flex flex-col gap-1.5 relative shadow-sm"
            >
              {/* Timestamp & Tag */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span className="text-slate-400">{formatTime(rec.timestamp)}</span>
                <span className="text-cyan-500/80 uppercase text-[10px] bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-900/30">
                  {rec.angleMode}
                </span>
              </div>

              {/* Expression Line (Click to load expression) */}
              <button
                type="button"
                onClick={() => onSelectExpression(rec.expression)}
                className="text-left font-mono text-sm text-slate-300 hover:text-cyan-300 transition-colors truncate flex items-center justify-between gap-2 group-hover:underline cursor-pointer"
                title="Click to reload expression into calculator"
              >
                <span className="truncate">{rec.expression} =</span>
                <ArrowUpLeft className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-cyan-400 shrink-0 transition-opacity" />
              </button>

              {/* Result Line (Click to insert result) */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/40">
                <button
                  type="button"
                  onClick={() => onInsertResult(rec.formattedResult)}
                  className="font-mono text-base font-bold text-white hover:text-amber-300 transition-colors text-right cursor-pointer truncate"
                  title="Click to insert result into current expression"
                >
                  {rec.formattedResult}
                </button>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(rec.formattedResult)}
                    className="p-1 rounded text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                    title="Copy result"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteRecord(rec.id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
