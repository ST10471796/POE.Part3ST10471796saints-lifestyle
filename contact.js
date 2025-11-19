// Contact form and map functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const contactResponse = document.getElementById('contactResponse');
    
    // Initialize map if on contact page
    if (document.getElementById('map')) {
        initializeMap();
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset previous error messages
            clearContactErrorMessages();
            
            // Validate form
            if (validateContactForm()) {
                // Get form data
                const formData = {
                    name: document.getElementById('contactName').value,
                    email: document.getElementById('contactEmail').value,
                    phone: document.getElementById('contactPhone').value,
                    messageType: document.getElementById('messageType').value,
                    message: document.getElementById('contactMessage').value
                };
                
                // Simulate form submission (in a real app, this would be an AJAX call)
                simulateContactSubmission(formData);
            }
        });
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateContactField(this);
            });
        });
    }
    
    function validateContactForm() {
        let isValid = true;
        const requiredFields = contactForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!validateContactField(field)) {
                isValid = false;
            }
        });
        
        // Additional validation for email
        const emailField = document.getElementById('contactEmail');
        if (emailField.value && !isValidEmail(emailField.value)) {
            showContactError(emailField, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Additional validation for phone (if provided)
        const phoneField = document.getElementById('contactPhone');
        if (phoneField.value && !isValidPhone(phoneField.value)) {
            showContactError(phoneField, 'Please enter a valid phone number');
            isValid = false;
        }
        
        return isValid;
    }
    
    function validateContactField(field) {
        const value = field.value.trim();
        const fieldId = field.id;
        
        // Clear previous error
        clearContactFieldError(field);
        
        // Check if required field is empty
        if (field.hasAttribute('required') && value === '') {
            showContactError(field, 'This field is required');
            return false;
        }
        
        // Field-specific validation
        switch(fieldId) {
            case 'contactEmail':
                if (value && !isValidEmail(value)) {
                    showContactError(field, 'Please enter a valid email address');
                    return false;
                }
                break;
            case 'contactPhone':
                if (value && !isValidPhone(value)) {
                    showContactError(field, 'Please enter a valid phone number');
                    return false;
                }
                break;
        }
        
        return true;
    }
    
    function showContactError(field, message) {
        const errorElement = document.getElementById(field.id + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
            field.style.borderColor = '#e74c3c';
        }
    }
    
    function clearContactFieldError(field) {
        const errorElement = document.getElementById(field.id + 'Error');
        if (errorElement) {
            errorElement.textContent = '';
            field.style.borderColor = '';
        }
    }
    
    function clearContactErrorMessages() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(error => {
            error.textContent = '';
        });
        
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.style.borderColor = '';
        });
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function isValidPhone(phone) {
        // Basic phone validation - allows various formats
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone);
    }
    
    function simulateContactSubmission(formData) {
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Simulate API call delay
        setTimeout(() => {
            // Generate response
            const responseText = `Thank you ${formData.name} for your message. We've received your ${formData.messageType.toLowerCase()} and will respond to you at ${formData.email} within 24 hours.`;
            
            // Display response
            contactResponse.textContent = responseText;
            contactResponse.className = 'response-message success';
            contactResponse.style.display = 'block';
            
            // In a real application, you would send the form data to a server here
            // For demonstration, we'll log it to the console
            console.log('Form data to be sent via email:', formData);
            
            // Reset form
            contactForm.reset();
            
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            
            // Scroll to response message
            contactResponse.scrollIntoView({ behavior: 'smooth' });
            
        }, 2000);
    }
    
    function initializeMap() {
        // Initialize Leaflet map centered on Sabie, Mpumalanga
        const map = L.map('map').setView([-25.0992, 30.7793], 13);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        // Add a marker for Saints location in Sabie
        const marker = L.marker([-25.0992, 30.7793]).addTo(map);
        marker.bindPopup('<b>Saints Lifestyle Apparel</b><br>Sabie, Mpumalanga, South Africa').openPopup();
        
        // Add some interactive features
        map.on('click', function(e) {
            const popup = L.popup()
                .setLatLng(e.latlng)
                .setContent('You clicked the map at ' + e.latlng.toString())
                .openOn(map);
        });
    }
});