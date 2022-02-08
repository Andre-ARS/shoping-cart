const cart = document.querySelector('.cart__items');
const changer = ({ id, title, price }) => ({ sku: id, name: title, salePrice: price });
const searchBtn = document.querySelector('.fa-search');
const searchBar = document.querySelector('.search-bar');
const cartIcon = document.querySelector('.cart-icon');
const closeCartBtn = document.querySelector('.fa-window-close');

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
  img.src = imageSource.slice(0, -5).concat('J.jpg');
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerHTML = innerText;
  return e;
}

function createProductItemElement({ sku, name, image, price }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createCustomElement('span', 'item__price', `<span class='sifra'>R$</span> <strong>${price.toFixed(2)}</strong>`));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function loading() {
  const section = createCustomElement('section', 'loading', '');
  const loadingText = createCustomElement('span', 'loading-text', 'carregando...');
  const spinner = createCustomElement('i', 'fas fa-spinner', '')
  
  section.appendChild(loadingText);
  section.appendChild(spinner);
  document.querySelector('.items').appendChild(section);
}

const items = document.querySelector('.items');
const nameChanger = ({ id, title, thumbnail, price }) => ({ sku: id, name: title, image: thumbnail, price });

async function productList(product, callback) {
  const response = await fetchProducts(product);
  const { results } = response;

  if (results.length > 0) {
    results.forEach((result) => {
      items.appendChild(callback(nameChanger(result)));
    });
  } else {
    const error = createCustomElement('span', 'error', `O produto '${product}', não foi encontrado! Verifique a ortografia`);
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

function searchBarHide() {
  if (searchBar.style.display === '') {    
    searchBar.style.display = 'none';
  } else {
    searchBar.style.display = '';
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
  const cartSection = document.querySelector('.cart')
  if (cartTitle.style.visibility === '') {    
    cartTitle.style.visibility = 'hidden';
    cartTitle.style.opacity = '0';
    cartSection.style.visibility = 'hidden';
    cartSection.style.opacity = '0';
    closeCartBtn.style.visibility = 'hidden';
  } else {
    cartSection.style.visibility = '';
    cartTitle.style.opacity = '1';
    cartTitle.style.visibility = '';
    cartSection.style.opacity = '1';
    closeCartBtn.style.visibility = '';
    setPrice();
  }

}

function events() {
  searchBtn.addEventListener('click', searchBarHide);
  searchBar.addEventListener("keyup", search);
  cartIcon.addEventListener('click', hideCart)
  closeCartBtn.addEventListener('click', hideCart)
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
