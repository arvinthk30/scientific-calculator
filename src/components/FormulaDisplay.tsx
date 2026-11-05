import React, { useRef, useEffect, useState } from 'react';
import { Copy, Check, Delete, RotateCcw } from 'lucide-react';
import { AngleMode } from '../utils/mathParser';
import { MemoryState } from '../types/calculator';

interface FormulaDisplayProps {
  expression: string;
  onExpressionChange: (expr: string, cursorPosition?: number) => void;
  result: string | null;
  error: string | null;
  livePreview: string | null;
  angleMode: AngleMode;
  onToggleAngleMode: () => void;
  memory: MemoryState;
  onClear: () => void;
  onBackspace: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export const FormulaDisplay: React.FC<FormulaDisplayProps> = ({
  expression,
  onExpressionChange,
  result,
  error,
  livePreview,
  angleMode,
  onToggleAngleMode,
  memory,
  onClear,
  onBackspace,
  inputRef,
}) => {
  const [copied, setCopied] = useState(false);

  // Compute open/close parentheses count
  const openParens = (expression.match(/\(/g) || []).length;
  const closeParens = (expression.match(/\)/g) || []).length;
  const parenBalance = openParens - closeParens;

  const handleCopy = async () => {
    const textToCopy = result || livePreview || expression;
    if (!textToCopy) return;
    try {
      await navigator.clipboard.writeText(textToCopy.replace(/,/g, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onExpressionChange(e.target.value, e.target.selectionStart || undefined);
  };

  return (
    <div className="bg-[#0D1424] border border-[#1E293B] rounded-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-xl shadow-black/40 relative overflow-hidden">
      {/* Background Subtle Technical Grid Accent */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #06B6D4 1px, transparent 0)',
          backgroundSize: '16px 16px'
        }}
      />

      {/* Top Status & Telemetry HUD */}
      <div className="flex items-center justify-between text-xs text-slate-400 select-none border-b border-slate-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          {/* Angle Mode Toggle */}
          <button
            type="button"
            onClick={onToggleAngleMode}
            className={`px-2.5 py-1 rounded-md font-mono text-xs font-semibold tracking-wider transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
              angleMode === 'deg'
                ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/40 shadow-sm shadow-cyan-950'
                : 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/40 shadow-sm shadow-indigo-950'
            }`}
            title={`Click to switch to ${angleMode === 'deg' ? 'Radian' : 'Degree'} mode`}
          >
            <span>{angleMode.toUpperCase()}</span>
            <span className="text-[10px] text-slate-500 font-sans">
              ({angleMode === 'deg' ? '360°' : '2π'})
            </span>
          </button>

          {/* Memory Active Status */}
          <div
            className={`px-2 py-0.5 rounded text-[11px] font-mono tracking-wide transition-colors ${
              memory.isSet
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-600 border border-transparent'
            }`}
            title={memory.isSet ? `Memory: ${memory.value}` : 'Memory register is empty'}
          >
            M: {memory.isSet ? memory.value : '0'}
          </div>

          {/* Parentheses Balance Indicator */}
          {parenBalance !== 0 && (
            <div className="text-[11px] font-mono text-amber-400/80 flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded">
              <span>( {parenBalance > 0 ? `+${parenBalance}` : parenBalance} )</span>
            </div>
          )}
        </div>

        {/* Quick Clear & Backspace on display header */}
        <div className="flex items-center gap-1.5">
          {expression.length > 0 && (
            <>
              <button
                type="button"
                onClick={onBackspace}
                className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                title="Backspace (⌫)"
                aria-label="Backspace"
              >
                <Delete className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onClear}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="All Clear (AC / Esc)"
                aria-label="Clear formula"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </>
          )}

          {(result || livePreview) && (
            <button
              type="button"
              onClick={handleCopy}
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors relative"
              title="Copy result to clipboard"
              aria-label="Copy result"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Formula Input Bar (Interactive & Cursor-aware) */}
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={expression}
          onChange={handleInputChange}
          placeholder="0"
          className="w-full bg-transparent font-mono text-xl sm:text-2xl text-slate-100 placeholder:text-slate-600 focus:outline-none tracking-wide text-right selection:bg-cyan-500/40"
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
      </div>

      {/* Result Display & Live Preview */}
      <div className="min-h-[44px] flex items-baseline justify-between gap-4 pt-1 border-t border-slate-800/40">
        {/* Live Preview (Subtle preview while typing formula) */}
        <div className="flex-1 truncate text-xs sm:text-sm font-mono text-cyan-400/70 select-none">
          {!error && livePreview && livePreview !== result && expression.trim().length > 0 && (
            <span className="flex items-center gap-1.5 animate-in fade-in duration-150">
              <span className="text-slate-500 font-sans">Preview:</span>
              <span className="text-cyan-300 font-semibold">{livePreview}</span>
            </span>
          )}
          {error && (
            <span className="text-rose-400 font-sans text-xs flex items-center gap-1.5 animate-in fade-in duration-150">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              <span className="truncate">{error}</span>
            </span>
          )}
        </div>

        {/* Primary Evaluated Result */}
        <div className="shrink-0 text-right">
          {result ? (
            <div className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-white select-all">
              {result}
            </div>
          ) : (
            <div className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-slate-700 select-none">
              0
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
