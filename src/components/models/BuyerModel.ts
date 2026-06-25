import { IBuyer, TPayment, IBuyerValidationErrors } from '../../types';
/**
 * Класс модели данных для хранения данных покупателя
 * 
 * Ответственность:
 * - Хранит данные покупателя: вид оплаты, адрес, телефон, email
 */
export class BuyerModel {
    // Способ оплаты
    private _payment: TPayment | null = null;
    
    // Адрес доставки
    private _address: string = '';
    
    // Email
    private _email: string = '';
    
    // Телефон
    private _phone: string = '';

    /**
     * Сохранение способа оплаты
     * @param payment - способ оплаты
     */
    setPayment(payment: TPayment): void {
        this._payment = payment;
    }

    /**
     * Сохранение адреса
     * @param address - адрес
     */
    setAddress(address: string): void {
        this._address = address;
    }

    /**
     * Сохранение email
     * @param email - email
     */
    setEmail(email: string): void {
        this._email = email;
    }

    /**
     * Сохранение телефона
     * @param phone - телефон
     */
    setPhone(phone: string): void {
        this._phone = phone;
    }

    /**
     * Получение всех данных покупателя
     * @returns объект с данными покупателя
     */
    getData(): IBuyer {
        return {
            payment: this._payment,
            email: this._email,
            phone: this._phone,
            address: this._address
        };
    }

    // Очистка данных покупателя
    clear(): void {
        this._payment = null;
        this._address = '';
        this._email = '';
        this._phone = '';
    }

    /**
     * Валидация данных
     * @returns объект с ошибками или пустой объект
     */
    validate(): IBuyerValidationErrors {
        const errors: IBuyerValidationErrors = {};

        if (!this._payment) {
            errors.payment = 'Не выбран способ оплаты';
        }

        if (!this._address.trim()) {
            errors.address = 'Укажите адрес доставки';
        }

        if (!this._email.trim()) {
            errors.email = 'Укажите email';
        }

        if (!this._phone.trim()) {
            errors.phone = 'Укажите номер телефона';
        }

        return errors;
    }
}
