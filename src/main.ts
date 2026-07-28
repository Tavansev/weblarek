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

// 5. Компоненты представления
const modal = new Modal(modalContainer, events);
const catalog = new Catalog(gallery);

// 6. Темплейты
const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

// ========== ОБРАБОТЧИКИ СОБЫТИЙ ==========

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
        // Кнопка "В корзину" на карточке каталога
        card.buttonText = item.price === null ? 'Недоступно' : 'В корзину';
        if (item.price === null) {
            cardElement.querySelector('.card__button')?.setAttribute('disabled', 'true');
        }
        return cardElement;
    });
    catalog.items = cards;
});

// Событие: загрузка товаров с сервера
communicationLayer.getProducts()
    .then(response => {
        catalogModel.setItems(response.items);
    })
    .catch(error => {
        console.error('Ошибка загрузки товаров:', error);
    });

// ------ Просмотр товара ------

// Событие: выбор карточки для просмотра
events.on('card:select', (data: { id: string }) => {
    const product = catalogModel.getItem(data.id);
    if (!product) return;

    catalogModel.setPreview(data.id);

    const cardElement = cloneTemplate<HTMLElement>(cardPreviewTemplate);
    const card = new CardPreview(cardElement, {
        onClick: () => {
            events.emit('card:addToBasket', { id: product.id });
        }
    });

    card.title = product.title;
    card.price = product.price;
    card.category = product.category;
    card.image = CDN_URL + product.image;
    card.description = product.description;
    
    const isInBasket = basketModel.contains(product.id);
    card.inBasket = isInBasket;
    
    if (product.price === null) {
        card.buttonText = 'Недоступно';
        cardElement.querySelector('.card__button')?.setAttribute('disabled', 'true');
    }

    modal.content = cardElement;
    modal.open();
});

// Событие: добавление товара в корзину
events.on('card:addToBasket', (data: { id: string }) => {
    const product = catalogModel.getItem(data.id);
    if (!product || product.price === null) return;
    
    basketModel.addItem(product);
    modal.close();
});

// ------ Корзина ------

// Событие: изменение корзины
events.on('basket:changed', () => {
    const count = basketModel.getCount();
    const basketCounter = document.querySelector('.header__basket-counter');
    if (basketCounter) {
        basketCounter.textContent = String(count);
    }
});

// Событие: открытие корзины
document.querySelector('.header__basket')?.addEventListener('click', () => {
    events.emit('basket:open');
});

events.on('basket:open', () => {
    const basketElement = cloneTemplate<HTMLElement>(basketTemplate);
    const basket = new Basket(basketElement, events);

    const items = basketModel.getItems();
    const total = basketModel.getTotal();

    if (items.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'Корзина пуста';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.padding = '20px';
        basket.items = [emptyMessage];
        basket.disabled = true;
    } else {
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
        basket.disabled = false;
    }

    basket.total = total;
    modal.content = basketElement;
    modal.open();
});

// Событие: удаление товара из корзины
events.on('card:removeFromBasket', (data: { id: string }) => {
    basketModel.removeItem(data.id);
});

// Событие: оформление заказа (переход к форме заказа)
events.on('basket:order', () => {
    const orderElement = cloneTemplate<HTMLElement>(orderTemplate);
    const orderForm = new OrderForm(orderElement as HTMLFormElement, events);
    
    // Устанавливаем начальные данные из модели
    const buyerData = buyerModel.getData();
    if (buyerData.address) orderForm.address = buyerData.address;
    if (buyerData.payment) orderForm.payment = buyerData.payment;
    
    // Валидация при изменении
    const validateOrder = () => {
        const errors = buyerModel.validate();
        const hasErrors = Object.keys(errors).length > 0;
        orderForm.valid = !hasErrors;
        orderForm.errors = hasErrors ? Object.values(errors).join(', ') : '';
    };
    
    // Подписываемся на изменения
    const validateHandler = () => validateOrder();
    events.on('order:paymentChange', validateHandler);
    events.on('order:addressChange', validateHandler);
    
    modal.content = orderElement;
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

// Событие: отправка формы заказа (переход к контактам)
events.on('order:submit', () => {
    const contactsElement = cloneTemplate<HTMLElement>(contactsTemplate);
    const contactsForm = new ContactsForm(contactsElement as HTMLFormElement, events);
    
    // Устанавливаем начальные данные из модели
    const buyerData = buyerModel.getData();
    if (buyerData.email) contactsForm.email = buyerData.email;
    if (buyerData.phone) contactsForm.phone = buyerData.phone;
    
    // Валидация при изменении
    const validateContacts = () => {
        const errors = buyerModel.validate();
        const hasErrors = Object.keys(errors).length > 0;
        contactsForm.valid = !hasErrors;
        contactsForm.errors = hasErrors ? Object.values(errors).join(', ') : '';
    };
    
    events.on('contacts:emailChange', validateContacts);
    events.on('contacts:phoneChange', validateContacts);
    
    modal.content = contactsElement;
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

// Событие: отправка формы контактов (оформление заказа)
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
            // Показываем успех
            const successElement = cloneTemplate<HTMLElement>(successTemplate);
            const success = new Success(successElement, {
                onClick: () => {
                    events.emit('success:close');
                }
            });
            success.total = result.total;
            
            // Очищаем корзину и данные покупателя
            basketModel.clear();
            buyerModel.clear();
            
            modal.content = successElement;
        })
        .catch(error => {
            console.error('Ошибка оформления заказа:', error);
            // Показываем ошибку
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

// Событие: закрытие модального окна
events.on('modal:close', () => {
    // Ничего не делаем, просто закрываем
});

// ========== ЗАПУСК ==========

// Инициализация: загружаем товары
communicationLayer.getProducts()
    .then(response => {
        catalogModel.setItems(response.items);
    })
    .catch(error => {
        console.error('Ошибка загрузки товаров:', error);
    });