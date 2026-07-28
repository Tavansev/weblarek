import { CardWithImage } from './CardWithImage';
import { IProduct } from '../../types';

export interface ICardPreviewActions {
    onClick: (event: MouseEvent) => void;
}

export class CardPreview extends CardWithImage<IProduct> {
    protected _description: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardPreviewActions) {
        super(container);
        this._description = container.querySelector('.card__text') as HTMLElement;

        if (this._button && actions?.onClick) {
            this._button.addEventListener('click', actions.onClick);
        }
    }

    set description(value: string) {
        if (this._description) {
            this._description.textContent = value;
        }
    }
}