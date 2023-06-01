import { defineComponent, h } from 'vue';
import pieces from './pieces.svg.js';
import { isValidPieceName } from './util.js';

export const Piece = defineComponent({
	props: {
		code: String,
		onDrag: Function,
	},

	data() {
		return {
			uuid: crypto.randomUUID(),
		};
	},

	computed: {
		name() {
			return (this.code ?? '')
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
		return (
			<img
				key={this.uuid}
				class="piece"
				id={`piece-${this.code}-${this.uuid}`}
				src={isValidPieceName(this.code) ? pieces[this.code] : this.code ?? ''}
				data-piece-code={this.code}
				data-piece={this.name}
				draggable="true"
				onDragstart={(e) => {
					if (e.dataTransfer != null) {
						e.dataTransfer.setData('text/plain', this.code ?? '');
						e.dataTransfer.effectAllowed = 'move';
					}
					document.body.classList.add('dragging');
					setTimeout(() => this.onDrag?.());
				}}
				onDragend={() => {
					document.body.classList.remove('dragging');
				}}
			/>
		);
	},
});
