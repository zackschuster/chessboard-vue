import { defineComponent, h } from 'vue';
import { Chessboard } from './board.js';
import { Piece } from './piece.js';
export const App = defineComponent({
    data() {
        return {
            squaresClicked: [],
            whitePieces: new Map(),
            blackPieces: new Map(),
        };
    },
    mounted() {
        for (const pieceKey of 'KQRNBP'.split('')) {
            const whitePieceName = `w${pieceKey}`;
            const whitePiece = h(Piece, { name: whitePieceName });
            const blackPieceName = `b${pieceKey}`;
            const blackPiece = h(Piece, { name: blackPieceName });
            this.whitePieces.set(whitePieceName, whitePiece);
            this.blackPieces.set(blackPieceName, blackPiece);
        }
    },
    render() {
        return (h("div", { class: "container my-3" },
            h("div", { class: "row" },
                h("div", { class: "col-lg-7 col-md-10 col-12" },
                    h(Chessboard, { ref: "chessboard", onSquareClicked: ({ squareName }) => this.squaresClicked.push(squareName) })),
                h("div", { class: "col-lg-4 col-md-10 col" },
                    h("div", { class: "card p-3" },
                        h("div", { id: "white-pieces", class: "pieces" }, [...this.whitePieces.values()]),
                        h("div", { id: "black-pieces", class: "pieces" }, [...this.blackPieces.values()])),
                    h("div", { class: "card p-3 mt-3" },
                        h("details", null,
                            h("summary", null,
                                this.squaresClicked.length,
                                " Squares Clicked ",
                                h("br", null),
                                " (Click to toggle list view)"),
                            h("ol", { class: "mt-2" }, ...this.squaresClicked.map((x) => h("li", null, x)))))))));
    },
});
//# sourceMappingURL=app.js.map