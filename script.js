// Main JavaScript file for Saints Lifestyle Apparel

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Cart functionality
    const cartButtons = document.querySelectorAll('.add-to-cart');
    const cartCount = document.querySelector('.cart-count');
    let cartItems = 0;
    
    cartButtons.forEach(button => {
        button.addEventListener('click', function() {
            cartItems++;
            cartCount.textContent = cartItems;
            
            // Add animation feedback
            this.textContent = 'Added!';
            this.style.backgroundColor = '#32ad3a';
            
            setTimeout(() => {
                this.textContent = 'Add to Cart';
                this.style.backgroundColor = '';
            }, 1500);
        });
    });
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const searchResults = document.getElementById('searchResults');
    
    if (searchInput && searchButton && searchResults) {
        // Sample product data for search
        const products = [
            { name: 'Premium Hoodie', category: 'hoodies', price: 'R450', description: 'Comfortable cotton blend hoodie' },
            { name: 'Classic Beanie', category: 'beanies', price: 'R150', description: 'Warm acrylic knit beanie' },
            { name: 'Slim Fit Jeans', category: 'jeans', price: 'R600', description: 'Premium denim jeans' }
        ];
        
        function performSearch() {
            const query = searchInput.value.toLowerCase().trim();
            searchResults.innerHTML = '';
            
            if (query === '') {
                return;
            }
            
            const filteredProducts = products.filter(product => 
                product.name.toLowerCase().includes(query) || 
                product.description.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query)
            );
            
            if (filteredProducts.length > 0) {
                filteredProducts.forEach(product => {
                    const resultItem = document.createElement('div');
                    resultItem.className = 'search-result-item';
                    resultItem.innerHTML = `
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <p><strong>${product.price}</strong></p>
                        <a href="#${product.category}" class="btn">View Product</a>
                    `;
                    searchResults.appendChild(resultItem);
                });
            } else {
                searchResults.innerHTML = '<p>No products found. Try different keywords.</p>';
            }
        }
        
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keyup', function(event) {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // Accordion functionality
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            
            if (content.classList.contains('active')) {
                content.classList.remove('active');
            } else {
                // Close other open accordions
                document.querySelectorAll('.accordion-content.active').forEach(openContent => {
                    openContent.classList.remove('active');
                });
                document.querySelectorAll('.accordion-header.active').forEach(openHeader => {
                    openHeader.classList.remove('active');
                });
                
                this.classList.add('active');
                content.classList.add('active');
            }
        });
    });
    
    // Gallery lightbox functionality
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightbox = document.querySelector('.close-lightbox');
    
    if (galleryItems.length > 0 && lightbox) {
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const imgSrc = this.querySelector('img').getAttribute('src');
                const altText = this.querySelector('img').getAttribute('alt');
                
                lightboxImg.setAttribute('src', imgSrc);
                lightboxImg.setAttribute('alt', altText);
                document.querySelector('.lightbox-caption').textContent = altText;
                lightbox.style.display = 'block';
            });
        });
        
        closeLightbox.addEventListener('click', function() {
            lightbox.style.display = 'none';
        });
        
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });
    }
    
    // Form validation for home contact form
    const homeContactForm = document.getElementById('homeContactForm');
    
    if (homeContactForm) {
        homeContactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            if (name && email && message) {
                // In a real application, you would send this data to a server
                alert('Thank you for your message! We will get back to you soon.');
                this.reset();
            } else {
                alert('Please fill in all required fields.');
            }
        });
    }
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });
});