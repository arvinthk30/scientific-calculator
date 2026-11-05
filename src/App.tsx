import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  History as HistoryIcon,
  Atom,
  Scale,
  Keyboard,
  Sparkles,
  Calculator as CalcIcon,
} from 'lucide-react';
import { AngleMode, evaluateExpression, formatResult } from './utils/mathParser';
import { CalculationRecord, MemoryState, SidebarTab } from './types/calculator';
import { FormulaDisplay } from './components/FormulaDisplay';
import { Keypad } from './components/Keypad';
import { HistoryPanel } from './components/HistoryPanel';
import { ConstantsSheet } from './components/ConstantsSheet';
import { UnitConverter } from './components/UnitConverter';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { ScientificConstant } from './utils/constantsAndUnits';

export default function App() {
  // State
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);
  const [livePreview, setLivePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastAnswer, setLastAnswer] = useState<number>(0);
  const [angleMode, setAngleMode] = useState<AngleMode>(() => {
    return (localStorage.getItem('obsidian_calc_angle') as AngleMode) || 'deg';
  });
  const [memory, setMemory] = useState<MemoryState>(() => {
    const saved = localStorage.getItem('obsidian_calc_memory');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return { value: 0, isSet: false };
  });
  const [history, setHistory] = useState<CalculationRecord[]>(() => {
    const saved = localStorage.getItem('obsidian_calc_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return [];
  });
  const [activeTab, setActiveTab] = useState<SidebarTab>('history');
  const [mobileView, setMobileView] = useState<'calc' | 'tools'>('calc');
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('obsidian_calc_angle', angleMode);
  }, [angleMode]);

  useEffect(() => {
    localStorage.setItem('obsidian_calc_memory', JSON.stringify(memory));
  }, [memory]);

  useEffect(() => {
    localStorage.setItem('obsidian_calc_history', JSON.stringify(history));
  }, [history]);

  // Live Preview Evaluation
  useEffect(() => {
    const trimmed = expression.trim();
    if (!trimmed) {
      setLivePreview(null);
      setError(null);
      return;
    }

    const evalResult = evaluateExpression(trimmed, {
      angleMode,
      ans: lastAnswer,
    });

    if (evalResult.success && evalResult.formatted) {
      setLivePreview(evalResult.formatted);
      setError(null);
    } else {
      // Don't loudly show error while user is actively halfway through typing
      setLivePreview(null);
    }
  }, [expression, angleMode, lastAnswer]);

  // Insert Text at Cursor Position
  const insertAtCursor = useCallback((insertText: string) => {
    const input = inputRef.current;
    if (!input) {
      setExpression((prev) => prev + insertText);
      return;
    }

    const start = input.selectionStart ?? expression.length;
    const end = input.selectionEnd ?? expression.length;
    const newExpr = expression.substring(0, start) + insertText + expression.substring(end);
    setExpression(newExpr);

    // Reposition cursor right after inserted text
    const newCursorPos = start + insertText.length;
    setTimeout(() => {
      input.focus();
      input.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }, [expression]);

  // Evaluation Handler
  const handleEvaluate = useCallback(() => {
    const trimmed = expression.trim();
    if (!trimmed) return;

    const evalRes = evaluateExpression(trimmed, {
      angleMode,
      ans: lastAnswer,
    });

    if (evalRes.success && evalRes.value !== undefined && evalRes.formatted) {
      setResult(evalRes.formatted);
      setLastAnswer(evalRes.value);
      setError(null);

      // Record in History
      const record: CalculationRecord = {
        id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        timestamp: Date.now(),
        expression: trimmed,
        result: evalRes.value,
        formattedResult: evalRes.formatted,
        angleMode,
      };
      setHistory((prev) => [record, ...prev.slice(0, 49)]); // keep last 50
    } else {
      setError(evalRes.error || 'Evaluation error');
      setResult(null);
    }
  }, [expression, angleMode, lastAnswer]);

  // All Clear Handler
  const handleClear = useCallback(() => {
    setExpression('');
    setResult(null);
    setLivePreview(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Backspace Handler
  const handleBackspace = useCallback(() => {
    const input = inputRef.current;
    if (!input) {
      setExpression((prev) => prev.slice(0, -1));
      return;
    }

    const start = input.selectionStart ?? expression.length;
    const end = input.selectionEnd ?? expression.length;

    if (start !== end) {
      // Delete selected range
      const newExpr = expression.substring(0, start) + expression.substring(end);
      setExpression(newExpr);
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(start, start);
      }, 0);
    } else if (start > 0) {
      // Check if deleting a multi-char token like 'sin(' or 'sqrt(' or 'Ans'
      const beforeCursor = expression.substring(0, start);
      const funcs = ['asin(', 'acos(', 'atan(', 'sinh(', 'cosh(', 'tanh(', 'cbrt(', 'sqrt(', 'sin(', 'cos(', 'tan(', 'log(', 'ln(', '10^(', 'exp(', 'abs(', 'Ans'];
      let charsToRemove = 1;

      for (const fn of funcs) {
        if (beforeCursor.endsWith(fn)) {
          charsToRemove = fn.length;
          break;
        }
      }

      const newExpr = expression.substring(0, start - charsToRemove) + expression.substring(start);
      setExpression(newExpr);
      const newPos = start - charsToRemove;
      setTimeout(() => {
        input.focus();
        input.setSelectionRange(newPos, newPos);
      }, 0);
    }
  }, [expression]);

  // Angle Mode Toggle
  const handleToggleAngleMode = useCallback(() => {
    setAngleMode((prev) => (prev === 'deg' ? 'rad' : 'deg'));
  }, []);

  // Memory Actions
  const getCurrentEvaluatedValue = useCallback((): number => {
    if (result !== null) {
      const parsed = parseFloat(result.replace(/,/g, ''));
      if (!isNaN(parsed)) return parsed;
    }
    const evalRes = evaluateExpression(expression, { angleMode, ans: lastAnswer });
    return evalRes.success && evalRes.value !== undefined ? evalRes.value : 0;
  }, [result, expression, angleMode, lastAnswer]);

  const handleMemoryAdd = useCallback(() => {
    const val = getCurrentEvaluatedValue();
    setMemory((prev) => ({
      value: prev.value + val,
      isSet: true,
    }));
  }, [getCurrentEvaluatedValue]);

  const handleMemorySubtract = useCallback(() => {
    const val = getCurrentEvaluatedValue();
    setMemory((prev) => ({
      value: prev.value - val,
      isSet: true,
    }));
  }, [getCurrentEvaluatedValue]);

  const handleMemoryRecall = useCallback(() => {
    if (!memory.isSet) return;
    insertAtCursor(memory.value.toString());
  }, [memory, insertAtCursor]);

  const handleMemoryClear = useCallback(() => {
    setMemory({ value: 0, isSet: false });
  }, []);

  const handleMemoryStore = useCallback(() => {
    const val = getCurrentEvaluatedValue();
    setMemory({ value: val, isSet: true });
  }, [getCurrentEvaluatedValue]);

  // History & Constants Insertion Handlers
  const handleSelectHistoryExpression = useCallback((expr: string) => {
    setExpression(expr);
    setResult(null);
    setMobileView('calc');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, []);

  const handleInsertResult = useCallback((resStr: string) => {
    insertAtCursor(resStr.replace(/,/g, ''));
    setMobileView('calc');
  }, [insertAtCursor]);

  const handleInsertConstant = useCallback((constant: ScientificConstant) => {
    insertAtCursor(constant.valueStr);
    setMobileView('calc');
  }, [insertAtCursor]);

  // Global Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in converter inputs
      const activeEl = document.activeElement;
      if (activeEl && activeEl !== inputRef.current && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'SELECT')) {
        return;
      }

      const key = e.key;

      if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleEvaluate();
      } else if (key === 'Escape') {
        e.preventDefault();
        handleClear();
      } else if (key === 'Backspace' && activeEl !== inputRef.current) {
        e.preventDefault();
        handleBackspace();
      } else if (activeEl !== inputRef.current) {
        // Quick key bindings when typing outside input
        if (/[0-9]/.test(key) || key === '.' || ['+', '-', '*', '/', '^', '%', '(', ')'].includes(key)) {
          e.preventDefault();
          const charMap: Record<string, string> = {
            '*': ' × ',
            '/': ' ÷ ',
            '+': ' + ',
            '-': ' − ',
          };
          insertAtCursor(charMap[key] || key);
        } else if (key.toLowerCase() === 's') {
          e.preventDefault();
          insertAtCursor('sin(');
        } else if (key.toLowerCase() === 'c') {
          e.preventDefault();
          insertAtCursor('cos(');
        } else if (key.toLowerCase() === 't') {
          e.preventDefault();
          insertAtCursor('tan(');
        } else if (key.toLowerCase() === 'l') {
          e.preventDefault();
          insertAtCursor('log(');
        } else if (key.toLowerCase() === 'n') {
          e.preventDefault();
          insertAtCursor('ln(');
        } else if (key.toLowerCase() === 'r') {
          e.preventDefault();
          insertAtCursor('sqrt(');
        } else if (key.toLowerCase() === 'p') {
          e.preventDefault();
          insertAtCursor('pi');
        } else if (key === 'e' || key === 'E') {
          e.preventDefault();
          insertAtCursor('e');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleEvaluate, handleClear, handleBackspace, insertAtCursor]);

  return (
    <div className="min-h-screen bg-[#070A11] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Bar (Strict 3-zone Top Bar Contract) */}
      <header className="border-b border-slate-800/80 bg-[#0A0E18]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/20">
              <Sparkles className="w-4 h-4 text-slate-950 font-bold" />
            </div>
            <span className="font-mono text-base font-bold tracking-tight text-white">
              OBSIDIAN <span className="text-cyan-400 font-sans text-xs uppercase px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/40">Lab</span>
            </span>
          </div>

          {/* Zone 2: Navigation / Info */}
          <div className="hidden md:flex items-center gap-6 text-xs text-slate-400 font-mono">
            <span>AST PARSER ENGINE</span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span>ZERO EVAL()</span>
            <span aria-hidden="true" className="text-slate-700">·</span>
            <span className="text-cyan-400">PRECISION 10⁻¹²</span>
          </div>

          {/* Zone 3: 1 Primary Action (Keyboard Shortcuts Modal Trigger) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsShortcutsOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-[#141C2E] hover:bg-[#1C273E] border border-slate-700/80 text-xs font-medium text-slate-300 hover:text-cyan-300 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              title="View keyboard bindings"
            >
              <Keyboard className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Shortcuts</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Mode Switcher (Natural Thumb Zone) */}
      <div className="lg:hidden border-b border-slate-800/80 bg-[#0D1424] px-4 py-2 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setMobileView('calc')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
            mobileView === 'calc'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <CalcIcon className="w-3.5 h-3.5" />
          <span>Calculator</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileView('tools')}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
            mobileView === 'tools'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <HistoryIcon className="w-3.5 h-3.5" />
          <span>Tape & Tools {history.length > 0 && `(${history.length})`}</span>
        </button>
      </div>

      {/* Main Workspace Stage */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          {/* Main Calculator Column (8 cols on desktop) */}
          <div
            className={`lg:col-span-7 xl:col-span-7 flex flex-col gap-4 ${
              mobileView === 'tools' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* Formula Display & Result */}
            <FormulaDisplay
              expression={expression}
              onExpressionChange={(val) => setExpression(val)}
              result={result}
              error={error}
              livePreview={livePreview}
              angleMode={angleMode}
              onToggleAngleMode={handleToggleAngleMode}
              memory={memory}
              onClear={handleClear}
              onBackspace={handleBackspace}
              inputRef={inputRef}
            />

            {/* Scientific Keypad */}
            <div className="bg-[#0B101C] border border-[#1B2438] rounded-2xl p-3 sm:p-5 shadow-2xl shadow-black/60">
              <Keypad
                onInsert={insertAtCursor}
                onClear={handleClear}
                onBackspace={handleBackspace}
                onEvaluate={handleEvaluate}
                angleMode={angleMode}
                onToggleAngleMode={handleToggleAngleMode}
                memory={memory}
                onMemoryAdd={handleMemoryAdd}
                onMemorySubtract={handleMemorySubtract}
                onMemoryRecall={handleMemoryRecall}
                onMemoryClear={handleMemoryClear}
                onMemoryStore={handleMemoryStore}
              />
            </div>
          </div>

          {/* Secondary Tools Column: History, Constants, Converter (5 cols on desktop) */}
          <div
            className={`lg:col-span-5 xl:col-span-5 flex flex-col h-[560px] sm:h-[620px] bg-[#0B101C] border border-[#1B2438] rounded-2xl p-4 sm:p-5 shadow-xl shadow-black/40 ${
              mobileView === 'calc' ? 'hidden lg:flex' : 'flex'
            }`}
          >
            {/* Tool Tabs Header */}
            <div className="flex items-center gap-1 p-1 bg-[#121A2A] rounded-xl border border-slate-800 mb-4 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-[#182338] text-cyan-300 shadow-sm border border-slate-700/80 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <HistoryIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>History</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('constants')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'constants'
                    ? 'bg-[#182338] text-cyan-300 shadow-sm border border-slate-700/80 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Atom className="w-3.5 h-3.5 text-cyan-400" />
                <span>Constants</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('converter')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'converter'
                    ? 'bg-[#182338] text-cyan-300 shadow-sm border border-slate-700/80 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Scale className="w-3.5 h-3.5 text-cyan-400" />
                <span>Converter</span>
              </button>
            </div>

            {/* Tool Body */}
            <div className="flex-1 overflow-hidden">
              {activeTab === 'history' && (
                <HistoryPanel
                  records={history}
                  onSelectExpression={handleSelectHistoryExpression}
                  onInsertResult={handleInsertResult}
                  onClearHistory={() => setHistory([])}
                  onDeleteRecord={(id) => setHistory((prev) => prev.filter((r) => r.id !== id))}
                />
              )}
              {activeTab === 'constants' && (
                <ConstantsSheet onInsertConstant={handleInsertConstant} />
              )}
              {activeTab === 'converter' && (
                <UnitConverter onInsertValue={handleInsertResult} />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-3 text-center text-xs text-slate-500 font-mono">
        <span>Obsidian Precision v1.0</span>
        <span aria-hidden="true" className="mx-2 text-slate-700">·</span>
        <span>Keyboard Enabled</span>
        <span aria-hidden="true" className="mx-2 text-slate-700">·</span>
        <span>Scientific Math Engine</span>
      </footer>

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
