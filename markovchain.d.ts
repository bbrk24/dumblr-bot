declare class MarkovChain {
    constructor(contents: string, normFn?: (this: MarkovChain, word: string) => string);
    wordBank: Record<string, Record<string, number>>;
    sentence: string;
    parseBy: RegExp;
    startFn: (this: MarkovChain, wordList: typeof this.wordBank) => string;
    endFn: (this: MarkovChain) => boolean;
    process(): string;
    parse(text?: string, parseBy?: RegExp): this;
    start(fnStr: string | typeof this.startFn): this;
    end(fnStrOrNum: string | number | undefined | typeof this.endFn): this;
    normalize(fn: (this: MarkovChain, word: string) => string): this;
    static get VERSION(): string;
    static get MarkovChain(): Function;
}
module.exports = MarkovChain;
