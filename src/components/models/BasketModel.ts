import { IProduct } from '../../types';
import { IEvents } from '../base/Events';

/**
 * Класс модели данных для хранения корзины с покупками
 * 
 * Ответственность:
 * - Хранит массив товаров в корзине
 * - Управляет добавлением и удалением товаров
 */
export class BasketModel {
    // Массив товаров в корзине
    private _items: IProduct[] = [];

    /**
     * Конструктор
     * @param events - брокер событий
     */
    constructor(protected events: IEvents) {}

    /**
     * Получение массива товаров, которые находятся в корзине
     * @returns массив товаров
     */
    getItems(): IProduct[] {
        return this._items;
    }

    /**
     * Добавление товара в массив корзины
     * @param product - товар для добавления
     */
    addItem(product: IProduct): void {
        if (!this.contains(product.id)) {
            this._items.push(product);
            this.emitChange();
        }
    }

    /**
     * Удаление товара из массива корзины
     * @param id - ID товара для удаления
     */
    removeItem(id: string): void {
        this._items = this._items.filter(item => item.id !== id);
        this.emitChange();
    }

    /**
     * Очистка корзины
     */
    clear(): void {
        this._items = [];
        this.emitChange();
    }

    /**
     * Получение стоимости всех товаров в корзине
     * @returns общая стоимость
     */
    getTotal(): number {
        return this._items.reduce((sum, item) => sum + (item.price ?? 0), 0);
    }

    /**
     * Получение количества товаров в корзине
     * @returns количество товаров
     */
    getCount(): number {
        return this._items.length;
    }

    /**
     * Проверка наличия товара в корзине по его id
     * @param id - ID товара
     * @returns true, если товар есть в корзине
     */
    contains(id: string): boolean {
        return this._items.some(item => item.id === id);
    }

    /**
     * Генерация события об изменении корзины
     */
    private emitChange(): void {
        this.events.emit('basket:changed', {
            items: this._items,
            total: this.getTotal(),
            count: this.getCount()
        });
    }
}