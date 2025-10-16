// Local Authentication System - Register
// No Firebase needed

document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    const savedUser = sessionStorage.getItem('currentUser');
    if (savedUser) {
        window.location.href = 'index.html';
        return;
    }
    
    // Register form submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('fullName').value.trim();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const role = document.getElementById('role').value;
            const phone = document.getElementById('phone') ? document.getElementById('phone').value.trim() : '';
            const department = document.getElementById('department') ? document.getElementById('department').value.trim() : '';
            const terms = document.getElementById('terms').checked;
            
            const registerBtn = document.getElementById('registerBtn');
            const registerText = document.getElementById('registerText');
            const registerLoading = document.getElementById('registerLoading');
            
            // Validate form
            if (!fullName || !username || !password || !confirmPassword || !role) {
                showError('يرجى ملء جميع الحقول المطلوبة');
                return;
            }
            
            if (password !== confirmPassword) {
                showError('كلمة المرور وتأكيد كلمة المرور غير متطابقتين');
                return;
            }
            
            if (password.length < 6) {
                showError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
                return;
            }
            
            if (!terms) {
                showError('يجب الموافقة على شروط الاستخدام');
                return;
            }
            
            // Show loading state
            registerBtn.disabled = true;
            if (registerText) registerText.style.display = 'none';
            if (registerLoading) registerLoading.style.display = 'inline-block';
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
            
            // Check if username already exists
            const existingUser = users.find(u => u.username === username);
            if (existingUser) {
                showError('اسم المستخدم موجود بالفعل');
                registerBtn.disabled = false;
                if (registerText) registerText.style.display = 'inline';
                if (registerLoading) registerLoading.style.display = 'none';
                return;
            }
            
            // Get default permissions
            const permissions = getDefaultPermissions(role);
            
            // Create new user
            const newUser = {
                id: Date.now(),
                fullName: fullName,
                username: username,
                password: password,
                role: role,
                phone: phone,
                department: department,
                permissions: permissions,
                isActive: true,
                createdAt: new Date().toISOString(),
                lastLogin: null
            };
            
            // Add user to array
            users.push(newUser);
            
            // Save to localStorage
            try {
                localStorage.setItem('users', JSON.stringify(users));
                console.log('New user registered:', newUser);
                showSuccess('تم إنشاء الحساب بنجاح! جاري التوجيه لتسجيل الدخول...');
                
                // Redirect to login page after a delay
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
                
            } catch (error) {
                console.error('Error saving user to localStorage:', error);
                showError('خطأ في إنشاء الحساب');
                registerBtn.disabled = false;
                if (registerText) registerText.style.display = 'inline';
                if (registerLoading) registerLoading.style.display = 'none';
            }
        });
    }
});

// Get default permissions based on role
function getDefaultPermissions(role) {
    const permissions = {
        'admin': {
            'forms': ['create', 'read', 'update', 'delete', 'print'],
            'documents': ['create', 'read', 'update', 'delete', 'print', 'download'],
            'signatures': ['create', 'read', 'update', 'delete', 'unify'],
            'users': ['create', 'read', 'update', 'delete'],
            'system': ['monitor', 'logs', 'settings']
        },
        'user': {
            'forms': ['create', 'read', 'print'],
            'documents': ['read', 'print'],
            'signatures': ['read'],
            'users': [],
            'system': []
        }
    };
    
    return permissions[role] || permissions['user'];
}

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

// Show login form
function showLoginForm() {
    window.location.href = 'login.html';
}

// Show terms
function showTerms() {
    alert('شروط الاستخدام:\n\n1. يجب استخدام النظام لأغراض رسمية فقط\n2. عدم مشاركة بيانات الدخول مع الآخرين\n3. الحفاظ على سرية المعلومات\n4. الالتزام بالقوانين واللوائح\n5. إبلاغ الإدارة عن أي مشاكل أمنية');
}

// Show privacy policy
function showPrivacy() {
    alert('سياسة الخصوصية:\n\n1. نحن نحترم خصوصيتك ونحمي بياناتك الشخصية\n2. البيانات محفوظة محلياً في المتصفح\n3. لا نشارك بياناتك مع أطراف ثالثة\n4. يمكنك طلب حذف بياناتك في أي وقت\n5. نستخدم التشفير لحماية معلوماتك');
}

