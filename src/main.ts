import './scss/styles.scss';

// Импорт тестовых данных
import { apiProducts } from './utils/data';

// Импорт моделей данных из папки models
import { CatalogModel } from './components/models/CatalogModel';
import { BasketModel } from './components/models/BasketModel';
import { BuyerModel } from './components/models/BuyerModel';

// Импорт для работы с сервером
import { CommunicationLayer } from './components/CommunicationLayer';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';

// Тестирование CatalogModel
console.log('--- CatalogModel ---');
const catalogModel = new CatalogModel();
catalogModel.setItems(apiProducts.items);
console.log('Массив товаров из каталога:', catalogModel.getItems());

const productId = apiProducts.items[0].id;
console.log('Товар по ID:', catalogModel.getItem(productId));

catalogModel.setPreview(productId);
console.log('ID товара для предпросмотра:', catalogModel.getPreview());

// Тестирование BasketModel
console.log('--- BasketModel ---');
const basketModel = new BasketModel();
basketModel.addItem(apiProducts.items[0]);
basketModel.addItem(apiProducts.items[1]);
console.log('Товары в корзине после добавления:', basketModel.getItems());
console.log('Количество товаров в корзине:', basketModel.getCount());
console.log('Общая стоимость корзины:', basketModel.getTotal());
console.log('Проверка наличия товара в корзине:', basketModel.contains(apiProducts.items[0].id));

basketModel.removeItem(apiProducts.items[0].id);
console.log('Товары в корзине после удаления:', basketModel.getItems());

basketModel.clear();
console.log('Товары в корзине после очистки:', basketModel.getItems());

// Тестирование BuyerModel
console.log('--- BuyerModel ---');
const buyerModel = new BuyerModel();
buyerModel.setPayment('card');
buyerModel.setAddress('г. Москва, ул. Ленина, д. 1');
buyerModel.setEmail('test@example.com');
buyerModel.setPhone('+7 999 123 45 67');
console.log('Данные покупателя:', buyerModel.getData());
console.log('Результат валидации:', buyerModel.validate());

buyerModel.clear();
console.log('Данные покупателя после очистки:', buyerModel.getData());

// ПОДКЛЮЧЕНИЕ РАБОТЫ С СЕРВЕРОМ
console.log('\n=== ПОДКЛЮЧЕНИЕ РАБОТЫ С СЕРВЕРОМ ===');

// Создание экземпляра Api для запросов к серверу
const api = new Api(API_URL);

// Создание экземпляра CommunicationLayer для работы с API
const communicationLayer = new CommunicationLayer(api);

// Запрос к серверу для получения товаров
console.log('Запрос к серверу для получения товаров...');

// Проверка URL перед запросом
console.log('API_URL:', API_URL);
console.log('Полный URL:', API_URL + '/product');

communicationLayer.getProducts()
    .then(response => {
        // Вывод ответа от сервера
        console.log('Ответ от сервера:', response);
        
        // Сохранение полученных товаров в модель каталога
        catalogModel.setItems(response.items);
        console.log('Товары сохранены в модель каталога');
        
        // Вывод сохранённого каталога для проверки
        console.log('Товары из модели каталога:', catalogModel.getItems());
    })
    .catch(error => {
        // Обработка ошибки при запросе
        console.error('Ошибка при запросе к серверу:', error);
    });