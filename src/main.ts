import './scss/styles.scss';

// Импорт для работы с сервером
import { CommunicationLayer } from './components/CommunicationLayer';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { API_URL, CDN_URL } from './utils/constants';

// Импорт моделей данных
import { CatalogModel } from './components/models/CatalogModel';
import { BasketModel } from './components/models/BasketModel';
import { BuyerModel } from './components/models/BuyerModel';

// Импорт представлений
import { Modal } from './components/view/Modal';
import { Catalog } from './components/view/Catalog';
import { CardCatalog } from './components/view/CardCatalog';
import { CardPreview } from './components/view/CardPreview';
import { CardBasket } from './components/view/CardBasket';
import { Basket } from './components/view/Basket';
import { OrderForm } from './components/view/OrderForm';
import { ContactsForm } from './components/view/ContactsForm';
import { Success } from './components/view/Success';

import { cloneTemplate } from './utils/utils';
import { IProduct, IOrder } from './types';

// ========== ИНИЦИАЛИЗАЦИЯ ==========

// 1. Брокер событий
const events = new EventEmitter();

// 2. Модели данных
const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const buyerModel = new BuyerModel(events);

// 3. API и CommunicationLayer
const api = new Api(API_URL);
const communicationLayer = new CommunicationLayer(api);

// 4. Поиск контейнеров
const gallery = document.querySelector('.gallery') as HTMLElement;
const modalContainer = document.querySelector('#modal-container') as HTMLElement;
const basketCounter = document.querySelector('.header__basket-counter') as HTMLElement;
const basketButton = document.querySelector('.header__basket') as HTMLButtonElement;

// 5. Компоненты представления (создаём один раз)
const modal = new Modal(modalContainer, events);
const catalog = new Catalog(gallery);

// Темплейты
const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

// Создаём представления один раз и переиспользуем
const basketElement = cloneTemplate<HTMLElement>(basketTemplate);
const basket = new Basket(basketElement, events);

const orderElement = cloneTemplate<HTMLElement>(orderTemplate);
const orderForm = new OrderForm(orderElement as HTMLFormElement, events);

const contactsElement = cloneTemplate<HTMLElement>(contactsTemplate);
const contactsForm = new ContactsForm(contactsElement as HTMLFormElement, events);

const successElement = cloneTemplate<HTMLElement>(successTemplate);
const success = new Success(successElement, {
    onClick: () => {
        events.emit('success:close');
    }
});

// Создаём один экземпляр CardPreview
const previewElement = cloneTemplate<HTMLElement>(cardPreviewTemplate);
const cardPreview = new CardPreview(previewElement, {
    onClick: () => {
        events.emit('preview:click');
    }
});

// ========== ОБРАБОТЧИКИ СОБЫТИЙ ==========

// Кнопка корзины в хедере
basketButton.addEventListener('click', () => {
    events.emit('basket:open');
});

// ------ Каталог ------

// Событие: изменение каталога
events.on('catalog:changed', () => {
    const items = catalogModel.getItems();
    const cards = items.map(item => {
        const cardElement = cloneTemplate<HTMLElement>(cardCatalogTemplate);
        const card = new CardCatalog(cardElement, {
            onClick: () => {
                events.emit('card:select', { id: item.id });
            }
        });
        card.title = item.title;
        card.price = item.price;
        card.category = item.category;
        card.image = CDN_URL + item.image;
        return cardElement;
    });
    catalog.items = cards;
});

// Событие: изменение выбранного товара - обновляем существующий экземпляр
events.on('catalog:previewChanged', () => {
    const productId = catalogModel.getPreview();
    if (!productId) return;
    
    const product = catalogModel.getItem(productId);
    if (!product) return;

    // Обновляем существующий экземпляр, а не создаём новый
    cardPreview.title = product.title;
    cardPreview.price = product.price;
    cardPreview.category = product.category;
    cardPreview.image = CDN_URL + product.image;
    cardPreview.description = product.description;
    
    if (product.price === null) {
        cardPreview.buttonText = 'Недоступно';
        cardPreview.buttonDisabled = true;
    } else {
        const isInBasket = basketModel.contains(product.id);
        cardPreview.buttonText = isInBasket ? 'Убрать из корзины' : 'В корзину';
        cardPreview.buttonDisabled = false;
    }

    modal.content = previewElement;
    modal.open();
});

// Событие: выбор карточки для просмотра
events.on('card:select', (data: { id: string }) => {
    catalogModel.setPreview(data.id);
});

// Клик по кнопке в превью - получаем ID из модели
events.on('preview:click', () => {
    const productId = catalogModel.getPreview();
    if (!productId) return;
    
    const product = catalogModel.getItem(productId);
    if (!product || product.price === null) return;
    
    if (basketModel.contains(product.id)) {
        basketModel.removeItem(product.id);
    } else {
        basketModel.addItem(product);
    }
    
    // Обновляем превью после изменения корзины
    catalogModel.setPreview(productId);
});

// ------ Корзина ------

// Событие: изменение корзины
events.on('basket:changed', () => {
    const items = basketModel.getItems();
    const total = basketModel.getTotal();
    const count = basketModel.getCount();

    // Обновляем счётчик в хедере
    if (basketCounter) {
        basketCounter.textContent = String(count);
    }

    // Создаём карточки для всех товаров (если корзина пуста, мап вернёт пустой массив)
    const cards = items.map((item, index) => {
        const cardElement = cloneTemplate<HTMLElement>(cardBasketTemplate);
        const card = new CardBasket(cardElement, {
            onDelete: () => {
                events.emit('card:removeFromBasket', { id: item.id });
            }
        });
        card.title = item.title;
        card.price = item.price;
        card.index = index + 1;
        return cardElement;
    });
    
    basket.items = cards;
    basket.disabled = items.length === 0;
    basket.total = total;
});

// Событие: открытие корзины
events.on('basket:open', () => {
    modal.content = basket.render();
    modal.open();
});

// Событие: удаление товара из корзины
events.on('card:removeFromBasket', (data: { id: string }) => {
    basketModel.removeItem(data.id);
});

// Событие: оформление заказа
events.on('basket:order', () => {
    modal.content = orderForm.render();
    modal.open();
});

// ------ Форма заказа ------

// Событие: изменение способа оплаты
events.on('order:paymentChange', (data: { payment: 'card' | 'cash' }) => {
    buyerModel.setPayment(data.payment);
});

// Событие: изменение адреса
events.on('order:addressChange', (data: { address: string }) => {
    buyerModel.setAddress(data.address);
});

// Событие: отправка формы заказа
events.on('order:submit', () => {
    modal.content = contactsForm.render();
});

// ------ Форма контактов ------

// Событие: изменение email
events.on('contacts:emailChange', (data: { email: string }) => {
    buyerModel.setEmail(data.email);
});

// Событие: изменение телефона
events.on('contacts:phoneChange', (data: { phone: string }) => {
    buyerModel.setPhone(data.phone);
});

// Событие: отправка формы контактов
events.on('contacts:submit', () => {
    const buyer = buyerModel.getData();
    const items = basketModel.getItems();
    const total = basketModel.getTotal();
    
    const order: IOrder = {
        payment: buyer.payment!,
        address: buyer.address,
        email: buyer.email,
        phone: buyer.phone,
        items: items.map(item => item.id),
        total: total
    };
    
    communicationLayer.postOrder(order)
        .then(result => {
            success.total = result.total;
            basketModel.clear();
            buyerModel.clear();
            modal.content = success.render();
        })
        .catch(error => {
            console.error('Ошибка оформления заказа:', error);
            const errorElement = document.createElement('div');
            errorElement.textContent = 'Ошибка оформления заказа. Попробуйте позже.';
            errorElement.style.color = 'red';
            errorElement.style.textAlign = 'center';
            errorElement.style.padding = '20px';
            modal.content = errorElement;
        });
});

// Событие: закрытие успешного заказа
events.on('success:close', () => {
    modal.close();
});

// Событие: изменение данных покупателя (валидация форм)
events.on('buyer:changed', () => {
    const errors = buyerModel.validate();
    const hasErrors = Object.keys(errors).length > 0;
    
    const buyerData = buyerModel.getData();
    orderForm.address = buyerData.address;
    if (buyerData.payment) {
        orderForm.payment = buyerData.payment;
    }
    orderForm.valid = !hasErrors;
    orderForm.errors = hasErrors ? Object.values(errors).join(', ') : '';
    
    contactsForm.email = buyerData.email;
    contactsForm.phone = buyerData.phone;
    contactsForm.valid = !hasErrors;
    contactsForm.errors = hasErrors ? Object.values(errors).join(', ') : '';
});

// ========== ЗАПУСК ==========

communicationLayer.getProducts()
    .then(response => {
        catalogModel.setItems(response.items);
    })
    .catch(error => {
        console.error('Ошибка загрузки товаров:', error);
    });