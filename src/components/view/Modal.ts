import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export class Modal extends Component<object> {
    protected _content: HTMLElement | null = null;
    protected _closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this._closeButton = container.querySelector('.modal__close') as HTMLButtonElement;
        
        this._closeButton.addEventListener('click', () => this.close());
        this.container.addEventListener('click', (e) => {
            if (e.target === this.container) {
                this.close();
            }
        });
        
        // Отмена закрытия при клике на контент
        this.container.querySelector('.modal__container')?.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    set content(value: HTMLElement) {
        if (this._content) {
            this._content.remove();
        }
        this._content = value;
        const contentContainer = this.container.querySelector('.modal__content');
        if (contentContainer) {
            contentContainer.append(value);
        }
    }

    open(): void {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close(): void {
        this.container.classList.remove('modal_active');
        this.events.emit('modal:close');
        this._content = null;
    }

    render(data?: object): HTMLElement {
        return this.container;
    }
}