const categoriesContainer = document.getElementById("categories-container");
const treeContainer = document.getElementById("tree-container");
const allTreeBtn = document.getElementById("all-tree-btn");
const treeDetails = document.getElementById("tree_details");
const cartContainer = document.getElementById("card-container");
let cart = [];

const loading = (status) => {
    const loadingContainer = document.getElementById("loading");
    if (status == true) {
        loadingContainer.classList.remove("hidden");
        treeContainer.innerHTML = "";

    } else {
        loadingContainer.classList.add("hidden");
    }
}


const loadCategories = async () => {
    const res = await fetch("https://openapi.programming-hero.com/api/categories");
    const data = await res.json();

    data.categories.forEach(category => {
        const button = document.createElement("button");
        button.className = "btn btn-outline w-full";
        button.onclick = () => ShowButton(category.id, button);
        button.innerHTML = category.category_name;

        categoriesContainer.append(button)
    })
}

const ShowButton = async (id, button) => {
    loading(true);
    const allBtn = document.querySelectorAll("#btn-container button");
    allBtn.forEach(btn => {
        // click button remove bg-color
        btn.classList.remove("btn-success");
        btn.classList.add("btn-outline")
    })
    // class active or click button show bg-color
    button.classList.add("btn-success");
    button.classList.remove("btn-outline");

    // category select from id
    const res = await fetch(`https://openapi.programming-hero.com/api/category/${id}`);
    const data = await res.json();
    displayTree(data.plants)
}

allTreeBtn.addEventListener("click", () => {
    loading(true);
    const allBtn = document.querySelectorAll("#btn-container button");
    allBtn.forEach(btn => {
        // click button remove bg-color
        btn.classList.remove("btn-success");
        btn.classList.add("btn-outline")
    })
    allTreeBtn.classList.add("btn-success");
    allTreeBtn.classList.remove("btn-outline");
    loadTree();
    loading(false);
})

const loadTree = async () => {
    loading(true)
    const res = await fetch("https://openapi.programming-hero.com/api/plants");
    const data = await res.json();
    displayTree(data.plants)
}

const displayTree = (trees) => {
    const treeContainer = document.getElementById("tree-container");
    treeContainer.innerHTML = "";

    trees.forEach(tree => {
        const card = document.createElement("div");
        card.className = "card bg-white shadow-sm";
        card.innerHTML = `<figure class="px-3 py-2">
                            <img onclick="loadTreeDetails('${tree.id}')" class="rounded-lg h-48 w-full object-cover hover:opacity-50" src="${tree.image}"
                                alt="${tree.name}" title="click  more details" />
                        </figure>
                        <div class="py-2 px-3">
                            <h2  class="card-title">${tree.name}</h2>
                            <p class="line-clamp-2 text-[#1f2937b7]">${tree.description}</p>
                            <div class="flex justify-between my-2 ">
                               <div class="badge bg-[#15803c48] text-[#15803D] font-medium ">${tree.category}</div>
                                <p class="text-[#1F2937] font-semibold text-xl">৳ ${tree.price}</p>
                            </div>
                            <div class="card-actions ">
                                <button onclick= "addToCart(${tree.id},'${tree.name}',${tree.price})" class="btn w-full rounded-full bg-[#15803D]">Add to Cart</button>
                            </div>
                        </div>
        `
        treeContainer.appendChild(card)
    })
    loading(false)
}

const loadTreeDetails = async (id) => {
    treeDetails.showModal();

    const res = await fetch(`https://openapi.programming-hero.com/api/plant/${id}`);
    const data = await res.json();
    displayTreeDetails(data.plants);
}

const displayTreeDetails = (plants) => {
    treeDetails.innerHTML = `
        <div class="modal-box">
                    <div class="flex justify-between items-center mb-4">
                        <!-- modal header with close button -->
                        <h3 class="font-bold text-2xl text-green-700">Tree Details</h3>
                        <button class="btn btn-sm btn-circle btn-ghost"
                            onclick="document.getElementById('tree_details').close()"><i class="fa-solid fa-xmark"></i></button>
                    </div>

                    <!-- modal content  -->
                    <div class="gap-6">
                        <img id="modal-img" src="${plants.image}" alt="tree" class="w-full h-[250px] object-cover rounded-lg mb-12">
                    </div>

                    <!-- plan details -->
                    <div>
                        <p class="text-2xl font-extrabold mb-2">
                        ${plants.name}</p> 
                        <p class="text-sm text-gray-500 mb-2">
                            <span class="font-bold">category</span>
                            <span id="modalCategory" class="badge badge-primary">${plants.category}</span>
                        </p>
                        <p class="text-sm text-gray-500 mb-2">
                            <span id="modalDescription">${plants.description}</span>
                        </p>
                        <div class="flex items-baseline gap-2 mb-6">
                            <span class="text-3xl font-bold text-green-600
                            ">৳ <span id="modalPrice">${plants.price}</span></span>
                        </div>
                    </div>
                </div>
    `
}

const addToCart = (id, name, price) => {
    const existingItem = cart.find(item => item.id == id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id,
            name,
            price,
            quantity: 1
        })
    }

    updateCart()
}
const updateCart = () => {
    const totalPriceContainer = document.getElementById("total-price-container");
    const totalPrice = document.getElementById("total-price");
    cartContainer.innerHTML = "";

    let total = 0;
    cart.forEach(item => {
        const cartItem = document.createElement("div");
        cartItem.className = "card card-body bg-slate-100";
        cartItem.innerHTML = `
            <div class="flex justify-between items-center">
                <h2 class=" font-medium">${item.name}</h2>
                <button onclick="removeItem(${item.id})" class="btn btn-sm btn-circle"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <p class="text-gray-500">৳ ${item.price} <i class="fa-solid fa-xmark"></i>${item.quantity}</p>
            <p id="total" class="text-xl text-green-700 text-end font-bold mt-6">৳ ${item.price * item.quantity}</p>
        `
        cartContainer.appendChild(cartItem)
        total += item.price * item.quantity;
    })
    if (cart.length > 0) {
        totalPriceContainer.classList.remove("hidden")
        totalPriceContainer.classList.add("flex");
        totalPrice.innerText = total;
    } else {
        totalPriceContainer.classList.remove("flex")
        totalPriceContainer.classList.add("hidden");
    }
}

const removeItem = (id) => {
    const updateCartElement = cart.filter(item => item.id != id);
    cart = updateCartElement;
    updateCart()
}

loadTree()
loadCategories()