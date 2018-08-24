
export class SequenceExpressionFactory {
    create(rawSequence: string): SequenceItem[] {
        const split = rawSequence.split(' ');

        if (!(split.length % 2)) {
            throw new Error('In correct Sequence please check');
        }

        const processed = this.process(split);

        if (processed.indexOf(undefined) !== -1) {
            throw new Error('Unknown operator in : ' + split);
        }

        return processed;
    }

    private process(parts: string[]): SequenceItem[] {
        parts = parts.reduce((processed: string[], part: string): string[] => {
            if (!part.includes('(') && !part.includes(')')) {
                processed.push(part);

                return processed;
            }

            part.split('').forEach((subpart: string) => processed.push(subpart));

            return processed;
        }, []);


        return parts.map((part: string, index: number): SequenceItem => {
            const toInt = parseInt(part, 10);

            if (isNaN(toInt)) {
                return this.createNoneDigit(part, index);
            }

            return this.createDigit(part);
        });
    }

    private createNoneDigit(part: string, sequenceIndex: number): SequenceItem {
        if (['*', '/', '+', '-'].indexOf(part) === -1) {
            return this.createBracket(part, sequenceIndex);
        }

        return new Operator(part, sequenceIndex);
    }

    private createBracket(bracket: string, sequenceIndex: number): Bracket {
        if (bracket === '(') {
            return new OpenBracket(sequenceIndex);
        }

        if (bracket === ')') {
            return new CloseBracket(sequenceIndex);
        }
    }

    private createDigit(part: string): SequenceItem {
        return new Digit(part);
    }
}

export class Digit implements SequenceItem, NumberValue {
    private value: number;
    private type: SequenceType;

    constructor(value: string) {
        this.value = parseInt(value, 10);
        this.type = SequenceType.DIGIT;
    }

    getType(): SequenceType {
        return this.type;
    }

    // Add a getStringValue() method, this will help with Typing

    getValue(): number {
        return this.value;
    }
}

export class Operator implements SequenceItem, StringValue {
    private value: string;
    private type: SequenceType;
    private sequenceIndex: number;

    constructor(value: string, sequenceIndex: number) {
        this.value = value;
        this.type = SequenceType.OPERATOR;
        this.sequenceIndex = sequenceIndex;
    }

    getType(): SequenceType {
        return this.type;
    }

    getValue(): string {
        return this.value;
    }
}

export interface SequenceItem {
    getType(): SequenceType;
}

export interface NumberValue {
    getValue(): number;
}

export interface StringValue {
    getValue(): string;
}

export enum SequenceType {
    OPERATOR = 'OPERATOR',
    DIGIT = 'DIGIT',
    BRACKET = 'BRACKET'
}

export interface Bracket extends SequenceItem {
    getIndex(): number;
    isOpen(): boolean;
    isClose(): boolean;
}

export class OpenBracket implements Bracket {
    private closingBracketIndex: number;

    constructor(private sequenceIndex: number, private openType = true) {}

    getIndex(): number {
        return this.sequenceIndex;
    }

    getType(): SequenceType {
        return SequenceType.BRACKET;
    }

    setCloseIndex(closeBracket: CloseBracket) {
        this.closingBracketIndex = closeBracket.getIndex();
    }

    getCloseIndex(): number {
        return this.closingBracketIndex;
    }

    isOpen(): boolean {
        return this.openType;
    }

    isClose(): boolean {
        return !this.openType;
    }
}

export class CloseBracket implements Bracket {
    private openBracketIndex: number;

    constructor(private sequenceIndex: number, private openType = false) {}

    getIndex(): number {
        return this.sequenceIndex;
    }

    setOpenIndex(closeBracket: OpenBracket) {
        this.openBracketIndex = closeBracket.getIndex();
    }

    getOpenIndex(): number {
        return this.openBracketIndex;
    }

    getType(): SequenceType {
        return SequenceType.BRACKET;
    }

    isOpen(): boolean {
        return this.openType;
    }

    isClose(): boolean {
        return !this.openType;
    }
}