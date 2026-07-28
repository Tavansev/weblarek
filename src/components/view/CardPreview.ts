import { CardCatalog } from './CardCatalog';
import { IProduct } from '../../types';

export class CardPreview extends CardCatalog {
    protected _description: HTMLElement;

    constructor(container: HTMLElement, actions?: { onClick?: (event: MouseEvent) => void }) {
        super(container, actions);
        this._description = container.querySelector('.card__text') as HTMLElement;
        
        // Кнопка "В корзину" уже есть в родителе
        // Переопределяем текст кнопки если товар уже в корзине
    }

    set description(value: string) {
        if (this._description) {
            this._description.textContent = value;
        }
    }

    set inBasket(value: boolean) {
        if (this._button) {
            this._button.textContent = value ? 'Убрать из корзины' : 'В корзину';
        }
    }
}