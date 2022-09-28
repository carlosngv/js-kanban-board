import API from "../api/API.js";
import Item from "./Item.js";
import Dropzone from "./Dropzone.js";

export default class Column {
    constructor( id, title ) {

        const topDropzone = Dropzone.createDropzone();

        this.elements = {};
        this.elements.root = Column.createRoot();
        this.elements.title = this.elements.root.querySelector(".board__col-title");
        this.elements.items = this.elements.root.querySelector(".board__col-items");
        this.elements.addItem = this.elements.root.querySelector(".board__add-item");

        this.elements.root.dataset.id = id;
        this.elements.title.textContent = title;

        // This appendChild will happen before rendering each item
        this.elements.items.appendChild(topDropzone);

        this.elements.addItem.addEventListener("click", () => {
            const newItem = API.insertItem( id, '' );
            this.renderItem( newItem );
        });

        API.getItems( id ).forEach( item => {
            this.renderItem( item );
        });
    }

    // Defining HTML of a based column
    static createRoot() {
        const range = document.createRange();

        range.selectNode( document.body );

        return range.createContextualFragment(`
            <div class="board__col">
                <div class="board__col-title"></div>
                <div class="board__col-items"></div>
                <button class="board__add-item" type="button">Add</button>
            </div>
        `).children[0];
    }

    renderItem( data ) {
        const newItem = new Item(data.id, data.content);

        this.elements.items.appendChild(newItem.elements.root);
    }

}
