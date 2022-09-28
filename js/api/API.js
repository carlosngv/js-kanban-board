export default class API {

    static getItems( colId ) {
        // ? Column refers to each column of the Kanban board (To do, in progress or done).
        const column = read().find( column => colId == column.id );
        if( !column ) {
            return [];
        }

        return column.items;

    }

    static insertItem( colId, content ) {
        const data = read();
        const column = data.find( column => colId == column.id );
        const item = {
            id: Math.floor( Math.random() * 1000000 ),
            content,
        };

        if( !column ) throw new Error('Column does not exist');

        column.items.push( item );
        save( data );

        return item;

    }

    static updateItem( itemId, newProps ) {
        const data = read();
        const [ item, currentCol ] = (() => {
            for( let column of data ) {
                const item = column.items.find( item => itemId == item.id );
                if( item ) return [item, column];
            }
        })();

        if( !item ) throw new Error('Item not found.');

        item.content = newProps.content === undefined ? item.content : newProps.content;

        // Update column AND position (Drag and drop)
        if(
            newProps.colId !== undefined
            && newProps.position !== undefined
        ) {
            let targetColumn = data.find( column => newProps.colId === column.id );
            if( !targetColumn ) throw new Error('Target column not found.');

            // Delete the item from it's current column
            // ? Replaces 1 item at indexOf(item) with nothing (Removes it)
            currentCol.items.splice(currentCol.items.indexOf(item), 1);

            // Moving item to new column and position
            // By setting 0 we indicate to NOT delete any item in the items array
            // ? Inserts at index 'newProps.position', replaces 0 elements, inserts 'item'
            targetColumn.items.splice(newProps.position, 0, item);
        }

        save( data );
    }

    static deleteItem( itemId ) {
        const data = read();
        for(let column of data) {
            const item = column.items.find(item => item.id == itemId);
            if( item ) {
                column.items.splice(column.items.indexOf(item), 1);
                break;
            }
        }
        save( data );
    }


}

function read() {
    const json = localStorage.getItem('board-data');

    if(!json) {
        return [
            {
                id: 1,
                items: []
            },
            {
                id: 2,
                items: []
            },
            {
                id: 3,
                items: []
            },
        ]
    }

    return JSON.parse(json);

}


function save( data ) {
    localStorage.setItem('board-data', JSON.stringify( data ) );
}
