const cart = document.querySelector('.cart__items');
const searchBtn = document.querySelector('.fa-search');
const searchBar = document.querySelector('.search-bar');
const cartIcon = document.querySelector('.cart-icon');
const closeCartBtn = document.querySelector('.fa-window-close');
const items = document.querySelector('.items');

const changer = ({ id, title, price, thumbnail }) => ({
  sku: id,
  name: title,
  price,
  image: thumbnail,
});

function setPrice() {
  let finalPrice = 0;
  const childs = cart.childNodes;
  childs.forEach((child) => {
    const strPrice = child.title;
    const numPrice = parseFloat(strPrice);

    finalPrice += numPrice;
  });

  document.querySelector('.total-price').innerText = finalPrice
    .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function emptyCart() {
  cart.innerHTML = '';
  localStorage.clear();
  setPrice();
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource.slice(0, -5).concat('J.jpg');
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerHTML = innerText;
  return e;
}

const formatPrice = (price) => {
  const value = price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return {
    sifra: value.slice(0, 2),
    valor: value.slice(3),
  };
};

function createProductItemElement({ sku, name, image, price }) {
  const section = document.createElement('section');
  section.className = 'item';
  const priceText = `<span class='sifra'>${formatPrice(price).sifra}</span>
   <strong>${formatPrice(price).valor}</strong>`;
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createCustomElement('span', 'item__price', priceText));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function loading() {
  const section = createCustomElement('section', 'loading', '');
  const loadingText = createCustomElement('span', 'loading-text', 'carregando...');
  const spinner = createCustomElement('i', 'fas fa-spinner', '');
  
  section.appendChild(loadingText);
  section.appendChild(spinner);
  document.querySelector('.items').appendChild(section);
}

async function productList(product, callback) {
  const response = await fetchProducts(product);
  const { results } = response;
  const errorText = `O produto '${product}', não foi encontrado! Verifique a ortografia`;

  if (results.length > 0) {
    results.forEach((result) => {
      items.appendChild(callback(changer(result)));
    });
  } else {
    const error = createCustomElement('span', 'error', errorText);
    items.appendChild(error);    
  }
}

async function load(product) {
  loading();
  await productList(product, createProductItemElement);
  document.querySelector('.loading').remove();
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const { className } = event.target;
  if (className === 'item__image' || className === 'info__container') {
    event.target.parentElement.remove();
    setPrice();
    saveCartItems(cart.innerHTML);    
  } else if (className === 'cart__item') {
    event.target.remove();
    setPrice();
    saveCartItems(cart.innerHTML);    
  }
}

const cartItemInfo = (name, price, sku) => {
  const div = createCustomElement('div', 'info__container', '');
  div.appendChild(createCustomElement('span', 'item__id info', `Cód.: ${sku}`));
  div.appendChild(createCustomElement('span', 'item__name info', name.slice(0, 70)));
  div.appendChild(createCustomElement('span', 'item__price info', price
    .toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })));

  return div;
};

function createCartItemElement({ image, name, price, sku }) {
  const li = createCustomElement('li', 'cart__item', '');
  li.title = price;
  li.appendChild(createProductImageElement(image));
  li.appendChild(cartItemInfo(name, price, sku));
  li.addEventListener('click', cartItemClickListener);

  return li;
}

async function cartList(event, callback) {
  const id = getSkuFromProductItem(event.target.parentElement); 
  const response = changer(await fetchItem(id));
  if (event.target.className === 'item__add') {    
    cart.appendChild(callback(response));
    setPrice();
    saveCartItems(cart.innerHTML);
  }
}

function getStoragedItems() {
  const storage = getSavedCartItems();
 
  if (localStorage.cartItems) {
    document.querySelector('.cart__items').innerHTML = storage;
  }  
  setPrice();
  cart.addEventListener('click', cartItemClickListener);
} 

function searchBarHide() {
  if (searchBar.classList.contains('hidden')) {    
    searchBar.classList.remove('hidden');
  } else {
    searchBar.classList.add('hidden');
  }
}

async function search(event) {
  if (searchBar.value !== '' && event.key === 'Enter') {    
    items.innerHTML = '';

    await load(searchBar.value);
    searchBar.value = '';
  }
}

function hideCart() {
  const cartTitle = document.querySelector('.container-cartTitle');
  const cartSection = document.querySelector('.cart');
  const cartElements = [cartTitle, cartSection, closeCartBtn];
  if (cartTitle.classList.contains('hidden')) {    
    cartElements.forEach(({ classList }) => classList.remove('hidden'));
    setPrice();
  } else {
    cartElements.forEach(({ classList }) => classList.add('hidden'));
  }
}

function events() {
  searchBtn.addEventListener('click', searchBarHide);
  searchBar.addEventListener('keyup', search);
  cartIcon.addEventListener('click', hideCart);
  closeCartBtn.addEventListener('click', hideCart);
  document.querySelector('.empty-cart').addEventListener('click', emptyCart);
  cart.addEventListener('click', cartItemClickListener);
}

window.onload = () => {
  load('computador');
  searchBarHide();
  getStoragedItems();
  events();
  hideCart();
  document.querySelector('.items').addEventListener('click', function listener(event) {
    cartList(event, createCartItemElement);
  });
};
