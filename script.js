document.addEventListener('DOMContentLoaded', () => {
    console.log("Book Haven Script Loaded.");

    // --- 1. PHOTO MODAL LOGIC (Gallery & Shop) ---
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("imgFull");
    const closeModal = document.querySelector(".close-modal");

    if (modal && modalImg) {
        document.querySelectorAll('.collection-card img, .view-btn, .product-card img').forEach(item => {
            item.addEventListener('click', (e) => {
                if (item.tagName === 'A') e.preventDefault();
                modal.style.display = "block";
                
                if (item.classList.contains('view-btn')) {
                    const cardImg = item.closest('.collection-card').querySelector('img');
                    modalImg.src = cardImg.src;
                } else {
                    modalImg.src = item.src;
                }
            });
        });

        if (closeModal) {
            closeModal.onclick = () => modal.style.display = "none";
        }
        
        window.addEventListener('click', (e) => {
            if (e.target == modal) modal.style.display = "none";
        });
    }

    // --- 2. NEWSLETTER LOGIC ---
const subBtn = document.getElementById('sub-btn');

if (subBtn) {
    subBtn.addEventListener('click', () => {
        const emailInput = document.getElementById('email-sub');
        const emailValue = emailInput.value.trim();

        // 1. Get the current list of emails from Local Storage
        // If nothing is there, we start with an empty list []
        let subscribers = JSON.parse(localStorage.getItem('allSubscribers')) || [];

        if (!emailValue.includes('@')) {
            alert("Please enter a valid email.");
        } 
        // 2. Check if this specific email is already in our list
        else if (subscribers.includes(emailValue)) {
            alert("This email is already subscribed!");
        } 
        else {
            // 3. Add the new email to our list
            subscribers.push(emailValue);

            // 4. Save the whole list back to Local Storage
            localStorage.setItem('allSubscribers', JSON.stringify(subscribers));

            alert("Thank you for subscribing!");
            emailInput.value = "";
        }
    });
}

// --- 3. SHOP CART LOGIC ---
const addToCartButtons = document.querySelectorAll('.cart-btn');

if (addToCartButtons.length > 0) {
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.product-card');
            
            // Check if classes exist before trying to read them
            const nameEl = card.querySelector('.product-name');
            const priceEl = card.querySelector('.product-price');
            const imgEl = card.querySelector('img');

            if (!nameEl || !priceEl) {
                console.error("Missing .product-name or .product-price class in HTML!");
                alert("Error: Product data not found.");
                return;
            }

            const product = {
                name: nameEl.innerText,
                price: priceEl.innerText,
                image: imgEl.src,
                quantity: 1
            };

            let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
            const existingItem = cart.find(item => item.name === product.name);
            
            if (existingItem) {
                existingItem.quantity += 1;
                alert(`${product.name} quantity updated in cart!`);
            } else {
                cart.push(product);
                alert(`${product.name} added to cart!`);
            }

            localStorage.setItem('shoppingCart', JSON.stringify(cart));
        });
    });
}

    // --- 4. DISPLAY CART LOGIC (Viewing Items) ---
    // Moved inside DOMContentLoaded to ensure the container is found
    const cartContainer = document.getElementById('cart-container');
    if (cartContainer) {
        const cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        
        if (cart.length === 0) {
            cartContainer.innerHTML = "<p style='text-align:center; padding: 20px;'>Your cart is empty!</p>";
        } else {
            // Clear container first in case of re-renders
            cartContainer.innerHTML = ""; 
            cart.forEach(item => {
                cartContainer.innerHTML += `
                    <div class="cart-item" style="border-bottom: 1px solid #ccc; padding: 15px; display: flex; align-items: center; background: white; margin-bottom: 10px; border-radius: 8px;">
                        <img src="${item.image}" style="width: 80px; height: 80px; object-fit: cover; margin-right: 20px; border-radius: 4px;">
                        <div style="flex-grow: 1;">
                            <h4 style="margin: 0; color: #333;">${item.name}</h4>
                            <p style="margin: 5px 0; color: #666;">${item.price}</p>
                            <p style="margin: 0; font-size: 0.9em; font-weight: bold;">Qty: ${item.quantity}</p>
                        </div>
                    </div>
                `;
            });
        }
    }
});

// --- 5. CART PAGE ACTIONS (Checkout & Clear) ---
const checkoutBtn = document.getElementById('checkout-btn');
const clearCartBtn = document.getElementById('clear-cart-btn');

if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        const cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
        
        if (cart.length > 0) {
            alert("Thank you for your order! Your Book Haven treasures will be shipped soon.");
            localStorage.removeItem('shoppingCart');
            alert("Order processed. Your cart is now empty.");
            location.reload(); // Refreshes to show the empty cart message
        } else {
            alert("Your cart is empty. Browse the shop to find your next chapter!");
        }
    });
}

if (clearCartBtn) {
    clearCartBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to remove all items from your cart?")) {
            localStorage.removeItem('shoppingCart');
            alert("Cart has been cleared.");
            location.reload();
        }
    });
}

// --- 6. CONTACT FORM LOGIC ---
const contactForm = document.getElementById('contact-form');
const nameInput = document.getElementById('user-name');
const emailInput = document.getElementById('user-email');
const formFeedback = document.getElementById('form-feedback');

// A. Load the saved name when the page opens
window.addEventListener('DOMContentLoaded', () => {
    const savedName = localStorage.getItem('lastContactName');
    if (savedName && nameInput) {
        nameInput.value = savedName;
    }
});

// B. Save to LocalStorage on Submit
if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Create an object to hold all the form data
        const contactData = {
            name: nameInput.value,
            email: emailInput.value,
            message: document.getElementById('user-message').value,
            date: new Date().toLocaleString()
        };

        // Save the whole object to Local Storage
        localStorage.setItem('lastSubmittedMessage', JSON.stringify(contactData));

        // Success feedback
        alert(`Thank you, ${contactData.name}! Your message has been saved and sent.`);
        
        formFeedback.innerText = "Full message archived in local storage!";
        contactForm.reset();
    });
}