import { IProduct } from '../../types';

/**
 * Класс модели данных для хранения каталога товаров
 * 
 * Ответственность:
 * - Хранит массив всех товаров
 * - Хранит товар, выбранный для подробного отображения
 */
export class CatalogModel {
    // Массив всех товаров
    private _items: IProduct[] = [];
    
    // ID товара для подробного отображения
    private _preview: string | null = null;

    /**
     * Сохраняет массив товаров
     * @param items - массив товаров
     */
    setItems(items: IProduct[]): void {
        this._items = items;
    }

    /**
     * Получение массива товаров из модели
     * @returns массив товаров
     */
    getItems(): IProduct[] {
        return this._items;
    }

    /**
     * Получение одного товара по его id
     * @param id - ID товара
     * @returns товар или undefined
     */
    getItem(id: string): IProduct | undefined {
        return this._items.find(item => item.id === id);
    }

    /**
     * Сохраняет товар для подробного отображения
     * @param id - ID товара
     */
    setPreview(id: string | null): void {
        this._preview = id;
    }

    /**
     * Получение товара для подробного отображения
     * @returns ID товара или null
     */
    getPreview(): string | null {
        return this._preview;
    }
}
