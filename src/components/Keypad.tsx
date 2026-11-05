import React, { useState } from 'react';
import { Delete } from 'lucide-react';
import { AngleMode } from '../utils/mathParser';
import { MemoryState } from '../types/calculator';

interface KeypadProps {
  onInsert: (text: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  onEvaluate: () => void;
  angleMode: AngleMode;
  onToggleAngleMode: () => void;
  memory: MemoryState;
  onMemoryAdd: () => void;
  onMemorySubtract: () => void;
  onMemoryRecall: () => void;
  onMemoryClear: () => void;
  onMemoryStore: () => void;
}

export const Keypad: React.FC<KeypadProps> = ({
  onInsert,
  onClear,
  onBackspace,
  onEvaluate,
  angleMode,
  onToggleAngleMode,
  memory,
  onMemoryAdd,
  onMemorySubtract,
  onMemoryRecall,
  onMemoryClear,
  onMemoryStore,
}) => {
  const [isSecond, setIsSecond] = useState(false);

  // Common button base styling
  const btnBase =
    'relative min-h-[46px] sm:min-h-[50px] rounded-xl font-medium text-sm sm:text-base transition-all duration-150 flex items-center justify-center select-none active:scale-[0.96] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 cursor-pointer';

  // Specific style buckets
  const numberBtn = `${btnBase} bg-[#182236] hover:bg-[#202D46] text-slate-100 border border-slate-800/80 font-mono text-lg font-semibold shadow-sm`;
  const sciBtn = `${btnBase} bg-[#101828] hover:bg-cyan-950/40 text-cyan-400 hover:text-cyan-300 border border-slate-800/80 font-mono text-sm sm:text-[15px]`;
  const opBtn = `${btnBase} bg-[#1F1D2B] hover:bg-amber-950/40 text-amber-400 hover:text-amber-300 border border-amber-900/30 font-mono text-lg font-semibold`;
  const clearBtn = `${btnBase} bg-[#28181F] hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 border border-rose-900/30 font-bold text-sm sm:text-base`;
  const memBtn =
    'min-h-[38px] px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-150 flex items-center justify-center active:scale-95 cursor-pointer border';

  return (
    <div className="flex flex-col gap-2.5 select-none">
      {/* Memory Function Row */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={onMemoryClear}
          disabled={!memory.isSet}
          className={`${memBtn} ${
            memory.isSet
              ? 'bg-[#182236] text-amber-300 hover:bg-[#222E46] border-slate-700/60'
              : 'bg-slate-900/40 text-slate-600 border-slate-800/40 cursor-not-allowed'
          }`}
          title="Memory Clear"
        >
          MC
        </button>
        <button
          type="button"
          onClick={onMemoryRecall}
          disabled={!memory.isSet}
          className={`${memBtn} ${
            memory.isSet
              ? 'bg-[#182236] text-amber-300 hover:bg-[#222E46] border-slate-700/60 font-semibold'
              : 'bg-slate-900/40 text-slate-600 border-slate-800/40 cursor-not-allowed'
          }`}
          title="Memory Recall"
        >
          MR
        </button>
        <button
          type="button"
          onClick={onMemoryAdd}
          className={`${memBtn} bg-[#182236] text-slate-300 hover:text-amber-300 hover:bg-[#222E46] border-slate-700/60`}
          title="Memory Add (M+)"
        >
          M+
        </button>
        <button
          type="button"
          onClick={onMemorySubtract}
          className={`${memBtn} bg-[#182236] text-slate-300 hover:text-amber-300 hover:bg-[#222E46] border-slate-700/60`}
          title="Memory Subtract (M-)"
        >
          M−
        </button>
        <button
          type="button"
          onClick={onMemoryStore}
          className={`${memBtn} bg-[#182236] text-slate-300 hover:text-cyan-300 hover:bg-[#222E46] border-slate-700/60`}
          title="Memory Store (MS)"
        >
          MS
        </button>
      </div>

      {/* Main Grid: 5 columns on mobile & desktop */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {/* Row 1 */}
        <button
          type="button"
          onClick={() => setIsSecond(!isSecond)}
          className={`${btnBase} ${
            isSecond
              ? 'bg-cyan-500 text-slate-950 font-bold border border-cyan-400 shadow-md shadow-cyan-500/20'
              : 'bg-[#101828] text-slate-400 hover:text-cyan-400 border border-slate-800/80 font-mono text-xs sm:text-sm'
          }`}
          title="2nd function toggle"
        >
          2nd
        </button>
        <button
          type="button"
          onClick={onToggleAngleMode}
          className={`${btnBase} bg-[#101828] text-slate-400 hover:text-cyan-400 border border-slate-800/80 font-mono text-xs sm:text-sm`}
          title="Toggle Degrees / Radians"
        >
          {angleMode.toUpperCase()}
        </button>
        <button
          type="button"
          onClick={() => onInsert(isSecond ? 'asin(' : 'sin(')}
          className={sciBtn}
          title={isSecond ? 'Arc Sine' : 'Sine'}
        >
          {isSecond ? 'sin⁻¹' : 'sin'}
        </button>
        <button
          type="button"
          onClick={() => onInsert(isSecond ? 'acos(' : 'cos(')}
          className={sciBtn}
          title={isSecond ? 'Arc Cosine' : 'Cosine'}
        >
          {isSecond ? 'cos⁻¹' : 'cos'}
        </button>
        <button
          type="button"
          onClick={() => onInsert(isSecond ? 'atan(' : 'tan(')}
          className={sciBtn}
          title={isSecond ? 'Arc Tangent' : 'Tangent'}
        >
          {isSecond ? 'tan⁻¹' : 'tan'}
        </button>

        {/* Row 2 */}
        <button
          type="button"
          onClick={() => onInsert(isSecond ? '^3' : '^2')}
          className={sciBtn}
          title={isSecond ? 'x cubed' : 'x squared'}
        >
          {isSecond ? 'x³' : 'x²'}
        </button>
        <button
          type="button"
          onClick={() => onInsert('^')}
          className={sciBtn}
          title="x to the power of y (xʸ)"
        >
          xʸ
        </button>
        <button
          type="button"
          onClick={() => onInsert(isSecond ? 'cbrt(' : 'sqrt(')}
          className={sciBtn}
          title={isSecond ? 'Cube Root' : 'Square Root'}
        >
          {isSecond ? '³√' : '√'}
        </button>
        <button
          type="button"
          onClick={() => onInsert(isSecond ? '10^(' : 'log(')}
          className={sciBtn}
          title={isSecond ? '10 to the power of x' : 'Logarithm base 10'}
        >
          {isSecond ? '10ˣ' : 'log'}
        </button>
        <button
          type="button"
          onClick={() => onInsert(isSecond ? 'exp(' : 'ln(')}
          className={sciBtn}
          title={isSecond ? 'Exponential eˣ' : 'Natural Logarithm ln'}
        >
          {isSecond ? 'eˣ' : 'ln'}
        </button>

        {/* Row 3 */}
        <button
          type="button"
          onClick={() => onInsert('(')}
          className={sciBtn}
          title="Left Parenthesis"
        >
          (
        </button>
        <button
          type="button"
          onClick={() => onInsert(')')}
          className={sciBtn}
          title="Right Parenthesis"
        >
          )
        </button>
        <button
          type="button"
          onClick={() => onInsert('!')}
          className={sciBtn}
          title="Factorial (n!)"
        >
          n!
        </button>
        <button
          type="button"
          onClick={onClear}
          className={clearBtn}
          title="All Clear (AC)"
        >
          AC
        </button>
        <button
          type="button"
          onClick={onBackspace}
          className={`${clearBtn} flex items-center justify-center`}
          title="Backspace (⌫)"
          aria-label="Backspace"
        >
          <Delete className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Row 4 */}
        <button
          type="button"
          onClick={() => onInsert('1/(')}
          className={sciBtn}
          title="Reciprocal (1/x)"
        >
          1/x
        </button>
        <button type="button" onClick={() => onInsert('7')} className={numberBtn}>
          7
        </button>
        <button type="button" onClick={() => onInsert('8')} className={numberBtn}>
          8
        </button>
        <button type="button" onClick={() => onInsert('9')} className={numberBtn}>
          9
        </button>
        <button
          type="button"
          onClick={() => onInsert(' ÷ ')}
          className={opBtn}
          title="Divide (÷)"
        >
          ÷
        </button>

        {/* Row 5 */}
        <button
          type="button"
          onClick={() => onInsert('pi')}
          className={sciBtn}
          title="Pi constant (3.14159...)"
        >
          π
        </button>
        <button type="button" onClick={() => onInsert('4')} className={numberBtn}>
          4
        </button>
        <button type="button" onClick={() => onInsert('5')} className={numberBtn}>
          5
        </button>
        <button type="button" onClick={() => onInsert('6')} className={numberBtn}>
          6
        </button>
        <button
          type="button"
          onClick={() => onInsert(' × ')}
          className={opBtn}
          title="Multiply (×)"
        >
          ×
        </button>

        {/* Row 6 */}
        <button
          type="button"
          onClick={() => onInsert('e')}
          className={sciBtn}
          title="Euler constant e (2.71828...)"
        >
          e
        </button>
        <button type="button" onClick={() => onInsert('1')} className={numberBtn}>
          1
        </button>
        <button type="button" onClick={() => onInsert('2')} className={numberBtn}>
          2
        </button>
        <button type="button" onClick={() => onInsert('3')} className={numberBtn}>
          3
        </button>
        <button
          type="button"
          onClick={() => onInsert(' − ')}
          className={opBtn}
          title="Subtract (−)"
        >
          −
        </button>

        {/* Row 7 */}
        <button
          type="button"
          onClick={() => onInsert('%')}
          className={sciBtn}
          title="Percentage (%)"
        >
          %
        </button>
        <button type="button" onClick={() => onInsert('0')} className={numberBtn}>
          0
        </button>
        <button type="button" onClick={() => onInsert('.')} className={numberBtn}>
          .
        </button>
        <button
          type="button"
          onClick={() => onInsert('Ans')}
          className={`${sciBtn} font-semibold`}
          title="Previous Answer"
        >
          Ans
        </button>
        <button
          type="button"
          onClick={() => onInsert(' + ')}
          className={opBtn}
          title="Add (+)"
        >
          +
        </button>

        {/* Row 8: Full-width / Large Equals Row or Equal Button */}
        <button
          type="button"
          onClick={() => onInsert('abs(')}
          className={sciBtn}
          title="Absolute Value |x|"
        >
          |x|
        </button>
        <button
          type="button"
          onClick={onEvaluate}
          className={`${btnBase} col-span-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold font-mono text-xl sm:text-2xl shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all`}
          title="Evaluate (= or Enter)"
        >
          =
        </button>
      </div>
    </div>
  );
};
