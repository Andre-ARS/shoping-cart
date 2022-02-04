const cart = document.querySelector('.cart__items');
const changer = ({ id, title, price }) => ({ sku: id, name: title, salePrice: price });

function setPrice() {
  let finalPrice = 0;
  const childs = cart.childNodes;
  childs.forEach((child) => {
    const position = child.innerText.indexOf('$') + 1;
    const strPrice = child.innerText.slice(position);
    const numPrice = parseFloat(strPrice);

    finalPrice += numPrice;
  });

  document.querySelector('.total-price').innerText = finalPrice;
}

function emptyCart() {
  cart.innerHTML = '';
  localStorage.clear();
  setPrice();
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function loading() {
  const section = createCustomElement('section', 'loading', 'carregando...');
  
  document.querySelector('.items').appendChild(section);
}

const items = document.querySelector('.items');
const nameChanger = ({ id, title, thumbnail }) => ({ sku: id, name: title, image: thumbnail });

async function productList(product, callback) {
  loading();
  const response = await fetchProducts(product);
  const { results } = response;

  results.forEach((result) => {
    items.appendChild(callback(nameChanger(result)));
  });
  document.querySelector('.loading').remove();
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const element = event.target;
  if (event.target.className === 'cart__item') {
    setPrice();
    element.remove();
    saveCartItems(cart.innerHTML);    
  }
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
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

window.onload = () => {
  document.querySelector('.empty-cart').addEventListener('click', emptyCart);
  productList('computador', createProductItemElement);
  getStoragedItems();
  cart.addEventListener('click', cartItemClickListener);
  document.querySelector('.items').addEventListener('click', function listener(event) {
    cartList(event, createCartItemElement);
  });
};
