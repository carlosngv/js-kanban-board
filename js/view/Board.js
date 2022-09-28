import Column from "./Column.js";

export default class Board {
    constructor( root ) {
        // root is refered to the board <div>
        this.root = root;

        Board.columns().forEach(col => {
            // TODO: create a column instance from Column class
            const newCol = new Column(col.id, col.title);
            this.root.appendChild(newCol.elements.root);
        });
    }

    static columns() {
        return [
            {
                id: 1,
                title: 'Not Started'
            },
            {
                id: 2,
                title: 'In Progress'
            },
            {
                id: 3,
                title: 'Done'
            },
        ];
    }
}
