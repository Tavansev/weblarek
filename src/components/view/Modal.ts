import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Modal extends Component<object> {
    protected _closeButton: HTMLButtonElement;
    protected _contentContainer: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._closeButton = container.querySelector('.modal__close') as HTMLButtonElement;
        this._contentContainer = container.querySelector('.modal__content') as HTMLElement;
        
        this._closeButton.addEventListener('click', () => this.close());
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) {
                this.close();
            }
        });
        
        this.container.querySelector('.modal__container')?.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    set content(value: HTMLElement) {
        this._contentContainer.replaceChildren(value);
    }

    open(): void {
        this.container.classList.add('modal_active');
    }

    close(): void {
        this.container.classList.remove('modal_active');
        this._contentContainer.replaceChildren();
    }

    render(data?: object): HTMLElement {
        return this.container;
    }
}