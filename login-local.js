// Local Authentication System - Login
// No Firebase needed

document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
        window.location.href = 'index.html';
        return;
    }
    
    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const loginBtn = document.getElementById('loginBtn');
            const loginText = document.getElementById('loginText');
            const loginLoading = document.getElementById('loginLoading');
            
            // Validate input
            if (!username || !password) {
                showError('يرجى إدخال اسم المستخدم وكلمة المرور');
                return;
            }
            
            // Show loading state
            loginBtn.disabled = true;
            if (loginText) loginText.style.display = 'none';
            if (loginLoading) loginLoading.style.display = 'inline-block';
            hideMessages();
            
            // Get users from localStorage
            const usersJSON = localStorage.getItem('users');
            let users = [];
            
            try {
                users = usersJSON ? JSON.parse(usersJSON) : [];
            } catch (error) {
                console.error('Error parsing users:', error);
                users = [];
            }
            
            // Find user
            const user = users.find(u => u.username === username && u.password === password);
            
            if (user) {
                // Successful login
                const currentUser = {
                    id: user.id,
                    username: user.username,
                    fullName: user.fullName,
                    role: user.role,
                    permissions: user.permissions || {},
                    department: user.department || '',
                    phone: user.phone || '',
                    isActive: user.isActive !== false
                };
                
                // Save to session storage
                sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                // Update last login
                user.lastLogin = new Date().toISOString();
                localStorage.setItem('users', JSON.stringify(users));
                
                showSuccess('تم تسجيل الدخول بنجاح! جاري التوجيه...');
                
                // Redirect to main page
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                // Failed login
                showError('اسم المستخدم أو كلمة المرور غير صحيحة');
                
                // Reset button state
                loginBtn.disabled = false;
                if (loginText) loginText.style.display = 'inline';
                if (loginLoading) loginLoading.style.display = 'none';
            }
        });
    }
});

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
}

// Show success message
function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.style.display = 'block';
        
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 5000);
    }
}

// Hide all messages
function hideMessages() {
    const errorDiv = document.getElementById('errorMessage');
    const successDiv = document.getElementById('successMessage');
    if (errorDiv) errorDiv.style.display = 'none';
    if (successDiv) successDiv.style.display = 'none';
}

// Reset password function
function resetPassword() {
    alert('لإعادة تعيين كلمة المرور، يرجى التواصل مع مدير النظام');
}

// Show register form
function showRegisterForm() {
    window.location.href = 'register.html';
}

