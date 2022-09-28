import API from '../api/API.js';

export default class Dropzone {
    static createDropzone() {
        const range = document.createRange();

        range.selectNode( document.body );

        const dropzone = range.createContextualFragment(`
            <div class="board__dropzone"></div>
        `).children[0];

        dropzone.addEventListener("dragover", e => {
            e.preventDefault();
            dropzone.classList.add('board__dropzone--active');
        });

        dropzone.addEventListener("dragleave", () => {
            dropzone.classList.remove('board__dropzone--active');
        });

        dropzone.addEventListener('drop', e => {
            e.preventDefault();
            dropzone.classList.remove('board__dropzone--active');

            const currentColumn = dropzone.closest('.board__col');
            const columnId = Number(currentColumn.dataset.id);
            const dropzonesInColumn = Array.from(currentColumn.querySelectorAll('.board__dropzone'));
            const droppedIndex = dropzonesInColumn.indexOf(dropzone);
            const itemId = Number(e.dataTransfer.getData("text/plain"));
            const droppedItemElement = document.querySelector(`[data-id="${itemId}"]`);
            const insertAfter = dropzone.parentNode.classList.contains('board__item') ? dropzone.parentElement : dropzone;

            if(droppedItemElement.contains(dropzone)) return;

            insertAfter.after(droppedItemElement);

            API.updateItem(itemId, {
                colId: columnId,
                position: droppedIndex,
            });
        });

        return dropzone;
    }
}
