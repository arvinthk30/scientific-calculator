# Obsidian Precision Scientific Calculator

A professional, responsive scientific calculator web application designed with an **Obsidian Precision** dark aesthetic, featuring a robust custom recursive-descent math parser (strictly zero `eval()`), a full formula bar with cursor-aware editing and live evaluation preview, memory operations, calculation history, physical constants sheet, and common unit conversions.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following user preferences were confirmed during Phase 1:
> - **Visual Aesthetic**: Obsidian Precision theme with deep obsidian/slate backgrounds (`#090D16`, `#111827`, `#151C2C`), hairline borders (`#1E293B`), laser cyan accents for functions/constants (`#06B6D4`), and telemetry amber for operators/actions (`#F59E0B`).
> - **Expression Input & Display**: Full interactive formula bar supporting live calculation preview, click-and-drag cursor positioning, token insertion, and bracket balancing.
> - **Specialized Mathematical Tools**: Integrated scientific constants sheet (e.g., $c$, $h$, $G$, $N_A$, $k_B$) and quick unit converter (Length, Mass, Pressure, Temperature, Energy, Angle).

---

## 1. Overview & Core Concept

- **What It Does**: Provides students, researchers, engineers, and everyday users with an accurate, dependable scientific calculation environment. Supports standard arithmetic, nested parentheses, powers, roots, trigonometric and inverse trigonometric functions in both Degree and Radian modes, logarithms (natural $\ln$ and base-10 $\log$), factorials ($n!$), mathematical constants ($\pi, e$), full memory register ($M+, M-, MR, MC, MS$), calculation history tape, and error-safe evaluations without crashing on invalid domains or division by zero.
- **Target Audience**: Engineers, students, scientists, developers, and power users who need rapid, reliable desktop and mobile scientific calculation with full expression visibility and history retention.
- **Key Value**: Replaces clumsy sequential digit calculators with an intuitive formula-based workflow that models expressions clearly, previews results in real-time, guarantees mathematical safety without `eval()`, and provides physical constants and unit conversions at your fingertips.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Interactive Formula Construction**:
   - The user inputs numbers and operators via either physical keyboard or touch keypad buttons.
   - The formula bar renders syntax-colored mathematical tokens (cyan for functions, amber for operators, crisp off-white for numbers, emerald for balanced parentheses).
   - A live evaluated preview appears quietly underneath in muted cyan/slate before pressing `=` or `Enter`.
2. **Evaluation & History Capture**:
   - Tapping `=` or hitting `Enter` evaluates the expression using the custom AST parser.
   - The evaluated result becomes the prominent primary readout; the calculation is appended to the persistent history tape with timestamp and expression/result pair.
   - Clicking any item in history allows instant recall (re-inserting expression or copying result).
3. **Angle Mode & Memory Controls**:
   - A single-tap `DEG / RAD` toggle updates angle calculations immediately.
   - Memory buttons (`MC`, `MR`, `M+`, `M-`) interact with an active memory indicator showing whether a stored value exists in the register.
4. **Tool Drawers (Constants & Unit Converter)**:
   - Clean segmented tabs allow toggling between the Keypad, Scientific Constants Sheet (tap to insert exact constant into expression), and Unit Converter.

### Visual Identity & Theme
- **Theme**: Obsidian Precision (high-contrast dark mode with lab-grade precision).
- **Color Palette**:
  - Dominant Neutral Canvas (60%): `#090D16` deep space obsidian and `#0D1322` background.
  - Structural Panels & Keypads (30%): `#131B2E` panels, `#182238` button surfaces with `1px` hairline `#1E293B` borders.
  - Telemetry & Function Accents (10%):
    - Laser Cyan (`#06B6D4` / `#22D3EE`): Function keys (`sin`, `cos`, `tan`, `log`, `ln`, `√`, `Deg/Rad`).
    - Telemetry Amber (`#F59E0B` / `#FBBF24`): Operators (`+`, `−`, `×`, `÷`, `^`), Clear (`AC`), and Backspace (`⌫`).
    - Emerald Glow (`#10B981`): Balanced parentheses indicator and memory active state badge.
    - Crisp Off-White (`#F8FAFC`): Numerical digits (high legibility, `font-mono tabular-nums`).
- **Typography & Precision**:
  - Interface Labels: `Plus Jakarta Sans` / clean sans-serif.
  - Formula Bar & Results: Tabular Monospace (`font-mono tabular-nums`) for jitter-free numbers, aligned decimals, and clean parentheses tracking.
- **Responsive Layout**:
  - Desktop ($1440\text{px}$ baseline): Split console with scientific keypad on the left/center and docked History & Constants panel on the right.
  - Mobile ($375\text{px}$–$430\text{px}$): Compact ergonomic layout with natural thumb-zone keypad ($>44\text{px}$ hitboxes), expandable secondary functions drawer, and sliding bottom sheet for history and constants.

---

## 3. Key Product Decisions & Trade-Offs

- **Custom Recursive Descent / Pratt AST Parser (Zero `eval()`)**:
  - *Chosen Approach*: Implement a custom tokenizer and recursive-descent expression parser. Supports proper operator precedence ($^$ > $\times, \div$ > $+,-$), unary minus, implicit multiplication (e.g. `2π`, `3(4+5)`, `5sin(30)`), parentheses matching, and scientific functions with degree/radian awareness.
  - *Why*: Eliminates security vulnerabilities of `eval()` / `Function()`, provides explicit error handling (e.g. "Division by zero", "Logarithm of non-positive number", "Negative square root", "Mismatched parentheses"), and allows real-time syntax checking.
  - *Alternatives Considered*: Standard `mathjs` library (too heavy, adds large bundle overhead and potential build incompatibilities with React 19).
- **Formula Bar with Live Preview**:
  - *Chosen Approach*: As the user types, the expression updates in an editable input with cursor position tracking. The parser continuously attempts non-throwing evaluations to show a dim live preview of the result. Pressing `=` commits the evaluation.
  - *Why*: Prevents user surprise, helps detect typing mistakes early, and adheres to modern high-end scientific calculator UX.
- **Local Storage Persistence**:
  - *Chosen Approach*: Automatically save calculation history, memory register, and angle mode (Deg/Rad) to browser `localStorage`.
  - *Why*: Instant recall across page refreshes with zero server dependency.

---

## 4. Technical Architecture & Component Structure

```
┌────────────────────────────────────────────────────────────────────────┐
│                        App Root (Obsidian Theme)                       │
├────────────────────────────────────────────────────────────────────────┤
│ Top Telemetry Bar: Brand Wordmark · Deg/Rad Toggle · Memory Indicator │
├──────────────────────────────────────────────────┬─────────────────────┤
│ Formula & Readout Screen                         │ Tool Sidebar        │
│  - Active Tokenized Expression (Editable)        │  - History Tape     │
│  - Live Evaluation Preview                       │  - Constants Sheet  │
│  - Primary Result Display & Error HUD            │  - Unit Converter   │
├──────────────────────────────────────────────────┤                     │
│ Scientific Keypad Grid                           │                     │
│  - Memory Strip: MC · MR · M+ · M-               │                     │
│  - Advanced Functions: sin · cos · tan · asin... │                     │
│  - Powers & Roots: x² · xʸ · √ · n!              │                     │
│  - Core Arithmetic & Digits: 7-9 · 4-6 · 1-3 · 0 │                     │
│  - Constants: π · e · Ans · ( · ) · =            │                     │
└──────────────────────────────────────────────────┴─────────────────────┘
```

### Expression Engine Architecture
1. **Tokenizer**: Breaks raw string into tokens: `NUMBER`, `OPERATOR (+, -, *, /, ^, !)`, `FUNCTION (sin, cos, tan, asin, acos, atan, log, ln, sqrt, abs, cbrt)`, `CONSTANT (pi, e)`, `PAREN_OPEN`, `PAREN_CLOSE`. Handles implicit multiplication automatically (e.g. `2(3)` $\to$ `2 * (3)`).
2. **Parser**: Recursive descent / precedence climbing converting tokens into an AST or direct evaluation tree respecting PEMDAS/BODMAS and right-associative exponentiation ($2^{3^2} = 512$).
3. **Evaluator**: Evaluates AST with runtime angle mode (`deg` or `rad`), guards against $\div 0$, $\sqrt{-x}$, $\ln(\le 0)$, non-integer factorials, and extreme overflows.

---

## 5. Verification & Testing Plan

1. **Parser Unit Verification**:
   - Basic precedence: `2 + 3 * 4` = `14`
   - Parentheses: `(2 + 3) * 4` = `20`
   - Exponentiation: `2 ^ 3 ^ 2` = `512`, `4 ^ 0.5` = `2`
   - Implicit multiplication: `2π` = `6.283185...`, `3(2+4)` = `18`, `2sin(90 deg)` = `2`
   - Trigonometry: `sin(90)` in Deg mode = `1`, `sin(π/2)` in Rad mode = `1`
   - Inverses: `asin(1)` in Deg mode = `90`
   - Factorial: `5!` = `120`, `0!` = `1`
   - Logarithms: `log(100)` = `2`, `ln(e)` = `1`
   - Error handling: `1 / 0` $\to$ `"Cannot divide by zero"`, `sqrt(-4)` $\to$ `"Invalid square root"`, `5 / 0 + 2` safely caught without crashing.
2. **Keyboard Interaction**:
   - `0-9`, `.`, `+`, `-`, `*`, `/`, `^`, `(`, `)` insert corresponding tokens.
   - `Enter` / `=` evaluates.
   - `Backspace` removes previous character/token.
   - `Escape` clears expression (`AC`).
   - `s`, `c`, `t` for quick trig functions.
3. **UI & Responsive Check**:
   - Verified on mobile ($375\text{px}$–$430\text{px}$) and desktop ($1440\text{px}$).
   - Run `compile_applet` and `lint_applet` to ensure zero compilation and linting issues.
