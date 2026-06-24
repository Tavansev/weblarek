export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

//Интерфейс товара
export interface IProduct {
    id: string;          // Уникальный идентификатор товара
    description: string; // Описание товара
    image: string;       // Путь к изображению товара
    title: string;       // Название товара
    category: string;    // Категория товара
    price: number | null; // Цена товара в синапсах (null означает "бесценно")
}

//Тип способа оплаты
export type TPayment = 'card' | 'cash';

//Интерфейс данных покупателя
export interface IBuyer {
    payment: TPayment | null;  // Способ оплаты
    email: string;      // Электронная почта
    phone: string;      // Номер телефона
    address: string;    // Адрес доставки
}

//Интерфейс ошибок валидации данных покупателя
export interface IBuyerValidationErrors {
    payment?: string;  // Ошибка в способе оплаты
    email?: string;    // Ошибка в email
    phone?: string;    // Ошибка в телефоне
    address?: string;  // Ошибка в адресе
}

//Интерфейс заказа для отправки на сервер
export interface IOrder extends IBuyer {
    items: string[];    // Массив ID товаров в заказе
    total: number;      // Общая стоимость заказа
}

//Интерфейс ответа сервера при получении списка товаров
export interface IProductResponse {
    total: number;      // Общее количество товаров
    items: IProduct[];  // Массив товаров
}

//Интерфейс ответа сервера при оформлении заказа
export interface IOrderResult {
    id: string;         // ID заказа
    total: number;      // Списано синапсов
}