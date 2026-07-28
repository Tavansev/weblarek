import { Form } from './Form';
import { IEvents } from '../base/Events';

export interface IContactsForm {
    email: string;
    phone: string;
}

export class ContactsForm extends Form<IContactsForm> {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._emailInput = container.querySelector('input[name="email"]') as HTMLInputElement;
        this._phoneInput = container.querySelector('input[name="phone"]') as HTMLInputElement;
    }

    protected onInputChange(field: string, value: string): void {
        if (field === 'email') {
            this.events.emit('contacts:emailChange', { email: value });
        } else if (field === 'phone') {
            this.events.emit('contacts:phoneChange', { phone: value });
        }
    }

    protected getFormData(): IContactsForm {
        return {
            email: this._emailInput?.value || '',
            phone: this._phoneInput?.value || ''
        };
    }

    set email(value: string) {
        if (this._emailInput) {
            this._emailInput.value = value;
        }
    }

    set phone(value: string) {
        if (this._phoneInput) {
            this._phoneInput.value = value;
        }
    }
}