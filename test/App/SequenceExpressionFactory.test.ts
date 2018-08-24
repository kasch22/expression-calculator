import {
    CloseBracket, Digit, OpenBracket, Operator,
    SequenceExpressionFactory
} from "../../src/App/SequenceExpressionFactory";
import {Error} from "tslint/lib/error";

describe('ExpressionHandler Test', () => {
    let factory: SequenceExpressionFactory;

    beforeEach(() => {
        factory = new SequenceExpressionFactory();
    });

    describe('none bracket sequences', () => {
        it('should return parsed sequence', () => {
            const result = factory.create('2 * 10');

            expect(result).toEqual([new Digit('2'), new Operator('*', 1), new Digit('10')]);
        });

        it('should return parsed sequence with all operators', () => {
            const result = factory.create('3 + 10 - 1 * 4 / 6');

            expect(result).toEqual([
                new Digit('3'),
                new Operator('+', 1),
                new Digit('10'),
                new Operator('-', 3),
                new Digit('1'),
                new Operator('*', 5),
                new Digit('4'),
                new Operator('/', 7),
                new Digit('6')
            ]);
        });

        it('should throw an error for unrecognised operators', () => {
            expect.assertions(1)

            try {
                factory.create('3 & 6');
            } catch (e) {
                expect(e.message).toBe('Unknown operator in : 3,&,6');
            }
        });

        it('should throw error if sequence length is even', () => {
            expect.assertions(1)

            try {
                factory.create('3 + 6 *');
            } catch (e) {
                expect(e.message).toBe('In correct Sequence please check');
            }
        });
    });

    describe('with brackets', () => {
        it('can process brackets',  () => {
            const result = factory.create('2 * 10 + (4 + 6)');

            expect(result).toEqual([
                new Digit('2'),
                new Operator('*', 1),
                new Digit('10'),
                new Operator('+', 3),
                new OpenBracket(4),
                new Digit('4'),
                new Operator('+', 6),
                new Digit('6'),
                new CloseBracket(8),
            ]);
        });
    });
});
