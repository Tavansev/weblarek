import { IProduct } from '../../types';

//Класс модели данных для хранения корзины с покупками
export class BasketModel {
    // Массив товаров в корзине
    private _items: IProduct[] = [];

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
        }
    }

    /**
     * Удаление товара из массива корзины
     * @param id - ID товара для удаления
     */
    removeItem(id: string): void {
        this._items = this._items.filter(item => item.id !== id);
    }

    //Очистка корзины
    clear(): void {
        this._items = [];
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
}