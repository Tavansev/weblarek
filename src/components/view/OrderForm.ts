import { Form } from './Form';
import { TPayment } from '../../types';

export interface IOrderForm {
    payment: TPayment | null;
    address: string;
}

export class OrderForm extends Form<IOrderForm> {
    protected _paymentButtons: HTMLButtonElement[];
    protected _addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._paymentButtons = Array.from(container.querySelectorAll('.order__buttons .button')) as HTMLButtonElement[];
        this._addressInput = container.querySelector('input[name="address"]') as HTMLInputElement;

        // Обработка кликов по кнопкам оплаты
        this._paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                const payment = button.name as TPayment;
                this.setPayment(payment);
                this.events.emit('order:paymentChange', { payment });
            });
        });
    }

    protected onInputChange(field: string, value: string): void {
        if (field === 'address') {
            this.events.emit('order:addressChange', { address: value });
        }
    }

    protected getFormData(): IOrderForm {
        return {
            payment: this.getSelectedPayment(),
            address: this._addressInput?.value || ''
        };
    }

    set payment(value: TPayment) {
        this._paymentButtons.forEach(button => {
            const isActive = button.name === value;
            button.classList.toggle('button_alt-active', isActive);
        });
    }

    set address(value: string) {
        if (this._addressInput) {
            this._addressInput.value = value;
        }
    }

    private getSelectedPayment(): TPayment | null {
        const activeButton = this._paymentButtons.find(btn => 
            btn.classList.contains('button_alt-active')
        );
        return activeButton ? activeButton.name as TPayment : null;
    }

    reset(): void {
        this.payment = null as unknown as TPayment;
        this.address = '';
        this.valid = false;
    }
}