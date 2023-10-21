const products = fetch('https://piperedge.com/screening-test/assets/json/products.json')
.then((res)=>res.json())
.then((products)=> {
        let productholder = document.querySelector("#product-output");
        let pro_result = "";
       
        
        // Create an object to store discounts by vendor and trade
        const discountsTable = {};
        
        // Loop through the products and populate the discountsTable
        products.forEach(product => {
            const vendor = product.vendor;
            const tags = product.tags;
        
            if (!discountsTable[vendor]) {
                discountsTable[vendor] = {};
            }
        
            tags.forEach(tag => {
                if (!discountsTable[vendor][tag]) {
                    discountsTable[vendor][tag] = [];
                }
        
                discountsTable[vendor][tag].push(product.discount);
            });
        });
        
        // Create the table header
        const trades = ['TRADE A', 'TRADE B', 'TRADE C', 'TRADE D'];
        const tableHeader = ['Vendor'].concat(trades);
        
        // Initialize the table
        const table = [tableHeader];
        table.className = 'table_head';
        
        // Loop through vendors and trades to populate the table
        for (const vendor in discountsTable) {
            const row = [vendor];
            trades.forEach(trade => {
                const discounts = discountsTable[vendor][trade] || [];
                const totalDiscount = discounts.reduce((acc, discount) => acc + discount, 0);
                row.push(totalDiscount > 0 ? totalDiscount : 'N/A');
            });
            table.push(row);
        }
        
        // Generate the HTML table
const htmlTable = document.createElement('table');
htmlTable.className = 'discount-table';

table.forEach(rowData => {
    const row = document.createElement('tr');
    row.className = 'table_tr'
    rowData.forEach(cellData => {
        const cell = document.createElement('td');
        cell.className = 'table_td'
        cell.textContent = cellData;
        row.appendChild(cell);
    });
    htmlTable.appendChild(row);
});

// Find the HTML element where you want to display the table (e.g., by ID)
const container = document.getElementById('table-container');

// Append the table to the container element
container.appendChild(htmlTable);
        
        for (let product of products) {
            const capitalizedName = product.name.charAt(0).toUpperCase() + product.name.slice(1);
            pro_result += `
        <tr class="tbody">
        <td>${product.id}</td>
        <td>${capitalizedName}</td>
        <td>${product.price}</td>
        <td>${product.tags}</td>
        <td>${product.vendor}</td>
        <td><button class="addtocart-button" data-product-id="${product.id}">Add to Cart</button></td>
        </tr>`;

        }
        productholder.innerHTML = pro_result;
        const addToCartButtons = document.querySelectorAll('.addtocart-button');
    addToCartButtons.forEach(button => {
    button.addEventListener('click', function() {
    const productId = this.getAttribute('data-product-id');
    const selectedProduct = products.find(product => product.id === parseInt(productId, 10));
    addToCart(selectedProduct);
  });
});

    });
    

    let amount = 0;
    const totalamount = document.getElementById('total-amount');
    const cart = []; // Maintain a list of products in the cart
    
    // Your existing code for fetching and displaying products
    
    function addToCart(product) {
        const shoppingHolder = document.getElementById("shopping");
    
        // Calculate discount Percentage and Price
        const discountPrice = product.price * (product.discount / 100);
        const discountedPrice = product.price - discountPrice;
    
        const capitalizedName = product.name.charAt(0).toUpperCase() + product.name.slice(1);
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td>${capitalizedName}</td>
            <td>${product.price}</td>
            <td>${product.discount}</td>
            <td>${discountedPrice.toFixed(2)}</td>
            <td>${product.vendor}</td>
            <td><button class="remove-button" data-product-id="${product.id}">Remove Cart</button></td>
        `;
        shoppingHolder.appendChild(row);
    
        cart.push({
            id: product.id,
            discountedPrice: discountedPrice,
        });
    
        // Update the total amount
        amount += discountedPrice;
        totalamount.textContent = amount;
    
        // Add a click event listener to the remove button
        const removeButton = row.querySelector('.remove-button');
        removeButton.addEventListener('click', removeFromCart);
    }
    
    function removeFromCart(event) {
        const productId = event.target.getAttribute('data-product-id');
    
        // Find the product in the cart and its discounted price
        const cartItem = cart.find(item => item.id === parseInt(productId, 10));
    
        if (cartItem) {
            // Remove the product from the cart
            const index = cart.indexOf(cartItem);
            cart.splice(index, 1);
    
            // Update the total amount
            amount -= cartItem.discountedPrice;
            totalamount.textContent = amount;
    
            // Remove the row from the cart display
            const row = event.target.parentElement.parentElement;
            row.remove();
        }
    }
    