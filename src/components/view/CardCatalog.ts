import { Card } from './Card';
import { categoryMap } from '../../utils/constants';
import { IProduct } from '../../types';

export class CardCatalog extends Card<IProduct> {
    protected _category: HTMLElement;
    protected _image: HTMLImageElement;

    constructor(container: HTMLElement, actions?: { onClick?: (event: MouseEvent) => void }) {
        super(container, actions);
        this._category = container.querySelector('.card__category') as HTMLElement;
        this._image = container.querySelector('.card__image') as HTMLImageElement;

        // Клик по всей карточке для открытия preview
        this.container.addEventListener('click', (e) => {
            if (e.target instanceof HTMLElement && !e.target.closest('.card__button')) {
                actions?.onClick?.(e);
            }
        });
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
            this._image.alt = this._title?.textContent || '';
        }
    }
}