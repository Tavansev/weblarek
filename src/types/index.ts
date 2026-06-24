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
    payment: TPayment;  // Способ оплаты
    email: string;      // Электронная почта
    phone: string;      // Номер телефона
    address: string;    // Адрес доставки
}

//Интерфейс заказа для отправки на сервер
export interface IOrder {
    items: string[];    // Массив ID товаров в заказе
    total: number;      // Общая стоимость заказа
    payment: TPayment;  // Способ оплаты
    email: string;      // Электронная почта
    phone: string;      // Номер телефона
    address: string;    // Адрес доставки
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