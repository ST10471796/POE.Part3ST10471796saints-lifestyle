// Enquiry form functionality with file download
document.addEventListener('DOMContentLoaded', function() {
    const enquiryForm = document.getElementById('enquiryForm');
    const responseMessage = document.getElementById('responseMessage');
    
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset previous error messages
            clearErrorMessages();
            
            // Validate form
            if (validateEnquiryForm()) {
                // Get form data
                const formData = {
                    name: document.getElementById('name').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    enquiryType: document.getElementById('enquiryType').value,
                    product: document.getElementById('product').value,
                    quantity: document.getElementById('quantity').value,
                    message: document.getElementById('message').value,
                    timestamp: new Date().toLocaleString('en-ZA', {
                        timeZone: 'Africa/Johannesburg'
                    })
                };
                
                // Process enquiry and download file
                processEnquiryAndDownload(formData);
            }
        });
        
        // Real-time validation
        const inputs = enquiryForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    }
    
    function validateEnquiryForm() {
        let isValid = true;
        const requiredFields = enquiryForm.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        // Additional validation for email
        const emailField = document.getElementById('email');
        if (emailField.value && !isValidEmail(emailField.value)) {
            showError(emailField, 'Please enter a valid email address');
            isValid = false;
        }
        
        // Additional validation for phone (if provided)
        const phoneField = document.getElementById('phone');
        if (phoneField.value && !isValidPhone(phoneField.value)) {
            showError(phoneField, 'Please enter a valid phone number');
            isValid = false;
        }
        
        return isValid;
    }
    
    function validateField(field) {
        const value = field.value.trim();
        const fieldId = field.id;
        
        // Clear previous error
        clearFieldError(field);
        
        // Check if required field is empty
        if (field.hasAttribute('required') && value === '') {
            showError(field, 'This field is required');
            return false;
        }
        
        // Field-specific validation
        switch(fieldId) {
            case 'email':
                if (value && !isValidEmail(value)) {
                    showError(field, 'Please enter a valid email address');
                    return false;
                }
                break;
            case 'phone':
                if (value && !isValidPhone(value)) {
                    showError(field, 'Please enter a valid phone number');
                    return false;
                }
                break;
            case 'quantity':
                if (value && (value < 1 || value > 1000)) {
                    showError(field, 'Please enter a quantity between 1 and 1000');
                    return false;
                }
                break;
        }
        
        return true;
    }
    
    function showError(field, message) {
        const errorElement = document.getElementById(field.id + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
            field.style.borderColor = '#e74c3c';
        }
    }
    
    function clearFieldError(field) {
        const errorElement = document.getElementById(field.id + 'Error');
        if (errorElement) {
            errorElement.textContent = '';
            field.style.borderColor = '';
        }
    }
    
    function clearErrorMessages() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(error => {
            error.textContent = '';
        });
        
        const inputs = enquiryForm.querySelectorAll('input, select, textarea');
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
    
    function processEnquiryAndDownload(formData) {
        // Show loading state
        const submitButton = enquiryForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Processing...';
        submitButton.disabled = true;
        
        // Simulate processing delay
        setTimeout(() => {
            try {
                // Generate file content
                const fileContent = generateEnquiryFileContent(formData);
                
                // Create and download the file
                downloadEnquiryFile(fileContent, formData);
                
                // Generate response based on enquiry type
                let responseText = '';
                
                switch(formData.enquiryType) {
                    case 'product':
                        responseText = `Thank you ${formData.name} for your product enquiry. `;
                        if (formData.product) {
                            responseText += `We'll provide you with detailed information about our ${formData.product} shortly. `;
                        }
                        responseText += `Our team will contact you at ${formData.email} within 24 hours.`;
                        break;
                        
                    case 'wholesale':
                        responseText = `Thank you ${formData.name} for your wholesale enquiry. `;
                        if (formData.quantity) {
                            responseText += `For quantities of ${formData.quantity} units, we offer discounted pricing. `;
                        }
                        responseText += `Our wholesale manager will contact you at ${formData.email} to discuss pricing and terms.`;
                        break;
                        
                    case 'collaboration':
                        responseText = `Thank you ${formData.name} for your interest in collaboration. `;
                        responseText += `We're always excited to explore new partnerships. Our collaboration team will review your message and contact you at ${formData.email}.`;
                        break;
                        
                    default:
                        responseText = `Thank you ${formData.name} for your enquiry. `;
                        responseText += `We've received your message and will respond to ${formData.email} within 48 hours.`;
                }
                
                // Add download confirmation to response
                responseText += `\n\nA confirmation file has been downloaded with your enquiry details.`;
                
                // Display response
                responseMessage.textContent = responseText;
                responseMessage.className = 'response-message success';
                responseMessage.style.display = 'block';
                
                // Reset form
                enquiryForm.reset();
                
                // Reset button
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                
                // Scroll to response message
                responseMessage.scrollIntoView({ behavior: 'smooth' });
                
            } catch (error) {
                console.error('Error processing enquiry:', error);
                
                // Show error message
                responseMessage.textContent = 'Sorry, there was an error processing your enquiry. Please try again.';
                responseMessage.className = 'response-message error';
                responseMessage.style.display = 'block';
                
                // Reset button
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        }, 1500);
    }
    
    function generateEnquiryFileContent(formData) {
        // Create a formatted text file content
        const enquiryTypes = {
            'product': 'Product Information',
            'wholesale': 'Wholesale Opportunity',
            'collaboration': 'Collaboration',
            'other': 'Other Enquiry'
        };
        
        const products = {
            'hoodie': 'Premium Hoodie',
            'beanie': 'Classic Beanie',
            'jeans': 'Slim Fit Jeans',
            'all': 'All Products'
        };
        
        const content = `
SAINTS LIFESTYLE APPAREL - ENQUIRY CONFIRMATION
================================================

ENQUIRY DETAILS:
----------------
Date & Time: ${formData.timestamp}
Enquiry Type: ${enquiryTypes[formData.enquiryType] || formData.enquiryType}

CUSTOMER INFORMATION:
--------------------
Full Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}

PRODUCT INFORMATION:
-------------------
Product: ${products[formData.product] || formData.product || 'Not specified'}
Quantity: ${formData.quantity || 'Not specified'}

MESSAGE:
--------
${formData.message}

ADDITIONAL INFORMATION:
----------------------
This enquiry was submitted through the Saints Lifestyle Apparel website.
Please keep this file for your records.

CONTACT INFORMATION:
-------------------
Email: info@saints.co.za
Phone: +27 676 484 634
Website: www.saints-lifestyle.co.za

Thank you for your interest in Saints Lifestyle Apparel!
We will respond to your enquiry within 24-48 hours.

================================================
        `.trim();
        
        return content;
    }
    
    function downloadEnquiryFile(content, formData) {
        // Create a Blob with the file content
        const blob = new Blob([content], { type: 'text/plain' });
        
        // Create a download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        // Generate filename with timestamp and customer name
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const filename = `saints-enquiry-${formData.name.replace(/\s+/g, '-').toLowerCase()}-${timestamp}.txt`;
        
        // Set download attributes
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        
        // Append to body and trigger download
        document.body.appendChild(a);
        a.click();
        
        // Clean up
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    }
});