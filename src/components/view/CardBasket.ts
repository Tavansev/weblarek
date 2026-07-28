import { Card } from './Card';
import { IProduct } from '../../types';

export class CardBasket extends Card<IProduct> {
    protected _index: HTMLElement;
    protected _deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: { onDelete?: (event: MouseEvent) => void }) {
        super(container);
        this._index = container.querySelector('.basket__item-index') as HTMLElement;
        this._deleteButton = container.querySelector('.basket__item-delete') as HTMLButtonElement;

        if (this._deleteButton && actions?.onDelete) {
            this._deleteButton.addEventListener('click', actions.onDelete);
        }
    }

    set index(value: number) {
        if (this._index) {
            this._index.textContent = String(value);
        }
    }
}