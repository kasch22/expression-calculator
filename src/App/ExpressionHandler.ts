import {
    Digit, SequenceItem, Operator, SequenceExpressionFactory, SequenceType,
    StringValue
} from './SequenceExpressionFactory';

export class ExpressionHandler {
    constructor(private factory: SequenceExpressionFactory) {}

    public handle(expression: string) {
        // const parts: string[] = expression.split(' ');
        const parts: SequenceItem[] = this.factory.create(expression);

        let finalExpression: SimpleExpression;

        if (parts.length > 3) {
            finalExpression = this.processComplexExpression(parts);
        } else {
            finalExpression = this.toSimpleExpression(parts);
        }

        return finalExpression.resolve();
    }

    private toSimpleExpression(parts: SequenceItem[]): SimpleExpression {
        const first: Digit = parts[0];
        const arithmetic: Operator = parts[1];
        const second: Digit = parts[2];

        return new SimpleExpression(first, second, arithmetic);
    }

    private processComplexExpression(parts: SequenceItem[]): SimpleExpression {
        // Could make a prpcess sequence Object, holds the Sequence items could index of orginal sequence
        // These could contain methods like hasOperator() and do the replacing
        let sequence: any = [...parts];

        [new OperatorPair('/', '*'), new OperatorPair('+', '-')].forEach((operators: OperatorPair) => {
            if (sequence.length === 3) {
                return;
            }

            let hasOperator = this.contains(sequence, operators);
            while (hasOperator) {
                const operatorIndex = this.getIndexOfOperator(sequence, operators);
                const before = operatorIndex - 1;
                const after = operatorIndex + 1;

                const multiplyExpression = this.toSimpleExpression([
                    sequence[before],
                    sequence[operatorIndex],
                    sequence[after]
                ]);
                sequence[operatorIndex] = multiplyExpression.resolveToDigit();
                sequence[before] = undefined;
                sequence[after] =  undefined;
                sequence = sequence.filter((item: string) => item !== undefined);

                hasOperator = this.contains(sequence, operators) && sequence.length > 3;
            }
        });

        if (sequence.length === 3) {
            return this.toSimpleExpression(sequence);
        }
    }

    private contains(collection: SequenceItem[], pair: OperatorPair): boolean {
        const operators = collection
            .filter((item: SequenceItem): boolean => {
                return item.getType() === SequenceType.OPERATOR;
            })
            .map((operator: Operator) => operator.getValue());

        return pair.conatainsOperators(operators);
    }

    private getIndexOfOperator(collection: StringValue[], operators: OperatorPair): number {
       return collection.map((item: StringValue, index: number): number => {
           if (operators.conatainsOperators([item.getValue()])) {
               return index;
           }
        }).filter((index: number): boolean => {
            if (index === null) {
                return false;
            }

            return index >= 0;
        }).shift();
    }
}

class SimpleExpression {
    constructor(private first: Digit, private second: Digit, private arithmetic: Operator) {}

    public resolve(): number {
        let result;

        switch (this.arithmetic.getValue()) {
            case '*':
                result = this.first.getValue() * this.second.getValue();
                break;
            case '/':
                result = this.first.getValue() / this.second.getValue();
                break;
            case '+':
                result = this.first.getValue() + this.second.getValue();
                break;
            case '-':
                result = this.first.getValue() - this.second.getValue();
                break;
        }

        return result;
    }

    public resolveToDigit(): Digit {
        return new Digit(this.resolve().toString());
    }
}

class OperatorPair {
    first: string;
    second: string;

    constructor(first: string, second: string) {
        this.first = first;
        this.second = second;
    }

    conatainsOperators(sequenceOperators: string[]): boolean {
        const operators = new Set([...sequenceOperators]);
        const operatorPair = new Set([this.first, this.second]);
       return !! new Set([...operators].filter(x => operatorPair.has(x))).size;
    }
}
