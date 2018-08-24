import { Bracket, CloseBracket, OpenBracket, SequenceItem, SequenceType } from './SequenceExpressionFactory';
import {seq} from "async";

export class AssociateBracketHandler {
    handle(sequence: SequenceItem[]) {

        const split: any[] = this.split(sequence)




        return this.processBracketSet(sequence);
    }

    private processBracketSet(sequence: SequenceItem[]): SequenceItem[] {
        const brackets = sequence.filter((part: SequenceItem): boolean => part.getType() === SequenceType.BRACKET);
        const openBrackets = brackets.filter((bracket: Bracket): boolean => bracket.isOpen());
        const closeBrackets = brackets.filter((bracket: Bracket): boolean => bracket.isClose()).reverse();

        openBrackets.forEach((openBracket: OpenBracket, index) => {
            const closeBracket = <CloseBracket> closeBrackets[index];
            openBracket.setCloseIndex(closeBracket);
            closeBracket.setOpenIndex(openBracket);
        });

        return sequence;
    }

    private split(sequence: SequenceItem[]): Array<SequenceItem>[] {
        const split = [];

        sequence.forEach((item: SequenceItem, index: number) => {
            if (item.getType() !== SequenceType.OPERATOR) {
                return;
            }

            // is before close bracket and after open bracket
            if (this.isOperatorNextCloseAndOpenBrackets(sequence, index)) {

            }
        });


        return [];
    }

    // Move this into a tested spec class
    private isOperatorNextCloseAndOpenBrackets(sequence: SequenceItem[], operatorIndex: number) {
        const before = sequence[operatorIndex - 1];
        const after = sequence[operatorIndex + 1];

        if (before.getType() === SequenceType.BRACKET && after.getType() === SequenceType.BRACKET) {

            // cast before and after to brackets


        }
    }
}