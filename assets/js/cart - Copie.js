// Tuto (freeCodeCamp.org): https://www.youtube.com/watch?v=023Psne_-_4&list=PLO8HmYxUiiem1J0PvvKkLYXSUDWqyRUrC&index=26&t=5603s
'use strict'

const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');

// cart
let cart = [];
// buttons 
let buttonsDOM = [];

// getting the products
class Products {
    async getProducts(){
        try {
            let result = await fetch('./assets/js/products.json');//request to get the content of the .json
            let data = await result.json(); //
            let products = data.items;
            products = products.map(item => {
                const {title, price} = item.fields;
                const {id} = item.sys;
                const {type} = item.fields;
                const image = item.fields.image.fields.file.url;
                const grade = item.fields.grade.fields.file.url;
                return{title, price, id, type, image, grade};
                //la méthode 'map' créer un nouveau tableau 
            })
            return products;

        } catch (error) {
            console.log(error)
        }
    }
}
// display products
class UI{
    displayProducts(products) {
        const productTypes = {
            'legs': document.querySelector('.prod-legs .prod-items'),
            'chest': document.querySelector('.prod-chest .prod-items'),
            'armes': document.querySelector('.prod-armes .prod-items'),
            'back': document.querySelector('.prod-back .prod-items'),
            'eyes': document.querySelector('.prod-eyes .prod-items'),
            'hands': document.querySelector('.prod-hands .prod-items'),
            'face': document.querySelector('.prod-face .prod-items')
        };

        products.forEach(product => {
            const { type } = product;
            const productContainer = productTypes[type];

            if (productContainer) {
                const productHTML = `
                    <article class="item ${type}">
                    <div class="item-image">
                    <img src=${product.image}>
                </div>
                <div class="item-tag">
                    <div class="item-tag-containt">
                        <div class="item-tag-txt">
                            <h3>Grade</h3>
                            <img src=${product.grade} alt="">
                        </div>
                        <div class="bag-btn" data-id=${product.id}></div>
                    </div>
                </div>
                <div class="vignette">
                    <h3 class='item-name'>${product.title}</h3>
                    <h4><span class="price">€$</span> ${product.price}</h4>
                </div>
                    </article>
                `;
                productContainer.innerHTML += productHTML;
            }
        });
    }
    getBagButtons(){
        const buttons = [...document.querySelectorAll('.bag-btn')];
        buttonsDOM = buttons;
        buttons.forEach(button =>{
            // Récupération de la valeur de l'attribut data-id à l'aide de dataset
            let id = button.dataset.id;
            // vérifier si l'item est déjà dans le cart
            let inCart = cart.find(item => item.id === id);
            if (inCart) {
                button.disabled = true
            } 
            button.addEventListener('click', (event)=>{
                event.target.disabled = true;
                // get product from products
                let cartItem = {...Storage.getProduct(id), amount:1};
                // add product to the cart
                cart = [...cart, cartItem];
                // save cart in local storage
                Storage.saveCart(cart);
                // set cart values
                this.setCartValues(cart);
                // display cart item
                this.addCartItem(cartItem);
                // show the cart
                this.showCart(cart);
            })
        })
    }
    setCartValues(cart){
        let priceTotal = 0; //total price amount of a product in the cart
        let itemsTotal = 0;
        cart.map(item =>{
            priceTotal += item.price * item.amount;
            itemsTotal += item.amount;
        });
        cartTotal.innerText = parseFloat(priceTotal.toFixed(2));
        cartItems.innerText = itemsTotal;
    }
    addCartItem(item){
        const div = document.createElement('div')
        div.classList.add('cart-item')
        div.innerHTML = `<img src=${item.image} alt="product">
        <div>
            <h4 class='item-name'>${item.title}</h4> 
            <h5 class='price'><span${item.price} €$</h5>
            <span class="remove-item" data-id=${item.id}>remove</span>
        </div>
        <div>
            <i class="fa-solid fa-chevron-up nav-icon" data-id=${item.id}></i>
            <p class="item-amount">${item.amount} </p>
            <i class="fa-solid fa-chevron-down nav-icon" data-id=${item.id}></i>
        </div>`;
        cartContent.appendChild(div);
    }
    showCart(){
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart');
    }
    hideCart(){
        cartOverlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('showCart');
    }
    populateCart(cart){
        cart.forEach(item => this.addCartItem(item));
    }
    setupAPP(){
        cart = Storage.getCart();
        this.setCartValues(cart);  // 'this' suggest that 'setCartValues' is a methode of the current object that 'setupApp' belongs to (the 'UI' class)
        this.populateCart(cart);
        cartBtn.addEventListener('click', this.showCart);
        closeCartBtn.addEventListener('click', this.hideCart);
    }
    cartLogic(){
        // clear cart button
        clearCartBtn.addEventListener('click', ()=>{
            this.clearCart();
        });
        // cart functionnality
        cartContent.addEventListener('click', event =>{
            if (event.target.classList.contains('remove-item')) {
                let removeItem = event.target;
                let id = removeItem.dataset.id;
                cartContent.removeChild(removeItem.parentElement.parentElement);
                this.removeItem(id);
            } else if (event.target.classList.contains('fa-chevron-up')) {
                let addAmount = event.target;
                let id = addAmount.dataset.id;
                let selectedItem = cart.find(item => item.id === id);
                selectedItem.amount = selectedItem.amount + 1;
                Storage.saveCart(cart);
                this.setCartValues(cart);
                addAmount.nextElementSibling.innerText = selectedItem.amount;
            } else if (event.target.classList.contains('fa-chevron-down')) {
                let lowerAmount = event.target;
                let id = lowerAmount.dataset.id;
                let selectedItem = cart.find(item => item.id === id);
                selectedItem.amount = selectedItem.amount - 1;
                if (selectedItem.amount > 0) {
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    lowerAmount.previousElementSibling.innerText = selectedItem.amount;
                } else {
                    cartContent.removeChild(lowerAmount.parentElement.parentElement);
                    this.removeItem(id);
                }
            }
        })
    }
    clearCart(){
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));
        while (cartContent.children.length > 0) {
            cartContent.removeChild(cartContent.children[0]);
        }
        this.hideCart();
    }
    removeItem(id){
        cart = cart.filter(item => item.id !== id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        // button.innerHTML = `<i class="fa-solid fa-cart-shopping"></i>
        // add to cart`;
    }
    getSingleButton(id){
        return buttonsDOM.find(button => button.dataset.id === id);
    }
    
}
// local storage
class Storage{
    static saveProducts(products){
        localStorage.setItem('products', JSON.stringify(products));
    }
    static getProduct(id){
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id);
    }
    static saveCart(){
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    static getCart(){
        return localStorage.getItem('cart')?JSON.parse(localStorage.getItem('cart')):[]
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();
    const products = new Products();
    // set up APP
    ui.setupAPP();
    // get all products 
    products.getProducts().then(products => {
        ui.displayProducts(products);
        Storage.saveProducts(products);
    }).then(()=>{
        ui.getBagButtons();
        ui.cartLogic();
    });
});

// Tuto : [03:38:44] Pour le moment on utilise le local Data, utilisation de contentful dans la suite du tuto
// https://www.contentful.com/?utm_source=google&utm_medium=search-paid&utm_campaign=DEPT_SEM_GOOG_Brand_SI_Low_General-ROW_Lead_CPL_BAU&utm_content=&utm_term=contentful&gad_source=1&gclid=CjwKCAiA-vOsBhAAEiwAIWR0TWZb-k52S3Rcb5o02OngpWGH3QDpbo82H_U_PKOm2iSn0t9HtGsGDBoCRRgQAvD_BwE