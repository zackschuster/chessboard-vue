import { Fragment, defineComponent, h } from 'vue';
import { FILES, START_FEN, START_POSITION } from './constants.js';
import { Piece } from './piece.js';
import { fenToPosition, isValidFen, isValidPositionObject, positionToFen, } from './util.js';
export const Chessboard = defineComponent({
    data() {
        return {
            fenInput: '',
            highlights: new Set(),
            orientation: 'white',
            position: new Map(),
        };
    },
    emits: {
        squareClicked(payload) {
            return payload.squareName;
        },
        positionChanged(payload) {
            return payload.fen;
        },
    },
    computed: {
        fen() {
            return positionToFen(this.position);
        },
    },
    watch: {
        position: {
            handler() {
                this.fenInput = this.fen;
                return this.$emit('positionChanged', { fen: this.fenInput });
            },
            deep: true,
        },
    },
    methods: {
        clearHighlights() {
            this.highlights.clear();
        },
        clearPieces() {
            this.setPosition('clear');
        },
        setStartingPosition() {
            this.setPosition('start');
        },
        setPosition(position) {
            let newPosition;
            if (typeof position === 'string') {
                const positionLowerCase = position.toLowerCase();
                if (positionLowerCase === 'clear') {
                    newPosition = new Map();
                }
                else if (positionLowerCase === 'start') {
                    newPosition = new Map(START_POSITION);
                }
                else if (isValidFen(position)) {
                    newPosition = fenToPosition(position);
                }
                else {
                    newPosition = new Map();
                }
            }
            else if (isValidPositionObject(position)) {
                newPosition = new Map(position);
            }
            else {
                throw new Error(`Invalid value passed to the position method: ${position}`);
            }
            const { position: currentPosition } = this;
            if (positionToFen(currentPosition) !== positionToFen(newPosition)) {
                this.position = newPosition;
            }
        },
        setOrientation(orientation) {
            if (orientation === 'white' || orientation === 'black') {
                this.orientation = orientation;
            }
            else if (orientation === 'flip') {
                this.orientation = this.orientation === 'white' ? 'black' : 'white';
            }
            return this.orientation;
        },
    },
    mounted() {
        this.fenInput = this.fen;
    },
    render() {
        const ranks = Array.from({ length: 8 }).map((_, i) => (h("div", { id: `rank-${i + 1}`, class: "row g-0" }, ...FILES.map((file) => {
            const squareName = `${file}${i + 1}`;
            let squareEl;
            return (h("div", { id: `square-${squareName}`, class: `col square ${this.highlights.has(squareName) ? 'highlight' : ''}`, ref: (ref) => ref instanceof HTMLElement && (squareEl = ref), onClick: () => {
                    if (this.highlights.has(squareName)) {
                        this.highlights.delete(squareName);
                    }
                    else {
                        this.highlights.add(squareName);
                    }
                    this.$emit('squareClicked', { squareName });
                }, onDragover: (e) => {
                    e.preventDefault();
                    if (e.dataTransfer != null) {
                        e.dataTransfer.dropEffect = 'move';
                    }
                    squareEl.classList.add('highlight-drop');
                }, onDragleave: (e) => {
                    e.preventDefault();
                    squareEl.classList.remove('highlight-drop');
                }, onDrop: (e) => {
                    e.preventDefault();
                    if (e.dataTransfer != null) {
                        this.position.set(squareName, e.dataTransfer.getData('text/plain'));
                    }
                    squareEl.classList.remove('highlight-drop');
                } }, this.position.has(squareName) ? (h(Piece, { code: this.position.get(squareName), onDrag: () => {
                    this.position.delete(squareName);
                } })) : undefined));
        }))));
        if (this.orientation === 'white') {
            ranks.reverse();
        }
        return (h(Fragment, null,
            h("div", { id: "board" },
                ranks,
                h("div", { class: "row g-0 ps-4 py-1" }, FILES.map((x) => (h("div", { class: "col text-center" }, x))))),
            h("div", { class: "btn-toolbar justify-content-lg-between justify-content-center mt-2" },
                h("div", { class: "btn-group btn-group-sm mb-1", role: "group" },
                    h("button", { class: "btn btn-outline-primary", type: "button", onClick: () => this.setOrientation('flip'), "aria-label": "Flip board" }, "Flip"),
                    h("button", { class: "btn btn-outline-primary", type: "button", onClick: () => this.clearPieces(), "aria-label": "Clear board of pieces" }, "Clear"),
                    h("button", { class: "btn btn-outline-primary", type: "button", onClick: () => this.clearHighlights(), "aria-label": "Clear board of highlights" }, "Unhighlight")),
                h("div", { class: "input-group input-group-sm" },
                    h("input", { type: "text", class: "form-control", placeholder: "Insert FEN", value: this.fenInput, onChange: (e) => {
                            if (e.target instanceof HTMLInputElement) {
                                this.fenInput = e.target.value;
                            }
                        }, "aria-label": "Custom FEN Input", "aria-describedby": "apply-fen-btn" }),
                    h("button", { class: "btn btn-outline-success", type: "button", id: "apply-fen-btn", onClick: () => {
                            this.setPosition(fenToPosition(this.fenInput));
                        } },
                        h("span", { class: "h5", innerHTML: "&check;" })),
                    h("button", { class: "btn btn-outline-secondary", type: "button", id: "copy-fen-btn", onClick: () => navigator.clipboard.writeText(this.fenInput) },
                        h("span", { class: "h4", innerHTML: "&boxbox;" })))),
            h("div", { class: "row g-0 my-2 justify-content-around", role: "group" },
                h("div", { class: "btn-group btn-group-sm" },
                    h("button", { class: "btn btn-outline-dark", type: "button", onClick: () => {
                            this.fenInput = START_FEN;
                            this.setStartingPosition();
                        } }, "Start Position"),
                    h("button", { class: "btn btn-outline-dark", type: "button", onClick: () => {
                            this.fenInput =
                                'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R';
                            this.setPosition(fenToPosition(this.fenInput));
                        } }, "Ruy Lopez")))));
    },
});
//# sourceMappingURL=board.js.map