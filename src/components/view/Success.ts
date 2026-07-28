import { Component } from '../base/Component';

export interface ISuccessActions {
    onClick: (event: MouseEvent) => void;
}

export class Success extends Component<object> {
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);
        this._total = container.querySelector('.order-success__description') as HTMLElement;
        this._button = container.querySelector('.order-success__close') as HTMLButtonElement;

        if (this._button) {
            this._button.addEventListener('click', actions.onClick);
        }
    }

    set total(value: number) {
        if (this._total) {
            this._total.textContent = `Списано ${value} синапсов`;
        }
    }

    render(data?: object): HTMLElement {
        return this.container;
    }
}