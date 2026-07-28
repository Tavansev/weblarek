import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export abstract class Form<T> extends Component<T> {
    protected _submitButton: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);
        this._submitButton = container.querySelector('.button[type="submit"]') as HTMLButtonElement;
        this._errors = container.querySelector('.form__errors') as HTMLElement;

        // Отслеживаем все изменения в форме
        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name;
            const value = target.value;
            this.onInputChange(field, value);
        });

        // Отслеживаем отправку формы
        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            if (this._submitButton && !this._submitButton.disabled) {
                this.events.emit(`${this.container.name}:submit`, this.getFormData());
            }
        });
    }

    protected abstract onInputChange(field: string, value: string): void;
    protected abstract getFormData(): T;

    set valid(value: boolean) {
        if (this._submitButton) {
            this._submitButton.disabled = !value;
        }
    }

    set errors(value: string) {
        if (this._errors) {
            this._errors.textContent = value;
        }
    }

    render(data?: Partial<T>): HTMLElement {
        return this.container;
    }
}