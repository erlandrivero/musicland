/**
 * Type declarations for nspell
 * Since @types/nspell doesn't exist, we create our own minimal types
 */

declare module 'nspell' {
  interface NSpellOptions {
    aff: Buffer | string;
    dic: Buffer | string;
  }

  interface NSpell {
    correct(word: string): boolean;
    suggest(word: string): string[];
    spell(word: string): boolean;
    add(word: string): void;
    remove(word: string): void;
    wordCharacters(): string;
    dictionary(buf: Buffer | string): void;
    personal(buf: Buffer | string): void;
  }

  function nspell(options: NSpellOptions): NSpell;
  
  export = nspell;
}

declare module 'dictionary-en' {
  interface Dictionary {
    aff: Uint8Array;
    dic: Uint8Array;
  }
  
  function dictionary(): Promise<Dictionary>;
  
  export = dictionary;
}

declare module 'dictionary-es' {
  interface Dictionary {
    aff: Uint8Array;
    dic: Uint8Array;
  }
  
  function dictionary(): Promise<Dictionary>;
  
  export = dictionary;
}
