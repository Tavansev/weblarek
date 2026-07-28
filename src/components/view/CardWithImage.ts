import { Card } from './Card';
import { categoryMap } from '../../utils/constants';
import { IProduct } from '../../types';

export class CardWithImage<T extends IProduct> extends Card<T> {
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement) {
        super(container);
        this._category = container.querySelector('.card__category') as HTMLElement;
        this._image = container.querySelector('.card__image') as HTMLImageElement;
        this._button = container.querySelector('.card__button') as HTMLButtonElement;
    }

    set category(value: string) {
        if (this._category) {
            this._category.textContent = value;
            const modifier = categoryMap[value as keyof typeof categoryMap] || 'card__category_other';
            this._category.className = `card__category ${modifier}`;
        }
    }

    set image(value: string) {
        if (this._image) {
            this._image.src = value;
        }
    }

    set buttonText(value: string) {
        if (this._button) {
            this._button.textContent = value;
        }
    }

    set buttonDisabled(value: boolean) {
        if (this._button) {
            this._button.disabled = value;
        }
    }
}