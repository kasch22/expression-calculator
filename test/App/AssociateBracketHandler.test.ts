import { AssociateBracketHandler } from '../../src/App/AssociateBracketHandler';
import {Bracket, CloseBracket, Digit, OpenBracket, Operator} from '../../src/App/SequenceExpressionFactory';

describe('ExpressionHandler Test', () => {
    let handler: AssociateBracketHandler;

    beforeEach(() => {
        handler = new AssociateBracketHandler();
    });

    it('can associate two brackets together', () => {
        const openBracket = new OpenBracket(0);
        const closeBracket = new CloseBracket(4);

        const sequence =  handler.handle([
            openBracket,
            new Digit('2'),
            new Operator('+', 2),
            new Digit('2'),
            closeBracket
        ]);

        expect(openBracket.getCloseIndex()).toBe(4);
        expect(closeBracket.getOpenIndex()).toBe(0);
    });

    it('can associate multiple brackets together', () => {
        const openOne = new OpenBracket(0);
        const closeOne = new CloseBracket(8);
        const openTwo = new OpenBracket(3);
        const closeTwo = new CloseBracket(7);

        const sequence = handler.handle([
            openOne,
            new Digit('2'),
            new Operator('+', 2),
            openTwo,
            new Digit('2'),
            new Operator('+', 2),
            new Digit('2'),
            closeTwo,
            closeOne
        ]);

        const processedOpenOne: OpenBracket = <OpenBracket> sequence[openOne.getIndex()];
        const processedCloseOne: CloseBracket = <CloseBracket> sequence[closeOne.getIndex()];
        const processedOpenTwo: OpenBracket = <OpenBracket> sequence[openTwo.getIndex()];
        const processedCloseTwo: CloseBracket = <CloseBracket> sequence[closeTwo.getIndex()];

        expect(processedOpenOne.getCloseIndex()).toBe(8);
        expect(processedCloseOne.getOpenIndex()).toBe(0);
        expect(processedOpenTwo.getCloseIndex()).toBe(7);
        expect(processedCloseTwo.getOpenIndex()).toBe(3);
    });

    it('can process multiple sets of brackets, (2 / 3) + (4 * 5)', () => {
        const openOne = new OpenBracket(0);
        const closeOne = new CloseBracket(4);
        const openTwo = new OpenBracket(6);
        const closeTwo = new CloseBracket(10);

        const sequence = handler.handle([
            openOne,
            new Digit('2'),
            new Operator('/', 2),
            new Digit('3'),
            closeOne,
            new Operator('+', 2),
            openTwo,
            new Digit('4'),
            new Operator('*', 2),
            new Digit('5'),
            closeTwo,
        ]);

        const processedOpenOne: OpenBracket = <OpenBracket> sequence[openOne.getIndex()];
        const processedCloseOne: CloseBracket = <CloseBracket> sequence[closeOne.getIndex()];
        const processedOpenTwo: OpenBracket = <OpenBracket> sequence[openTwo.getIndex()];
        const processedCloseTwo: CloseBracket = <CloseBracket> sequence[closeTwo.getIndex()];

        expect(processedOpenOne.getCloseIndex()).toBe(4);
        expect(processedCloseOne.getOpenIndex()).toBe(0);
        expect(processedOpenTwo.getCloseIndex()).toBe(10);
        expect(processedCloseTwo.getOpenIndex()).toBe(6);
    });
});
