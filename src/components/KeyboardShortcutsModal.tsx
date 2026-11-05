import React, { useEffect } from 'react';
import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts = [
    { key: '0 - 9', desc: 'Input digits' },
    { key: '.', desc: 'Decimal point' },
    { key: '+  −  ×  ÷', desc: 'Basic arithmetic (+, -, *, /)' },
    { key: '^', desc: 'Power / Exponent (xʸ)' },
    { key: '(', desc: 'Left parenthesis' },
    { key: ')', desc: 'Right parenthesis' },
    { key: '!', desc: 'Factorial (n!)' },
    { key: '%', desc: 'Percentage' },
    { key: 'Enter  or  =', desc: 'Evaluate expression' },
    { key: 'Backspace', desc: 'Delete previous character' },
    { key: 'Escape', desc: 'All Clear (AC)' },
    { key: 's / c / t', desc: 'sin( / cos( / tan(' },
    { key: 'l / n', desc: 'log( / ln(' },
    { key: 'r', desc: 'Square root sqrt(' },
    { key: 'p', desc: 'Pi constant (π)' },
    { key: 'e', desc: 'Euler constant (e)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#0F1626] border border-slate-800 rounded-2xl p-5 shadow-2xl relative flex flex-col gap-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2 text-slate-100 font-semibold text-base">
            <Keyboard className="w-5 h-5 text-cyan-400" />
            <span>Keyboard Shortcuts</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs overflow-y-auto max-h-[60vh] pr-1">
          {shortcuts.map((s) => (
            <div
              key={s.key}
              className="p-2 rounded-lg bg-[#151E32] border border-slate-800/80 flex items-center justify-between gap-2"
            >
              <kbd className="font-mono bg-slate-800/80 text-cyan-300 px-2 py-0.5 rounded border border-slate-700 text-[11px] font-semibold shrink-0">
                {s.key}
              </kbd>
              <span className="text-slate-400 text-right truncate">{s.desc}</span>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="text-[11px] text-slate-500 text-center pt-2 border-t border-slate-800/60">
          Focus anywhere and type. Calculations evaluate automatically or with <kbd className="text-slate-400">Enter</kbd>.
        </div>
      </div>
    </div>
  );
};
