import { Component } from '../base/Component';
import { IProduct } from '../../types';

export interface ICardActions {
    onClick?: (event: MouseEvent) => void;
}

export class Card<T extends IProduct> extends Component<T> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected actions?: ICardActions) {
        super(container);
        this._title = container.querySelector('.card__title') as HTMLElement;
        this._price = container.querySelector('.card__price') as HTMLElement;
        this._button = container.querySelector('.card__button') as HTMLButtonElement;

        if (this._button && actions?.onClick) {
            this._button.addEventListener('click', actions.onClick);
        }
    }

    set title(value: string) {
        if (this._title) {
            this._title.textContent = value;
        }
    }

    set price(value: number | null) {
        if (this._price) {
            this._price.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
        }
    }

    set buttonText(value: string) {
        if (this._button) {
            this._button.textContent = value;
        }
    }
}