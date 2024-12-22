let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let products = [];
let cart = [];
let procesed = document.getElementById('procesed')

procesed.addEventListener('click', () =>{
    Swal.fire({
        title:"Thank you for ordering,enjoy it",
        width: 600,
        padding: "3em",
        color: "#716add",
        background: "#fff url(/images/trees.png)",
        backdrop: `
          rgba(0,0,123,0.4)
          url("/images/nyan-cat.gif")
          left top
          no-repeat
        `
      });
})



iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
})

    const addDataToHTML = () => {
   
        if(products.length > 0) 
        {
            products.forEach(product => {
                let newProduct = document.createElement('div');
                newProduct.dataset.id = product.id;
                newProduct.classList.add('item');
                if(product.nuts){
                    newProduct.innerHTML = 
                    `<img src="${product.image}" alt="">
                    <h2>${product.name}</h2>
                    <div class="nuts123">
                    <div>
                    <i id='nuts1' class="fa-solid fa-check"></i>
                    <label for="">nuts</label>
                    </div>
                    <div class="inputveg">
                <input type="radio">
                <label for="">vegeterian</label>
                </div>
                </div>
                    <div class="price">$${product.price}</div>
                    <button class="addCart">Add To Cart</button>`;
                    listProductHTML.appendChild(newProduct);
                }
                else{
                    newProduct.innerHTML = 
                    `<img src="${product.image}" alt="">
                    <h2>${product.name}</h2>
                    <div class="nuts123">
                    <div>
                    <i class="fa-solid fa-xmark"></i>
                    <label for="">nuts</label>
                    </div>
                    <div class="inputveg">
                <input type="radio">
                <label for="">vegeterian</label>
                </div>
                </div>
                    <div class="price">$${product.price}</div>
                    <button class="addCart">Add To Cart</button>`;
                    listProductHTML.appendChild(newProduct);
                }
            //     newProduct.innerHTML = 
            //     `<img src="${product.image}" alt="">
            //     <h2>${product.name}</h2>
            //     <div class="nuts123">
            //     <div>
            //     <i id='nuts1' class="fa-solid fa-check"></i>
            //     <label for="">nuts</label>
            //     </div>
            //     <div class="inputveg">
            // <input type="radio">
            // <label for="">vegeterian</label>
            // </div>
            // </div>
            //     <div class="price">$${product.price}</div>
            //     <button class="addCart">Add To Cart</button>`;
            //     listProductHTML.appendChild(newProduct);
            });
        }
    }
    listProductHTML.addEventListener('click', (event) => {
        let positionClick = event.target;
        if(positionClick.classList.contains('addCart')){
            let id_product = positionClick.parentElement.dataset.id;
            addToCart(id_product);
        }
    })
const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    if(cart.length <= 0){
        cart = [{
            product_id: product_id,
            quantity: 1
        }];
    }else if(positionThisProductInCart < 0){
        cart.push({
            product_id: product_id,
            quantity: 1
        });
    }else{
        cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;
    }
    addCartToHTML();
    addCartToMemory();
}
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
}
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if(cart.length > 0){
        cart.forEach(item => {
            totalQuantity = totalQuantity +  item.quantity;
            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;

            let positionProduct = products.findIndex((value) => value.id == item.product_id);
            let info = products[positionProduct];
            listCartHTML.appendChild(newItem);
            newItem.innerHTML = `
            <div class="image">
                    <img src="${info.image}">
                </div>
                <div class="name">
                ${info.name}
                </div>
                <div class="totalPrice">$${info.price * item.quantity}</div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${item.quantity}</span>
                    <span class="plus">></span>
                </div>
            `;
        })
    }
    iconCartSpan.innerText = totalQuantity;
}

listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = 'minus';
        if(positionClick.classList.contains('plus')){
            type = 'plus';
        }
        changeQuantityCart(product_id, type);
    }
})
const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
    if(positionItemInCart >= 0){
        let info = cart[positionItemInCart];
        switch (type) {
            case 'plus':
                cart[positionItemInCart].quantity = cart[positionItemInCart].quantity + 1;
                break;
        
            default:
                let changeQuantity = cart[positionItemInCart].quantity - 1;
                if (changeQuantity > 0) {
                    cart[positionItemInCart].quantity = changeQuantity;
                }else{
                    cart.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToHTML();
    addCartToMemory();
}

const initApp = () => {
    fetch('https://restaurant.stepprojects.ge/api/Products/GetAll')
    .then(response => response.json())
    .then(data => {
        products = data;
        addDataToHTML();

       
        if(localStorage.getItem('cart')){
            cart = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    })
}
initApp();

let ul = document.querySelector(".uli")

fetch("https://restaurant.stepprojects.ge/api/Categories/GetAll")
.then(resi => resi.json()).then(data1 => showCategory(data1))


function showCategory(categoryList){
    // console.log(categoryList);
    categoryList.forEach(item => {
        ul.innerHTML += `
        <li><a href="">${item.name}</a></li>
    `
    })
}
// let nameSearch = document.getElementById("nameSearch")



// nameSearch.addEventListener("keyup", function () {
//     listProductHTML.innerHTML = ""
//     fetch("https://restaurant.stepprojects.ge/api/Products/GetAll")
//         .then(data => data.json()).then(finalData => {
//             // console.log(finalData)
//             showRoomsBynName(finalData)
//         })
// })

function showCategory(categoryList){
    // console.log(categoryList);
    categoryList.forEach(item => {
        ul.innerHTML += `
        <li class="bruh" onclick=showFiltered(${item.id})>${item.name}</li>
    `
    })
}
 
function showFiltered(id) {
    listProductHTML.innerHTML = ""
  fetch(`https://restaurant.stepprojects.ge/api/Categories/GetCategory/${id}`)
  .then(res => res.json()).then(data => {
    console.log(data.products)
   
    data.products.forEach(item => {
        listProductHTML.innerHTML += `<div class="bruh1">
        <img src="${item.image}" alt="">
        <h2>${item.name}</h2>
        <div class="nuts123">
        <div>
        <i id='nuts1' class="fa-solid fa-check"></i>
        <label for="">nuts</label>
        </div>
        <div class="inputveg">
    <input type="radio">
    <label for="">vegeterian</label>
    </div>
    </div>
        <div class="price">$${item.price}</div>
        <button class="addCart">Add To Cart</button> </div>`
    })
 
  } )
}


function showRoomsBynName(product){
    product.forEach(newProduct => {
        console.log(newProduct);
        if (listProductHTML.name.toLowerCase().includes(nameSearch.value.toLowerCase())){
        newProduct.innerHTML += 
                    `<img src="${newProduct.image}" alt="">
                    <h2>${newProduct.name}</h2>
                    <div class="nuts123">
                    <div>
                    <i id='nuts1' class="fa-solid fa-check"></i>
                    <label for="">nuts</label>
                    </div>
                    <div class="inputveg">
                <input type="radio">
                <label for="">vegeterian</label>
                </div>
                </div>
                    <div class="price">$${newProduct.price}</div>
                    <button class="addCart">Add To Cart</button>`;
                    // listProductHTML.appendChild(newProduct);
        }
    })
}