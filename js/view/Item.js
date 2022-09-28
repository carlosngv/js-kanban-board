import API from "../api/API.js";
import Dropzone from "./Dropzone.js";

export default class Item {
    constructor(id, content) {

        const bottomDropzone = Dropzone.createDropzone();

        this.elements = {};
        this.elements.root = Item.createRoot();
        this.elements.input = this.elements.root.querySelector(".board__item-input");

        this.elements.root.dataset.id = id;
        this.elements.input.textContent = content;

        this.content = content;

        this.elements.root.appendChild(bottomDropzone);

        const onBlur = () => {
            const newContent = this.elements.input.textContent.trim();

            if(newContent == this.content) return;

            this.content = newContent;
            API.updateItem(id, {
                content: this.content,
            });
        }

        // ? Blur is when you lose focus from the text input
        this.elements.input.addEventListener("blur",  onBlur);

        // ? Double click event within the Item container
        this.elements.root.addEventListener("dblclick", () => {
            const check = confirm("Are you sure you want to delete this task?");
            if(!check) return;
            API.deleteItem(id);
            this.elements.input.removeEventListener("blur", onBlur);
            this.elements.root.parentElement.removeChild(this.elements.root);
        });

        this.elements.root.addEventListener("dragstart", e => {
            e.dataTransfer.setData("text/plain", id);
            console.log('Item to be dragged:', id);
        });

        this.elements.input.addEventListener("drop", e => {
            e.preventDefault();
        });

    }

    static createRoot() {
        const range = document.createRange();

        range.selectNode( document.body );

        return range.createContextualFragment(`
            <div class="board__item" draggable="true">
                <div class="board__item-input" contenteditable></div>
            </div>
        `).children[0];

    }


}
