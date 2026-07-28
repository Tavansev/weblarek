import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Basket extends Component<object> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._list = container.querySelector('.basket__list') as HTMLElement;
        this._total = container.querySelector('.basket__price') as HTMLElement;
        this._button = container.querySelector('.basket__button') as HTMLButtonElement;

        if (this._button) {
            this._button.addEventListener('click', () => {
                this.events.emit('basket:order');
            });
        }
    }

    set items(value: HTMLElement[]) {
        if (this._list) {
            this._list.replaceChildren(...value);
        }
    }

    set total(value: number) {
        if (this._total) {
            this._total.textContent = `${value} синапсов`;
        }
    }

    set disabled(value: boolean) {
        if (this._button) {
            this._button.disabled = value;
        }
    }

    render(data?: object): HTMLElement {
        return this.container;
    }
}