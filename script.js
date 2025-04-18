const addBtn = document.getElementById('add-btn');
const nameInput = document.getElementById('product-name');
const priceInput = document.getElementById('product-price');
const qtyInput = document.getElementById('product-qty');
const tableBody = document.getElementById('table-body');
const updateNameInput = document.getElementById('update-product-name');
const updatePriceInput = document.getElementById('update-product-price');
const updateQtyInput = document.getElementById('update-product-qty');
const updateBtn = document.getElementById('update-btn');
const cancelBtn = document.getElementById('cancel-btn');

let products = JSON.parse(localStorage.getItem('products')) || [];
let currentProductId = null;

function validateFields(name, price, qty) {
    if (!name || price === '' || qty === '') {
        alert('Preencha todos os campos!');
        return false;
    }
    if (isNaN(price) || parseFloat(price) <= 0) {
        alert('Preço inválido!');
        return false;
    }
    if (isNaN(qty) || parseInt(qty) < 0) {
        alert('Quantidade inválida!');
        return false;
    }
    return true;
}

function addProduct() {
    const name = nameInput.value.trim();
    const price = priceInput.value.trim();
    const qty = qtyInput.value.trim();

    if (!validateFields(name, price, qty)) return;

    let id = 1;
    while (products.find(p => p.id === id)) {
        id++;
    }

    const product = {
        id,
        name,
        price: parseFloat(price).toFixed(2),
        qty: parseInt(qty)
    };

    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
    nameInput.value = '';
    priceInput.value = '';
    qtyInput.value = '';
    renderTable();
}

function showUpdateForm(id) {
    const product = products.find(p => p.id === id);
    if (product) {
        updateNameInput.value = product.name;
        updatePriceInput.value = product.price;
        updateQtyInput.value = product.qty;
        currentProductId = id;
        document.getElementById('update-container').style.display = 'block';
        updateBtn.onclick = updateProduct;
        cancelBtn.onclick = hideUpdateForm;
    }
}

function updateProduct() {
    const name = updateNameInput.value.trim();
    const price = updatePriceInput.value.trim();
    const qty = updateQtyInput.value.trim();

    if (!validateFields(name, price, qty)) return;

    const index = products.findIndex(p => p.id === currentProductId);
    if (index !== -1) {
        products[index].name = name;
        products[index].price = parseFloat(price).toFixed(2);
        products[index].qty = parseInt(qty);
    }

    localStorage.setItem('products', JSON.stringify(products));
    hideUpdateForm();
    renderTable();
}

function hideUpdateForm() {
    updateNameInput.value = '';
    updatePriceInput.value = '';
    updateQtyInput.value = '';
    currentProductId = null;
    document.getElementById('update-container').style.display = 'none';
}

function deleteProduct(id) {
    products = products.filter(p => p.id !== id);
    localStorage.setItem('products', JSON.stringify(products));
    hideUpdateForm();
    renderTable();
}

function renderTable() {
    tableBody.innerHTML = '';
    for (const product of products) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>R$ ${product.price}</td>
            <td>${product.qty}</td>
            <td>
                <button class="edit-btn">Editar</button>
                <button class="delete-btn">Excluir</button>
            </td>
        `;
        const editBtn = tr.querySelector('.edit-btn');
        const deleteBtn = tr.querySelector('.delete-btn');

        editBtn.addEventListener('click', () => showUpdateForm(product.id));
        deleteBtn.addEventListener('click', () => deleteProduct(product.id));

        tableBody.appendChild(tr);
    }
}

addBtn.addEventListener('click', addProduct);
renderTable();
