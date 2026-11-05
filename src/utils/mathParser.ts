/**
 * Obsidian Precision Math Parser
 * Robust Recursive-Descent Expression Tokenizer, Parser & Evaluator (Zero eval())
 */

export type AngleMode = 'deg' | 'rad';

export interface EvaluationResult {
  success: boolean;
  value?: number;
  formatted?: string;
  error?: string;
}

export interface ParserOptions {
  angleMode?: AngleMode;
  ans?: number;
}

// Token Types
enum TokenType {
  NUMBER = 'NUMBER',
  IDENT = 'IDENT',
  PLUS = 'PLUS',
  MINUS = 'MINUS',
  MUL = 'MUL',
  DIV = 'DIV',
  POW = 'POW',
  FACT = 'FACT',
  PERCENT = 'PERCENT',
  LPAREN = 'LPAREN',
  RPAREN = 'RPAREN',
  EOF = 'EOF',
}

interface Token {
  type: TokenType;
  value?: any;
  raw: string;
  pos: number;
}

// Clean and normalize human math string
export function normalizeExpression(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/×/g, '*')
    .replace(/✕/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/–/g, '-')
    .replace(/—/g, '-')
    .replace(/π/g, 'pi')
    .replace(/√/g, 'sqrt ')
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/·/g, '*')
    .replace(/[\[\{]/g, '(')
    .replace(/[\]\}]/g, ')')
    .trim();
}

/**
 * Tokenize input string into an array of typed Tokens
 */
function tokenize(input: string): Token[] {
  const normalized = normalizeExpression(input);
  const tokens: Token[] = [];
  let i = 0;
  const len = normalized.length;

  while (i < len) {
    const ch = normalized[i];

    // Skip whitespace
    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    // Number (including decimals and scientific notation like 1.5e-3 or 2e5)
    if (/[0-9]/.test(ch) || (ch === '.' && i + 1 < len && /[0-9]/.test(normalized[i + 1]))) {
      let numStr = '';
      const startPos = i;
      let hasDot = false;

      while (i < len && (/[0-9]/.test(normalized[i]) || (normalized[i] === '.' && !hasDot))) {
        if (normalized[i] === '.') hasDot = true;
        numStr += normalized[i];
        i++;
      }

      // Check scientific notation: e.g. 1.2e4 or 3e-5 (must be followed by + or - or digit)
      if (
        i < len &&
        (normalized[i] === 'e' || normalized[i] === 'E') &&
        i + 1 < len &&
        (/[0-9]/.test(normalized[i + 1]) ||
          ((normalized[i + 1] === '+' || normalized[i + 1] === '-') &&
            i + 2 < len &&
            /[0-9]/.test(normalized[i + 2])))
      ) {
        numStr += normalized[i];
        i++;
        if (normalized[i] === '+' || normalized[i] === '-') {
          numStr += normalized[i];
          i++;
        }
        while (i < len && /[0-9]/.test(normalized[i])) {
          numStr += normalized[i];
          i++;
        }
      }

      const numVal = parseFloat(numStr);
      if (isNaN(numVal)) {
        throw new Error(`Invalid number format: "${numStr}"`);
      }
      tokens.push({ type: TokenType.NUMBER, value: numVal, raw: numStr, pos: startPos });
      continue;
    }

    // Identifiers (functions, constants): sin, cos, tan, asin, log, ln, sqrt, pi, e, ans, etc.
    if (/[a-zA-Z_]/.test(ch)) {
      const startPos = i;
      // Special case for log10
      if (normalized.substring(i, i + 5).toLowerCase() === 'log10') {
        tokens.push({ type: TokenType.IDENT, value: 'log10', raw: 'log10', pos: startPos });
        i += 5;
        continue;
      }

      let ident = '';
      while (i < len && /[a-zA-Z_]/.test(normalized[i])) {
        ident += normalized[i];
        i++;
      }
      tokens.push({ type: TokenType.IDENT, value: ident.toLowerCase(), raw: ident, pos: startPos });
      continue;
    }

    // Operators & Brackets
    switch (ch) {
      case '+':
        tokens.push({ type: TokenType.PLUS, raw: '+', pos: i++ });
        break;
      case '-':
        tokens.push({ type: TokenType.MINUS, raw: '-', pos: i++ });
        break;
      case '*':
        tokens.push({ type: TokenType.MUL, raw: '*', pos: i++ });
        break;
      case '/':
        tokens.push({ type: TokenType.DIV, raw: '/', pos: i++ });
        break;
      case '^':
        tokens.push({ type: TokenType.POW, raw: '^', pos: i++ });
        break;
      case '!':
        tokens.push({ type: TokenType.FACT, raw: '!', pos: i++ });
        break;
      case '%':
        tokens.push({ type: TokenType.PERCENT, raw: '%', pos: i++ });
        break;
      case '(':
        tokens.push({ type: TokenType.LPAREN, raw: '(', pos: i++ });
        break;
      case ')':
        tokens.push({ type: TokenType.RPAREN, raw: ')', pos: i++ });
        break;
      default:
        throw new Error(`Unexpected character: "${ch}" at index ${i}`);
    }
  }

  // Handle Implicit Multiplication:
  // e.g., 2pi -> 2 * pi, 2(3) -> 2 * (3), (2)(3) -> (2) * (3), 5sin(x) -> 5 * sin(x), 5! 2 -> 5! * 2
  const processedTokens: Token[] = [];
  for (let idx = 0; idx < tokens.length; idx++) {
    const curr = tokens[idx];
    processedTokens.push(curr);

    if (idx + 1 < tokens.length) {
      const next = tokens[idx + 1];
      const currCanBeFollowedByMul =
        curr.type === TokenType.NUMBER ||
        curr.type === TokenType.RPAREN ||
        curr.type === TokenType.FACT ||
        curr.type === TokenType.PERCENT ||
        (curr.type === TokenType.IDENT && isConstant(curr.value));

      const nextCanFollowMul =
        next.type === TokenType.NUMBER ||
        next.type === TokenType.LPAREN ||
        (next.type === TokenType.IDENT && (isConstant(next.value) || isFunction(next.value)));

      if (currCanBeFollowedByMul && nextCanFollowMul) {
        processedTokens.push({
          type: TokenType.MUL,
          raw: '*',
          pos: curr.pos,
        });
      }
    }
  }

  processedTokens.push({ type: TokenType.EOF, raw: '', pos: len });
  return processedTokens;
}

function isConstant(name: string): boolean {
  return ['pi', 'e', 'ans'].includes(name.toLowerCase());
}

function isFunction(name: string): boolean {
  return [
    'sin',
    'cos',
    'tan',
    'asin',
    'acos',
    'atan',
    'sinh',
    'cosh',
    'tanh',
    'asinh',
    'acosh',
    'atanh',
    'log',
    'log10',
    'ln',
    'sqrt',
    'cbrt',
    'abs',
    'exp',
    'floor',
    'ceil',
    'round',
  ].includes(name.toLowerCase());
}

/**
 * Recursive Descent Parser & Evaluator
 */
class ExpressionEvaluator {
  private tokens: Token[];
  private current: number = 0;
  private angleMode: AngleMode;
  private ans: number;

  constructor(tokens: Token[], options: ParserOptions = {}) {
    this.tokens = tokens;
    this.angleMode = options.angleMode || 'deg';
    this.ans = options.ans !== undefined ? options.ans : 0;
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }

  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();
    throw new Error(message);
  }

  public evaluate(): number {
    if (this.isAtEnd()) {
      return 0;
    }
    const val = this.expression();
    if (!this.isAtEnd()) {
      const leftover = this.peek();
      throw new Error(`Unexpected token "${leftover.raw}" at position ${leftover.pos}`);
    }
    return cleanFloatingPoint(val);
  }

  // Precedence level 1: Expression (Addition & Subtraction)
  private expression(): number {
    let result = this.term();

    while (this.match(TokenType.PLUS, TokenType.MINUS)) {
      const op = this.previous().type;
      const right = this.term();
      if (op === TokenType.PLUS) {
        result += right;
      } else {
        result -= right;
      }
    }

    return result;
  }

  // Precedence level 2: Term (Multiplication & Division)
  private term(): number {
    let result = this.factor();

    while (this.match(TokenType.MUL, TokenType.DIV)) {
      const op = this.previous().type;
      const right = this.factor();
      if (op === TokenType.MUL) {
        result *= right;
      } else {
        if (Math.abs(right) < 1e-15 || right === 0) {
          throw new Error('Cannot divide by zero');
        }
        result /= right;
      }
    }

    return result;
  }

  // Precedence level 3: Factor (Unary + / -)
  private factor(): number {
    if (this.match(TokenType.MINUS)) {
      return -this.factor();
    }
    if (this.match(TokenType.PLUS)) {
      return this.factor();
    }
    return this.power();
  }

  // Precedence level 4: Exponentiation (Right-Associative: 2 ^ 3 ^ 2 = 512)
  private power(): number {
    const base = this.postfix();

    if (this.match(TokenType.POW)) {
      const exponent = this.factor(); // Right-associative call
      if (base < 0 && !Number.isInteger(exponent)) {
        throw new Error('Complex number result (negative base with fractional exponent)');
      }
      return Math.pow(base, exponent);
    }

    return base;
  }

  // Precedence level 5: Postfix operators (! and %)
  private postfix(): number {
    let val = this.primary();

    while (this.check(TokenType.FACT) || this.check(TokenType.PERCENT)) {
      if (this.match(TokenType.FACT)) {
        val = evaluateFactorial(val);
      } else if (this.match(TokenType.PERCENT)) {
        val = val / 100;
      }
    }

    return val;
  }

  // Precedence level 6: Primary Atoms (numbers, identifiers, constants, function calls, grouping)
  private primary(): number {
    // Number
    if (this.match(TokenType.NUMBER)) {
      return this.previous().value;
    }

    // Constants & Functions
    if (this.match(TokenType.IDENT)) {
      const identToken = this.previous();
      const name = identToken.value;

      // Mathematical Constants
      if (name === 'pi') return Math.PI;
      if (name === 'e') return Math.E;
      if (name === 'ans') return this.ans;

      // Function calls
      if (isFunction(name)) {
        // Can be func(arg) or func arg if followed by parentheses or atom
        let arg: number;
        if (this.match(TokenType.LPAREN)) {
          arg = this.expression();
          this.consume(TokenType.RPAREN, `Expected ")" after ${name} argument`);
        } else {
          // e.g. "sin 90" or "sqrt 16"
          arg = this.factor();
        }

        return this.executeFunction(name, arg);
      }

      throw new Error(`Unknown identifier or function: "${identToken.raw}"`);
    }

    // Parentheses Grouping: ( expr )
    if (this.match(TokenType.LPAREN)) {
      const val = this.expression();
      this.consume(TokenType.RPAREN, 'Mismatched parentheses: expected ")"');
      return val;
    }

    if (this.isAtEnd()) {
      throw new Error('Incomplete expression');
    }

    const currentToken = this.peek();
    throw new Error(`Unexpected token "${currentToken.raw}"`);
  }

  private executeFunction(fn: string, x: number): number {
    const isDeg = this.angleMode === 'deg';

    switch (fn) {
      case 'sin': {
        const rad = isDeg ? (x * Math.PI) / 180 : x;
        // Check for periodic zeros (e.g. sin(180 deg) = 0)
        if (isDeg && Math.abs(x % 180) < 1e-10) return 0;
        return cleanFloatingPoint(Math.sin(rad));
      }
      case 'cos': {
        const rad = isDeg ? (x * Math.PI) / 180 : x;
        // Check for periodic zeros (e.g. cos(90 deg) = 0)
        if (isDeg && Math.abs((x - 90) % 180) < 1e-10) return 0;
        return cleanFloatingPoint(Math.cos(rad));
      }
      case 'tan': {
        if (isDeg) {
          // Tangent is undefined at 90, 270, etc.
          const normalizedAngle = Math.abs(x % 180);
          if (Math.abs(normalizedAngle - 90) < 1e-10) {
            throw new Error(`Tangent undefined at ${x}°`);
          }
          if (Math.abs(x % 180) < 1e-10) return 0;
          return cleanFloatingPoint(Math.tan((x * Math.PI) / 180));
        } else {
          const cosVal = Math.cos(x);
          if (Math.abs(cosVal) < 1e-15) {
            throw new Error('Tangent undefined (cosine is zero)');
          }
          return cleanFloatingPoint(Math.tan(x));
        }
      }
      case 'asin': {
        if (x < -1 || x > 1) {
          throw new Error('Invalid domain for asin: input must be in [-1, 1]');
        }
        const rad = Math.asin(x);
        return isDeg ? cleanFloatingPoint((rad * 180) / Math.PI) : rad;
      }
      case 'acos': {
        if (x < -1 || x > 1) {
          throw new Error('Invalid domain for acos: input must be in [-1, 1]');
        }
        const rad = Math.acos(x);
        return isDeg ? cleanFloatingPoint((rad * 180) / Math.PI) : rad;
      }
      case 'atan': {
        const rad = Math.atan(x);
        return isDeg ? cleanFloatingPoint((rad * 180) / Math.PI) : rad;
      }
      case 'sinh':
        return Math.sinh(x);
      case 'cosh':
        return Math.cosh(x);
      case 'tanh':
        return Math.tanh(x);
      case 'asinh':
        return Math.asinh(x);
      case 'acosh':
        if (x < 1) throw new Error('Invalid domain for acosh: input must be >= 1');
        return Math.acosh(x);
      case 'atanh':
        if (x <= -1 || x >= 1) throw new Error('Invalid domain for atanh: input must be in (-1, 1)');
        return Math.atanh(x);
      case 'log':
      case 'log10': {
        if (x <= 0) throw new Error('Logarithm undefined for non-positive numbers (x <= 0)');
        return cleanFloatingPoint(Math.log10(x));
      }
      case 'ln': {
        if (x <= 0) throw new Error('Natural logarithm undefined for non-positive numbers (x <= 0)');
        return cleanFloatingPoint(Math.log(x));
      }
      case 'sqrt': {
        if (x < 0) throw new Error('Cannot calculate square root of negative number');
        return Math.sqrt(x);
      }
      case 'cbrt':
        return Math.cbrt(x);
      case 'abs':
        return Math.abs(x);
      case 'exp':
        return Math.exp(x);
      case 'floor':
        return Math.floor(x);
      case 'ceil':
        return Math.ceil(x);
      case 'round':
        return Math.round(x);
      default:
        throw new Error(`Unsupported function: ${fn}`);
    }
  }
}

/**
 * Evaluate factorial: n!
 */
function evaluateFactorial(n: number): number {
  if (!Number.isInteger(n) || n < 0) {
    throw new Error(`Factorial only defined for non-negative integers (received ${n})`);
  }
  if (n > 170) {
    throw new Error('Factorial overflow (maximum supported is 170!)');
  }
  if (n === 0 || n === 1) return 1;

  let acc = 1;
  for (let i = 2; i <= n; i++) {
    acc *= i;
  }
  return acc;
}

/**
 * Remove precision noise from floating point operations:
 * e.g. 0.1 + 0.2 = 0.30000000000000004 -> 0.3
 * e.g. cos(90) = 6.12e-17 -> 0
 */
export function cleanFloatingPoint(val: number): number {
  if (Math.abs(val) < 1e-14 && val !== 0) {
    return 0;
  }
  const factor = 1e12;
  const rounded = Math.round(val * factor) / factor;
  // If the difference is tiny, return the rounded value
  if (Math.abs(val - rounded) < 1e-13) {
    return rounded;
  }
  return val;
}

/**
 * Format calculation result for display
 */
export function formatResult(value: number): string {
  if (isNaN(value)) return 'Error';
  if (!isFinite(value)) return value > 0 ? 'Infinity' : '-Infinity';
  if (value === 0) return '0';

  const abs = Math.abs(value);
  // Extremely large or small numbers -> scientific notation
  if (abs >= 1e13 || (abs < 1e-7 && abs > 0)) {
    const expStr = value.toExponential(8);
    // Remove trailing zeros in mantissa: 1.20000000e+15 -> 1.2e+15
    return expStr.replace(/(\.[0-9]*[1-9])0+e/, '$1e').replace(/\.0+e/, 'e');
  }

  // Standard precision with max 10 decimal digits
  const str = value.toLocaleString('en-US', {
    maximumFractionDigits: 10,
    useGrouping: true,
  });

  return str;
}

/**
 * Main evaluation entry point
 */
export function evaluateExpression(expression: string, options: ParserOptions = {}): EvaluationResult {
  const trimmed = expression.trim();
  if (!trimmed) {
    return { success: true, value: 0, formatted: '0' };
  }

  try {
    const tokens = tokenize(trimmed);
    const evaluator = new ExpressionEvaluator(tokens, options);
    const value = evaluator.evaluate();

    if (isNaN(value) || !isFinite(value)) {
      return {
        success: false,
        error: isNaN(value) ? 'Undefined mathematical result' : 'Value is infinite (overflow)',
      };
    }

    return {
      success: true,
      value,
      formatted: formatResult(value),
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Syntax error',
    };
  }
}
