import { IApi } from '../types';
import { IProductResponse, IOrder, IOrderResult } from '../types';

// Класс для связи приложения с сервером
export class CommunicationLayer {
    private _api: IApi;

    constructor(api: IApi) {
        this._api = api;
    }

    // GET запрос на /product - получение списка товаров
    getProducts(): Promise<IProductResponse> {
        return this._api.get<IProductResponse>('/product');
    }

    // POST запрос на /order - отправка заказа
    postOrder(order: IOrder): Promise<IOrderResult> {
        return this._api.post<IOrderResult>('/order', order);
    }
}