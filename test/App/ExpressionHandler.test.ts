import {ExpressionHandler} from "../../src/App/ExpressionHandler";
import {SequenceExpressionFactory} from "../../src/App/SequenceExpressionFactory";

describe('ExpressionHandler Test', () => {
    let handler: ExpressionHandler;

    // BoDMAS = Brackets, Division and Multiplication, Addition and Subtraction
    // It might be that BodMas has different rules

    beforeEach(() => {
        handler = new ExpressionHandler(new SequenceExpressionFactory());
    });

    describe('simple sequences', () => {
        it('should calculate \'2x10=20\'', () => {
            const result = handler.handle('2 * 10');

            expect(result).toBe(20);
        });

        it('should calculate \'2+10=12\'', () => {
            const result = handler.handle('2 + 12');

            expect(result).toBe(14);
        });

        it('should calculate \'2+0=2\'', () => {
            const result = handler.handle('2 + 0');

            expect(result).toBe(2);
        });

        it('should calculate \'2+3*2=8\'', () => {
            const result = handler.handle('2 + 3 * 2');

            expect(result).toBe(8);
        });

        it('should calculate \'2+3*2*2=8\'', () => {
            const result = handler.handle('2 + 3 * 2 * 2');

            expect(result).toBe(14);
        });


        it('should calculate \'2+3*2*2*3=38\'', () => {
            const result = handler.handle('2 + 3 * 2 * 2 * 3');

            expect(result).toBe(38);
        });

        it('should calculate \'6 / 2 * 3 = 9\'', () => {
            const result = handler.handle('6 / 2 * 3');

            expect(result).toBe(9);
        });

        it('should calculate \'20 / 2 * 3 + 5 - 15 = 20\'', () => {
            const result = handler.handle('20 / 2 * 3 + 5 - 15');

            expect(result).toBe(20);
        });
    });

    describe('complex bodmas equations',  () => {
        it('should calculate \' 20 - 5 * 6 / 2 + 4 = 9 \'', () => {
            const result = handler.handle('20 - 5 * 6 / 2 + 4');

            expect(result).toBe(9);
        });

        // Add more + longer complex equations
    });

    describe('seqences with brackets resolve correctly', () => {
        // Add bracket functionality

    });
});
