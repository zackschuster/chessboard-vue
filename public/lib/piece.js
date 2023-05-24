import { defineComponent, h } from 'vue';
import pieces from './pieces.svg.js';
import { isValidPieceName } from './util.js';
export const Piece = defineComponent({
    props: {
        name: String,
        onDrag: Function,
    },
    data() {
        return {
            uuid: crypto.randomUUID(),
        };
    },
    computed: {
        fullName() {
            return (this.name ?? '')
                .replace('P', 'Pawn')
                .replace('N', 'Knight')
                .replace('B', 'Bishop')
                .replace('R', 'Rook')
                .replace('Q', 'Queen')
                .replace('K', 'King')
                .replace('w', 'White ')
                .replace('b', 'Black ');
        },
    },
    render() {
        return (h("img", { key: this.uuid, class: "piece", id: `piece-${this.name}-${this.uuid}`, src: isValidPieceName(this.name) ? pieces[this.name] : this.name ?? '', "data-piece-code": this.name, "data-piece": this.fullName, draggable: "true", onDragstart: (e) => {
                if (e.dataTransfer != null) {
                    e.dataTransfer.setData('text/plain', this.name ?? '');
                }
                document.body.classList.add('dragging');
                setTimeout(() => this.onDrag?.());
            }, onDragend: () => {
                document.body.classList.remove('dragging');
            } }));
    },
});
//# sourceMappingURL=piece.js.map