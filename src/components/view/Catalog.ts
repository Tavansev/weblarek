import { Component } from '../base/Component';

export class Catalog extends Component<object> {
    protected _items: HTMLElement[] = [];

    constructor(container: HTMLElement) {
        super(container);
    }

    set items(value: HTMLElement[]) {
        this._items = value;
        this.container.replaceChildren(...value);
    }

    render(data?: object): HTMLElement {
        return this.container;
    }
}