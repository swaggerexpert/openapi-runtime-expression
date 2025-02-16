/**
 * Parsing
 */
export function parse(runtimeExpression: string, options?: ParseOptions): ParseResult;
export const tokenLowerCaseNormalizer: TokenLowerCaseNormalizer;
export const tokenUpperCaseNormalizer: TokenUpperCaseNormalizer;

export interface TokenNormalizer {
  (token: string): string;
}
export interface TokenLowerCaseNormalizer extends TokenNormalizer {
  <T extends string>(token: T): Lowercase<T>;
}
export interface TokenUpperCaseNormalizer extends TokenNormalizer {
  <T extends string>(token: T): Uppercase<T>;
}

interface ParseResult {
  readonly result: {
    readonly success: boolean;
  };
  readonly ast: {
    readonly translate: (parts: any[]) => Array<[string, string]>;
    readonly toXml: () => string;
  };
}

export interface ParseOptions {
  readonly tokenNormalizer?: TokenNormalizer;
}

/**
 * Testing
 */
export function test(runtimeExpression: string): boolean;

/**
 * Extracting
 */
export function extract(openapiRuntimeExpression: string): string;

/**
 * Grammar
 */
export function Grammar(): Grammar;

export interface Grammar {
  grammarObject: string; // Internal identifier
  rules: Rule[]; // List of grammar rules
  udts: UDT[]; // User-defined terminals (empty in this grammar)
  toString(): string; // Method to return the grammar in ABNF format
}

export interface Rule {
  name: string; // Rule name
  lower: string; // Lowercased rule name
  index: number; // Rule index
  isBkr: boolean; // Is this a back-reference?
  opcodes?: Opcode[]; // List of opcodes for the rule
}

export type Opcode =
  | { type: 1; children: number[] } // ALT (alternation)
  | { type: 2; children: number[] } // CAT (concatenation)
  | { type: 3; min: number; max: number } // REP (repetition)
  | { type: 4; index: number } // RNM (rule reference)
  | { type: 5; min: number; max: number } // TRG (terminal range)
  | { type: 6 | 7; string: number[] }; // TBS or TLS (byte sequence or literal string)

export type UDT = {}; // User-defined terminals (empty in this grammar)
