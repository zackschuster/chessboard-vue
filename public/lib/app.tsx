import { defineComponent, h } from 'vue';
import { Chessboard } from './board.js';
import { Piece } from './piece.js';

export const App = defineComponent({
	data(): {
		squaresClicked: string[];
		whitePieces: Map<string, JSX.Element>;
		blackPieces: Map<string, JSX.Element>;
	} {
		return {
			squaresClicked: [],
			whitePieces: new Map(),
			blackPieces: new Map(),
		};
	},
	mounted() {
		for (const pieceKey of 'KQRNBP'.split('')) {
			const whitePieceName = `w${pieceKey}`;
			const whitePiece = <Piece code={whitePieceName} />;

			const blackPieceName = `b${pieceKey}`;
			const blackPiece = <Piece code={blackPieceName} />;

			this.whitePieces.set(whitePieceName, whitePiece);
			this.blackPieces.set(blackPieceName, blackPiece);
		}
	},
	render() {
		return (
			<div class="container my-3">
				<div class="row">
					<div class="col-lg-7 col-md-10 col-12">
						<Chessboard
							ref="chessboard"
							onSquareClicked={({ squareName }) =>
								this.squaresClicked.push(squareName)
							}
						/>
					</div>
					<div class="col-lg-4 col-md-10 col">
						<div class="card p-3">
							<div id="white-pieces" class="pieces">
								{[...this.whitePieces.values()]}
							</div>

							<div id="black-pieces" class="pieces">
								{[...this.blackPieces.values()]}
							</div>
						</div>
						<div class="card p-3 mt-3">
							<details>
								<summary>
									{this.squaresClicked.length} Squares Clicked <br /> (Click to
									toggle list view)
								</summary>
								<ol class="mt-2">
									{...this.squaresClicked.map((x) => <li>{x}</li>)}
								</ol>
							</details>
						</div>
					</div>
				</div>
			</div>
		);
	},
});
