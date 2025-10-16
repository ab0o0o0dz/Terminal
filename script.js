// Local Authentication System (No Firebase needed)

// Global Variables
let currentUser = null;
let currentForm = null;
let currentEditingDocId = null;
let signatureCanvas = null;
let signatureCtx = null;
let isDrawing = false;
let documents = JSON.parse(localStorage.getItem('documents')) || [];
let users = JSON.parse(localStorage.getItem('users')) || [];
let signatures = JSON.parse(localStorage.getItem('signatures')) || [];

// Load users from localStorage on page load
function loadUsersFromStorage() {
    try {
        const storedUsers = localStorage.getItem('users');
        if (storedUsers) {
            users = JSON.parse(storedUsers);
            console.log('Users loaded from localStorage:', users);
        } else {
            console.log('No users found in localStorage');
        }
    } catch (error) {
        console.error('Error loading users from localStorage:', error);
        users = [];
    }
    
    // Update global users array
    window.users = users;
}

// Initialize users on page load
loadUsersFromStorage();

// Permissions System
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

// Military Ranks
const militaryRanks = {
    officers: [
        'ملازم',
        'ملازم أول',
        'نقيب',
        'رائد',
        'مقدم',
        'عقيد',
        'عميد',
        'لواء'
    ],
    enlisted: [
        'جندي',
        'جندي أول',
        'عريف',
        'وكيل رقيب',
        'رقيب',
        'رقيب أول',
        'رئيس رقباء'
    ]
};

// Commander Information
const commanderInfo = {
    name: 'عبدالله الزهراني',
    rank: 'مقدم',
    position: 'قائد فرقة N3',
    unit: 'قسم العمليات وزارة الداخلية'
};

// Initialize default admin user if no users exist
if (users.length === 0) {
    users.push({
        id: 1,
        fullName: 'مدير النظام',
        username: 'admin',
        password: 'admin123456',
        role: 'admin',
        permissions: permissions['admin'],
        isActive: true,
        createdAt: new Date().toISOString()
    });
    localStorage.setItem('users', JSON.stringify(users));
    console.log('Default admin user created');
}

// Initialize default signature if none exists
if (signatures.length === 0) {
    signatures.push({
        id: 1,
        name: 'التوقيع الافتراضي',
        data: '',
        isDefault: true,
        createdAt: new Date().toISOString()
    });
    localStorage.setItem('signatures', JSON.stringify(signatures));
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a page that needs authentication
    if (!window.location.pathname.includes('login.html') && !window.location.pathname.includes('register.html')) {
    checkLoginStatus();
    }
    
    initializeSignatureCanvas();
    loadDocuments();
    loadUsers();
    loadSignatures();
    
    // Add form validation
    addFormValidation();
});

function addFormValidation() {
    // Add real-time validation to form inputs
    document.addEventListener('input', function(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
            const input = e.target;
            if (input.hasAttribute('required') && !input.value.trim()) {
                input.style.borderColor = '#dc3545';
                input.style.borderWidth = '2px';
            } else {
                input.style.borderColor = '#e0e0e0';
                input.style.borderWidth = '2px';
            }
        }
    });
}

// Local Authentication Functions
function showTerms() {
    alert('شروط الاستخدام:\n\n1. يجب استخدام النظام لأغراض رسمية فقط\n2. عدم مشاركة بيانات الدخول مع الآخرين\n3. الحفاظ على سرية المعلومات\n4. الالتزام بالقوانين واللوائح\n5. إبلاغ الإدارة عن أي مشاكل أمنية');
}

function logout() {
    // Clear user data
    currentUser = null;
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('currentUser');
    
    showMessage('تم تسجيل الخروج بنجاح', 'success');
    
    // Redirect to login page
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

function checkLoginStatus() {
    // Check if we're on the main page
    if (window.location.pathname.includes('login.html') || window.location.pathname.includes('register.html')) {
        return; // Don't redirect if already on login/register pages
    }
    
    // Check session storage for logged in user
    const savedUser = sessionStorage.getItem('currentUser');
    
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            showDashboard();
            updateUIForPermissions();
        } catch (error) {
            console.error('Error parsing user data:', error);
            redirectToLogin();
        }
    } else {
        // No user logged in, redirect to login page
        redirectToLogin();
    }
}

function redirectToLogin() {
    // Clear any stored user data
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('currentUser');
    
    // Check if we're on the main page
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
        // Show login redirect message
        const loginRedirect = document.getElementById('loginRedirect');
        const dashboard = document.getElementById('dashboard');
        if (loginRedirect) loginRedirect.style.display = 'flex';
        if (dashboard) dashboard.style.display = 'none';
    } else {
        // Redirect to login page
        window.location.href = 'login.html';
    }
}

function showDashboard() {
    const loginRedirect = document.getElementById('loginRedirect');
    const dashboard = document.getElementById('dashboard');
    const userInfo = document.getElementById('userInfo');
    
    if (loginRedirect) loginRedirect.style.display = 'none';
    if (dashboard) dashboard.style.display = 'block';
    if (userInfo) userInfo.style.display = 'flex';
    
    // Display user information
    const userNameElement = document.getElementById('userName');
    if (currentUser && userNameElement) {
        userNameElement.textContent = currentUser.fullName || currentUser.displayName || 'مستخدم';
    }
}

// Navigation Functions
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected section
    const selectedSection = document.getElementById(sectionName + 'Section');
    if (selectedSection) {
        selectedSection.classList.add('active');
    }
    
    // Add active class to clicked button
    if (event && event.target) {
    event.target.classList.add('active');
    }
    
    // Load section data
    switch(sectionName) {
        case 'documents':
            loadDocuments();
            break;
        case 'users':
            loadUsersFromStorage();
            loadUsers();
            break;
        case 'signatures':
            loadSignatures();
            break;
    }
}

// Form Functions
function openForm(formType) {
    console.log('Opening form:', formType);
    
    // Check permissions
    if (!currentUser) {
        showMessage('يجب تسجيل الدخول أولاً', 'error');
        return;
    }
    
    if (!hasPermission('forms', 'create')) {
        showMessage('ليس لديك صلاحية لإنشاء النماذج', 'error');
        return;
    }
    
    currentForm = formType;
    currentEditingDocId = null; // Reset editing mode
    
    const modal = document.getElementById('formModal');
    const formContent = document.getElementById('formContent');
    const formTitle = document.getElementById('formTitle');
    
    if (!modal || !formContent || !formTitle) {
        showMessage('خطأ في تحميل النموذج', 'error');
        return;
    }
    
    let formHTML = '';
    
    if (formType === 'absence') {
        formTitle.textContent = 'نموذج تأخير أو غياب / يوم كامل';
        formHTML = generateAbsenceForm();
    } else if (formType === 'handover') {
        formTitle.textContent = 'نموذج تأخير استلام أو التسليم';
        formHTML = generateHandoverForm();
    } else {
        showMessage('نوع النموذج غير معروف', 'error');
        return;
    }
    
    formContent.innerHTML = formHTML;
    modal.style.display = 'block';
    
    // Add Hijri date to form
    setTimeout(() => {
        addHijriDateToForm();
        displayCommanderSignature();
    }, 100);
    
    console.log('Form opened successfully');
}

function generateAbsenceForm() {
    return `
        <div class="form-header">
            <div class="logo-section">
                <img src="logo.svg" alt="شعار وزارة الداخلية" class="logo">
            </div>
            <div class="title-section">
                <h1>المملكة العربية السعودية</h1>
                <h2>وزارة الداخلية</h2>
                <h3>نموذج تأخير أو غياب / يوم كامل</h3>
            </div>
        </div>
        
        <div class="form-group">
            <label for="name">الاسم:</label>
            <input type="text" id="name" name="name" required>
        </div>
        
        <div class="form-group">
            <label for="rank">الرتبة العسكرية:</label>
            <select id="rank" name="rank" required>
                <option value="">اختر الرتبة</option>
                <optgroup label="الضباط">
                    ${militaryRanks.officers.map(rank => `<option value="${rank}">${rank}</option>`).join('')}
                </optgroup>
                <optgroup label="الأفراد">
                    ${militaryRanks.enlisted.map(rank => `<option value="${rank}">${rank}</option>`).join('')}
                </optgroup>
            </select>
        </div>
        
        <div class="form-group">
            <label for="militaryNumber">الرقم العسكري:</label>
            <input type="text" id="militaryNumber" name="militaryNumber" required>
        </div>
        
        <div class="form-group">
            <label for="unit">الوحدة:</label>
            <input type="text" id="unit" name="unit" value="منسوبي قسم العمليات" readonly>
        </div>
        
        <div class="form-group">
            <label for="reason">ما سبب غيابك / تأخرك عن استلامك ليوم كامل؟</label>
            <textarea id="reason" name="reason" required></textarea>
        </div>
        
        <div class="form-group">
            <label for="evidence">هل لديك ما يثبت صحة أقوالك؟</label>
            <textarea id="evidence" name="evidence" required></textarea>
        </div>
        
        <div class="form-group">
            <label for="commitment">هل تتعهد بعدم تكرار الغياب أو التأخير مرة أخرى؟</label>
            <textarea id="commitment" name="commitment" required></textarea>
        </div>
        
        <div class="form-group">
            <label for="declaration">الإقرار:</label>
            <textarea id="declaration" name="declaration" readonly>أتعهد أنا المذكور بياناتي أعلاه بعدم تكرار الغياب أو التأخير عن العمل مستقبلاً، وأن جميع المعلومات الواردة أعلاه صحيحة وتحت مسؤوليتي الكاملة.</textarea>
        </div>
        
        <div class="commander-info">
            <h4>بيانات القائد</h4>
            <div class="commander-details">
                <div><strong>الاسم:</strong> ${commanderInfo.name}</div>
                <div><strong>الرتبة:</strong> ${commanderInfo.rank}</div>
                <div><strong>الوظيفة:</strong> ${commanderInfo.position}</div>
                <div><strong>الوحدة:</strong> ${commanderInfo.unit}</div>
            </div>
            <div class="commander-signature">
                <div><strong>التوقيع:</strong></div>
                <div id="commanderSignatureDisplay"></div>
            </div>
        </div>
    `;
}

function generateHandoverForm() {
    return `
        <div class="form-header">
            <div class="logo-section">
                <img src="logo.svg" alt="شعار وزارة الداخلية" class="logo">
            </div>
            <div class="title-section">
                <h1>المملكة العربية السعودية</h1>
                <h2>وزارة الداخلية</h2>
                <h3>نموذج تأخير استلام أو التسليم</h3>
            </div>
        </div>
        
        <div class="form-group">
            <label for="name">الاسم:</label>
            <input type="text" id="name" name="name" required>
        </div>
        
        <div class="form-group">
            <label for="rank">الرتبة العسكرية:</label>
            <select id="rank" name="rank" required>
                <option value="">اختر الرتبة</option>
                <optgroup label="الضباط">
                    ${militaryRanks.officers.map(rank => `<option value="${rank}">${rank}</option>`).join('')}
                </optgroup>
                <optgroup label="الأفراد">
                    ${militaryRanks.enlisted.map(rank => `<option value="${rank}">${rank}</option>`).join('')}
                </optgroup>
            </select>
        </div>
        
        <div class="form-group">
            <label for="militaryNumber">الرقم العسكري:</label>
            <input type="text" id="militaryNumber" name="militaryNumber" required>
        </div>
        
        <div class="form-group">
            <label for="unit">الوحدة:</label>
            <input type="text" id="unit" name="unit" value="منسوبي قسم العمليات" readonly>
        </div>
        
        <div class="form-group">
            <label for="reason">ما سبب تأخرك عن الاستلام؟</label>
            <textarea id="reason" name="reason" required></textarea>
        </div>
        
        <div class="form-group">
            <label for="evidence">هل لديك ما يثبت صحة أقوالك؟</label>
            <textarea id="evidence" name="evidence" required></textarea>
        </div>
        
        <div class="form-group">
            <label for="commitment">هل تتعهد بعدم التكرار مرة أخرى؟</label>
            <textarea id="commitment" name="commitment" required></textarea>
        </div>
        
        <div class="form-group">
            <label for="declaration">الإقرار:</label>
            <textarea id="declaration" name="declaration" readonly>أتعهد أنا المذكور بياناتي أعلاه بعدم تكرار التأخر في الاستلام مرة أخرى، وأن جميع المعلومات الواردة أعلاه صحيحة وتحت مسؤوليتي الكاملة.</textarea>
        </div>
        
        <div class="commander-info">
            <h4>بيانات القائد</h4>
            <div class="commander-details">
                <div><strong>الاسم:</strong> ${commanderInfo.name}</div>
                <div><strong>الرتبة:</strong> ${commanderInfo.rank}</div>
                <div><strong>الوظيفة:</strong> ${commanderInfo.position}</div>
                <div><strong>الوحدة:</strong> ${commanderInfo.unit}</div>
            </div>
            <div class="commander-signature">
                <div><strong>التوقيع:</strong></div>
                <div id="commanderSignatureDisplay"></div>
            </div>
        </div>
    `;
}

function displayCommanderSignature() {
    const signatureDisplay = document.getElementById('commanderSignatureDisplay');
    if (signatureDisplay && signatures.length > 0) {
        const latestSignature = signatures[signatures.length - 1];
        if (latestSignature.data) {
            signatureDisplay.innerHTML = `<img src="${latestSignature.data}" alt="توقيع القائد" style="max-width: 200px; max-height: 100px; border: 1px solid #ccc; border-radius: 4px;">`;
        } else {
            signatureDisplay.innerHTML = '<p style="color: #666; font-size: 0.9rem;">لم يتم إضافة توقيع بعد</p>';
        }
    }
}

function closeForm() {
    const modal = document.getElementById('formModal');
    if (modal) {
        modal.style.display = 'none';
    }
    currentForm = null;
    currentEditingDocId = null;
}

function saveForm() {
    console.log('Saving form...');
    
    if (!currentUser) {
        showMessage('يجب تسجيل الدخول أولاً', 'error');
        return;
    }
    
    if (!hasPermission('forms', 'create') && !hasPermission('documents', 'update')) {
        showMessage('ليس لديك صلاحية لحفظ النماذج', 'error');
        return;
    }
    
    const form = document.getElementById('formContent');
    if (!form) {
        showMessage('خطأ في تحميل النموذج', 'error');
        return;
    }
    
    const formObject = {};
    
    // Get all form inputs
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.name && input.value) {
            formObject[input.name] = input.value.trim();
        }
    });
    
    // Validate required fields
    const requiredFields = ['name', 'rank', 'militaryNumber', 'reason', 'evidence', 'commitment'];
    const missingFields = requiredFields.filter(field => !formObject[field] || formObject[field].trim() === '');
    
    if (missingFields.length > 0) {
        showMessage('يرجى ملء جميع الحقول المطلوبة', 'error');
        
        // Highlight missing fields
        missingFields.forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                element.style.borderColor = '#dc3545';
                element.style.borderWidth = '2px';
                element.focus();
            }
        });
        return;
    }
    
    try {
        if (currentEditingDocId) {
            // Update existing document
            const docIndex = documents.findIndex(d => d.id === currentEditingDocId);
            if (docIndex !== -1) {
                documents[docIndex].data = formObject;
                documents[docIndex].updatedAt = new Date().toISOString();
                documents[docIndex].updatedBy = currentUser.username;
                localStorage.setItem('documents', JSON.stringify(documents));
                showMessage('تم تحديث المستند بنجاح', 'success');
            }
        } else {
            // Create new document
        const document = {
            id: Date.now(),
            type: currentForm,
            title: currentForm === 'absence' ? 'تأخير أو غياب / يوم كامل' : 'تأخير استلام أو التسليم',
            data: formObject,
            createdAt: new Date().toISOString(),
            createdBy: currentUser.username
        };
        
        documents.push(document);
        localStorage.setItem('documents', JSON.stringify(documents));
        showMessage('تم حفظ النموذج بنجاح', 'success');
        }
        
        closeForm();
        loadDocuments();
    } catch (error) {
        console.error('Error saving form:', error);
        showMessage('خطأ في حفظ النموذج: ' + error.message, 'error');
    }
}

function printForm() {
    console.log('Printing form...');
    
    if (!currentUser) {
        showMessage('يجب تسجيل الدخول أولاً', 'error');
        return;
    }
    
    if (!hasPermission('forms', 'print')) {
        showMessage('ليس لديك صلاحية للطباعة', 'error');
        return;
    }
    
    const formContent = document.getElementById('formContent');
    if (!formContent) {
        showMessage('خطأ في تحميل النموذج للطباعة', 'error');
        return;
    }
    
    // Get form data for printing
    const formData = {};
    const inputs = formContent.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.name && input.value) {
            formData[input.name] = input.value;
        }
    });
    
    // Get saved signature
    const savedSignature = signatures.length > 0 ? signatures[signatures.length - 1].data : '';
    
    const formTitle = currentForm === 'absence' ? 'نموذج تأخير أو غياب / يوم كامل' : 'نموذج تأخير استلام أو التسليم';
    
    // Create print window
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    if (!printWindow) {
        showMessage('يرجى السماح بالنوافذ المنبثقة للطباعة', 'error');
        return;
    }
    
    const printContent = `
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>طباعة النموذج</title>
            <style>
                @page {
                    size: A4 portrait;
                    margin: 10mm 12mm;
                }
                
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                
                body { 
                    font-family: 'Arial', 'Tahoma', 'Traditional Arabic', sans-serif; 
                    direction: rtl; 
                    font-size: 9pt;
                    line-height: 1.3;
                    color: #000;
                    background: white;
                    padding: 0;
                    margin: 0;
                }
                
                .print-container {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
                
                .form-header { 
                    text-align: center; 
                    margin-bottom: 4mm; 
                    border-bottom: 2px solid #000; 
                    padding-bottom: 3mm;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8mm;
                    page-break-after: avoid;
                    flex-shrink: 0;
                }
                
                .form-header .logo-section {
                    flex-shrink: 0;
                }
                
                .form-header .logo {
                    width: 35px;
                    height: 35px;
                    border: 1.5px solid #2E7D32;
                    border-radius: 50%;
                    background: white;
                }
                
                .form-header .title-section {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1mm;
                }
                
                .form-header h1 {
                    font-size: 12pt;
                    color: #000;
                    font-weight: bold;
                    margin: 0;
                    line-height: 1.2;
                }
                
                .form-header h2 {
                    font-size: 11pt;
                    color: #2E7D32;
                    font-weight: bold;
                    margin: 0;
                    line-height: 1.2;
                }
                
                .form-header h3 {
                    font-size: 10pt;
                    color: #000;
                    margin: 0;
                    line-height: 1.2;
                }
                
                .hijri-date {
                    background: #f0f0f0;
                    border: 1px solid #333;
                    color: #000;
                    font-size: 8pt;
                    margin-bottom: 3mm;
                    text-align: center;
                    padding: 2mm;
                    border-radius: 2px;
                    page-break-inside: avoid;
                    flex-shrink: 0;
                }
                
                .form-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }
                
                .form-group { 
                    margin-bottom: 2.5mm; 
                    page-break-inside: avoid;
                    border-bottom: 0.5px solid #ccc;
                    padding-bottom: 2mm;
                }
                
                .form-group:last-of-type {
                    border-bottom: none;
                    margin-bottom: 3mm;
                }
                
                .form-group label { 
                    font-weight: bold; 
                    display: block; 
                    margin-bottom: 1mm; 
                    font-size: 9pt;
                    color: #000;
                }
                
                .form-group .value { 
                    padding: 2mm 3mm; 
                    border: 1px solid #333; 
                    border-radius: 2px; 
                    font-size: 9pt;
                    background: #fafafa;
                    min-height: 8mm;
                    word-wrap: break-word;
                    line-height: 1.3;
                }
                
                .commander-info { 
                    margin-top: auto;
                    padding: 4mm; 
                    background: #f5f5f5; 
                    border-radius: 3px; 
                    border: 1.5px solid #000;
                    page-break-inside: avoid;
                    page-break-before: avoid;
                    flex-shrink: 0;
                }
                
                .commander-info h4 {
                    font-size: 10pt;
                    margin-bottom: 2mm;
                    text-align: center;
                    color: #2E7D32;
                    font-weight: bold;
                }
                
                .commander-details { 
                    display: grid; 
                    grid-template-columns: 1fr 1fr; 
                    gap: 2mm; 
                    margin-bottom: 3mm; 
                    font-size: 8pt;
                    line-height: 1.2;
                }
                
                .commander-details div {
                    padding: 1mm;
                }
                
                .commander-signature { 
                    text-align: center; 
                    margin-top: 3mm;
                    padding-top: 2mm;
                    border-top: 1px solid #999;
                }
                
                .commander-signature strong {
                    display: block;
                    margin-bottom: 2mm;
                    font-size: 9pt;
                }
                
                .commander-signature img {
                    max-width: 100px;
                    max-height: 50px;
                    border: 1px solid #999;
                    display: block;
                    margin: 0 auto;
                }
                
                .signature-line {
                    margin-top: 5mm;
                    height: 20mm;
                    border-bottom: 1.5px solid #000;
                    position: relative;
                }
                
                .signature-text {
                    position: absolute;
                    bottom: -5mm;
                    right: 0;
                    font-size: 8pt;
                    color: #666;
                }
                
                @media print {
                    html, body {
                        width: 210mm;
                        height: 297mm;
                        margin: 0;
                        padding: 0;
                    }
                    
                    body {
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    
                    .print-container {
                        padding: 0 !important;
                        margin: 0 !important;
                        max-width: 100% !important;
                        height: 100% !important;
                    }
                    
                    .form-header {
                        page-break-after: avoid !important;
                        break-after: avoid !important;
                    }
                    
                    .hijri-date {
                        page-break-after: avoid !important;
                        break-after: avoid !important;
                    }
                    
                    .form-group {
                        page-break-inside: avoid !important;
                        break-inside: avoid !important;
                    }
                    
                    .commander-info {
                        page-break-before: avoid !important;
                        page-break-inside: avoid !important;
                        break-before: avoid !important;
                        break-inside: avoid !important;
                    }
                    
                    * {
                        page-break-inside: avoid !important;
                    }
                }
            </style>
        </head>
        <body>
            <div class="print-container">
            <div class="form-header">
                <div class="logo-section">
                    <div class="logo"></div>
                </div>
                <div class="title-section">
                    <h1>المملكة العربية السعودية</h1>
                    <h2>وزارة الداخلية</h2>
                    <h3>${formTitle}</h3>
                </div>
            </div>
            
            <div class="hijri-date">
                <strong>التاريخ الهجري:</strong> ${getHijriDate()}
            </div>
            
            <div class="form-content">
                <div class="form-group">
                    <label>الاسم:</label>
                    <div class="value">${formData.name || ''}</div>
                </div>
                
                <div class="form-group">
                    <label>الرتبة العسكرية:</label>
                    <div class="value">${formData.rank || ''}</div>
                </div>
                
                <div class="form-group">
                    <label>الرقم العسكري:</label>
                    <div class="value">${formData.militaryNumber || ''}</div>
                </div>
                
                <div class="form-group">
                    <label>الوحدة:</label>
                    <div class="value">${formData.unit || 'منسوبي قسم العمليات'}</div>
                </div>
                
                <div class="form-group">
                    <label>${currentForm === 'absence' ? 'ما سبب غيابك / تأخرك عن استلامك ليوم كامل؟' : 'ما سبب تأخرك عن الاستلام؟'}</label>
                    <div class="value">${formData.reason || ''}</div>
                </div>
                
                <div class="form-group">
                    <label>هل لديك ما يثبت صحة أقوالك؟</label>
                    <div class="value">${formData.evidence || ''}</div>
                </div>
                
                <div class="form-group">
                    <label>${currentForm === 'absence' ? 'هل تتعهد بعدم تكرار الغياب أو التأخير مرة أخرى؟' : 'هل تتعهد بعدم التكرار مرة أخرى؟'}</label>
                    <div class="value">${formData.commitment || ''}</div>
                </div>
                
                <div class="form-group">
                    <label>الإقرار:</label>
                    <div class="value">${formData.declaration || ''}</div>
                </div>
            </div>
            
            <div class="commander-info">
                <h4>بيانات القائد</h4>
                <div class="commander-details">
                    <div><strong>الاسم:</strong> ${commanderInfo.name}</div>
                    <div><strong>الرتبة:</strong> ${commanderInfo.rank}</div>
                    <div><strong>الوظيفة:</strong> ${commanderInfo.position}</div>
                    <div><strong>الوحدة:</strong> ${commanderInfo.unit}</div>
                </div>
                <div class="commander-signature">
                        <strong>التوقيع:</strong>
                        ${savedSignature ? `<img src="${savedSignature}" alt="توقيع القائد">` : '<div class="signature-line"><div class="signature-text">توقيع القائد</div></div>'}
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Wait for content to load then print
    setTimeout(() => {
        try {
            printWindow.focus();
            printWindow.print();
            showMessage('تم فتح نافذة الطباعة بنجاح', 'success');
            
            // Close window after printing
            printWindow.addEventListener('afterprint', function() {
                printWindow.close();
            });
        } catch (error) {
            console.error('Print error:', error);
            showMessage('خطأ في الطباعة: ' + error.message, 'error');
        }
    }, 1000);
}

// Document Management Functions
function loadDocuments() {
    console.log('Loading documents...');
    
    if (!currentUser) {
        console.log('No user logged in');
        return;
    }
    
    if (!hasPermission('documents', 'read')) {
        console.log('No permission to read documents');
        return;
    }
    
    const documentsList = document.getElementById('documentsList');
    if (!documentsList) {
        console.log('Documents list element not found');
        return;
    }
    
    // Reload documents from localStorage
    documents = JSON.parse(localStorage.getItem('documents')) || [];
    
    documentsList.innerHTML = '';
    
    if (documents.length === 0) {
        documentsList.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">لا توجد مستندات محفوظة</p>';
        return;
    }
    
    // Sort documents by creation date (newest first)
    const sortedDocuments = [...documents].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    );
    
    sortedDocuments.forEach(doc => {
        const documentCard = document.createElement('div');
        documentCard.className = 'document-card';
        
        // Build actions based on permissions
        let actionsHTML = '';
        
        if (hasPermission('documents', 'read')) {
            actionsHTML += `<button class="btn btn-primary" onclick="viewDocument(${doc.id})">
                <i class="fas fa-eye"></i> عرض
            </button>`;
        }
        
        if (hasPermission('documents', 'update')) {
            actionsHTML += `<button class="btn btn-secondary" onclick="editDocument(${doc.id})">
                <i class="fas fa-edit"></i> تعديل
            </button>`;
        }
        
        if (hasPermission('documents', 'print')) {
            actionsHTML += `<button class="btn btn-success" onclick="printDocument(${doc.id})">
                <i class="fas fa-print"></i> طباعة
            </button>`;
        }
        
        if (hasPermission('documents', 'delete')) {
            actionsHTML += `<button class="btn btn-danger" onclick="deleteDocument(${doc.id})">
                <i class="fas fa-trash"></i> حذف
            </button>`;
        }
        
        documentCard.innerHTML = `
            <div class="document-header">
                <div class="document-title">${doc.title}</div>
                <div class="document-date">${new Date(doc.createdAt).toLocaleDateString('ar-SA')}</div>
            </div>
            <div class="document-info" style="margin-bottom: 1rem; font-size: 0.9rem; color: #666;">
                <div>الاسم: ${doc.data?.name || 'غير محدد'}</div>
                <div>الرتبة: ${doc.data?.rank || 'غير محدد'}</div>
            </div>
            <div class="document-actions">
                ${actionsHTML}
            </div>
        `;
        documentsList.appendChild(documentCard);
    });
    
    console.log('Documents loaded successfully:', documents.length);
}

function viewDocument(id) {
    console.log('Viewing document:', id);
    
    if (!hasPermission('documents', 'read')) {
        showMessage('ليس لديك صلاحية لعرض المستندات', 'error');
        return;
    }
    
    const doc = documents.find(d => d.id === id);
    if (!doc) {
        showMessage('المستند غير موجود', 'error');
        return;
    }
    
        currentForm = doc.type;
    currentEditingDocId = null; // View only, not editing
        openForm(doc.type);
    
        // Fill form with saved data
    setTimeout(() => {
        Object.keys(doc.data).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = doc.data[key];
                element.readOnly = true; // Make read-only for view mode
                element.style.backgroundColor = '#f5f5f5';
            }
        });
        
        // Disable save button in view mode
        const modalFooter = document.querySelector('#formModal .modal-footer');
        if (modalFooter) {
            const saveBtn = modalFooter.querySelector('.btn-primary');
            if (saveBtn) {
                saveBtn.style.display = 'none';
            }
        }
    }, 200);
}

function editDocument(id) {
    console.log('Editing document:', id);
    
    if (!hasPermission('documents', 'update')) {
        showMessage('ليس لديك صلاحية لتعديل المستندات', 'error');
        return;
    }
    
    const doc = documents.find(d => d.id === id);
    if (!doc) {
        showMessage('المستند غير موجود', 'error');
        return;
    }
    
        currentForm = doc.type;
    currentEditingDocId = id; // Set editing mode
        openForm(doc.type);
    
        // Fill form with saved data
    setTimeout(() => {
        Object.keys(doc.data).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = doc.data[key];
                element.readOnly = false; // Make editable
                element.style.backgroundColor = '#fff';
            }
        });
    }, 200);
}

function printDocument(id) {
    console.log('Printing document:', id);
    
    if (!hasPermission('documents', 'print')) {
        showMessage('ليس لديك صلاحية للطباعة', 'error');
        return;
    }
    
    const doc = documents.find(d => d.id === id);
    if (!doc) {
        showMessage('المستند غير موجود', 'error');
        return;
    }
    
        currentForm = doc.type;
        openForm(doc.type);
        
        // Fill form with saved data
    setTimeout(() => {
        Object.keys(doc.data).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.value = doc.data[key];
            }
        });
        
        // Print after a short delay
        setTimeout(() => printForm(), 300);
    }, 200);
}

function deleteDocument(id) {
    console.log('Deleting document:', id);
    
    if (!hasPermission('documents', 'delete')) {
        showMessage('ليس لديك صلاحية لحذف المستندات', 'error');
        return;
    }
    
    if (confirm('هل أنت متأكد من حذف هذا المستند؟')) {
        documents = documents.filter(d => d.id !== id);
        localStorage.setItem('documents', JSON.stringify(documents));
        loadDocuments();
        showMessage('تم حذف المستند بنجاح', 'success');
    }
}

function refreshDocuments() {
    if (!hasPermission('documents', 'read')) {
        showMessage('ليس لديك صلاحية لعرض المستندات', 'error');
        return;
    }
    
    loadDocuments();
    showMessage('تم تحديث قائمة المستندات', 'success');
}

// Signature Management Functions
function initializeSignatureCanvas() {
    signatureCanvas = document.getElementById('signatureCanvas');
    if (signatureCanvas) {
        signatureCtx = signatureCanvas.getContext('2d');
        signatureCtx.strokeStyle = '#000';
        signatureCtx.lineWidth = 2;
        signatureCtx.lineCap = 'round';
        
        // Add event listeners
        signatureCanvas.addEventListener('mousedown', startDrawing);
        signatureCanvas.addEventListener('mousemove', draw);
        signatureCanvas.addEventListener('mouseup', stopDrawing);
        signatureCanvas.addEventListener('mouseout', stopDrawing);
        
        // Touch events for mobile
        signatureCanvas.addEventListener('touchstart', handleTouch);
        signatureCanvas.addEventListener('touchmove', handleTouch);
        signatureCanvas.addEventListener('touchend', stopDrawing);
    }
}

function addSignature() {
    console.log('Adding signature...');
    
    if (!currentUser) {
        showMessage('يجب تسجيل الدخول أولاً', 'error');
        return;
    }
    
    if (!hasPermission('signatures', 'create')) {
        showMessage('ليس لديك صلاحية لإضافة التوقيعات', 'error');
        return;
    }
    
    const modal = document.getElementById('signatureModal');
    if (modal) {
        modal.style.display = 'block';
    initializeSignatureCanvas();
        
        // Clear canvas
        if (signatureCtx && signatureCanvas) {
            signatureCtx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
        }
    }
}

function editSignature() {
    console.log('Editing signature...');
    
    if (!currentUser) {
        showMessage('يجب تسجيل الدخول أولاً', 'error');
        return;
    }
    
    if (!hasPermission('signatures', 'update')) {
        showMessage('ليس لديك صلاحية لتعديل التوقيعات', 'error');
        return;
    }
    
    addSignature(); // Same as add for now
}

function deleteSignature() {
    console.log('Deleting signature...');
    
    if (!currentUser) {
        showMessage('يجب تسجيل الدخول أولاً', 'error');
        return;
    }
    
    if (!hasPermission('signatures', 'delete')) {
        showMessage('ليس لديك صلاحية لحذف التوقيعات', 'error');
        return;
    }
    
    if (signatures.length > 1) {
        if (confirm('هل أنت متأكد من حذف التوقيع؟')) {
            signatures.pop();
            localStorage.setItem('signatures', JSON.stringify(signatures));
            loadSignatures();
            showMessage('تم حذف التوقيع بنجاح', 'success');
        }
    } else {
        showMessage('لا يمكن حذف التوقيع الوحيد', 'error');
    }
}

function unifySignature() {
    console.log('Unifying signature...');
    
    if (!currentUser) {
        showMessage('يجب تسجيل الدخول أولاً', 'error');
        return;
    }
    
    if (!hasPermission('signatures', 'unify')) {
        showMessage('ليس لديك صلاحية لتوحيد التوقيعات', 'error');
        return;
    }
    
    if (signatures.length > 1) {
        // Keep only the latest signature
        const latestSignature = signatures[signatures.length - 1];
        signatures = [latestSignature];
        localStorage.setItem('signatures', JSON.stringify(signatures));
        loadSignatures();
    showMessage('تم توحيد التوقيع بنجاح', 'success');
    } else {
        showMessage('التوقيع موحد بالفعل', 'success');
    }
}

function closeSignatureModal() {
    const modal = document.getElementById('signatureModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function clearSignature() {
    if (signatureCtx && signatureCanvas) {
        signatureCtx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
    }
}

function saveSignature() {
    console.log('Saving signature...');
    
    if (!currentUser) {
        showMessage('يجب تسجيل الدخول أولاً', 'error');
        return;
    }
    
    if (!hasPermission('signatures', 'create')) {
        showMessage('ليس لديك صلاحية لحفظ التوقيعات', 'error');
        return;
    }
    
    if (signatureCanvas) {
        const dataURL = signatureCanvas.toDataURL();
        
        // Check if canvas is empty
        const blankCanvas = document.createElement('canvas');
        blankCanvas.width = signatureCanvas.width;
        blankCanvas.height = signatureCanvas.height;
        
        if (dataURL === blankCanvas.toDataURL()) {
            showMessage('يرجى رسم التوقيع أولاً', 'error');
            return;
        }
        
        const signature = {
            id: Date.now(),
            name: 'توقيع جديد',
            data: dataURL,
            isDefault: false,
            createdAt: new Date().toISOString()
        };
        
        signatures.push(signature);
        localStorage.setItem('signatures', JSON.stringify(signatures));
        loadSignatures();
        closeSignatureModal();
        showMessage('تم حفظ التوقيع بنجاح', 'success');
    }
}

function loadSignatures() {
    console.log('Loading signatures...');
    
    if (!currentUser) {
        return;
    }
    
    if (!hasPermission('signatures', 'read')) {
        return;
    }
    
    const signaturePreview = document.getElementById('signaturePreview');
    if (!signaturePreview) {
        return;
    }
    
    // Reload signatures from localStorage
    signatures = JSON.parse(localStorage.getItem('signatures')) || [];
    
    if (signatures.length > 0) {
        const latestSignature = signatures[signatures.length - 1];
        if (latestSignature.data) {
            signaturePreview.innerHTML = `
                <img src="${latestSignature.data}" alt="التوقيع" style="max-width: 100%; max-height: 150px; border: 1px solid #ccc; border-radius: 4px;">
                <p style="margin-top: 1rem; color: #666; font-size: 0.9rem;">تم الحفظ: ${new Date(latestSignature.createdAt).toLocaleDateString('ar-SA')}</p>
            `;
        } else {
            signaturePreview.innerHTML = '<p style="text-align: center; color: #666;">لا يوجد توقيع محفوظ</p>';
        }
    } else {
        signaturePreview.innerHTML = '<p style="text-align: center; color: #666;">لا يوجد توقيع محفوظ</p>';
    }
    
    console.log('Signatures loaded:', signatures.length);
}

// Signature Canvas Events
function startDrawing(e) {
    isDrawing = true;
    const rect = signatureCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    signatureCtx.beginPath();
    signatureCtx.moveTo(x, y);
}

function draw(e) {
    if (!isDrawing) return;
    const rect = signatureCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    signatureCtx.lineTo(x, y);
    signatureCtx.stroke();
}

function stopDrawing() {
    isDrawing = false;
}

function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 
                                     e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    signatureCanvas.dispatchEvent(mouseEvent);
}

// User Management Functions
function loadUsers() {
    console.log('Loading users...');
    
    if (!currentUser) {
        return;
    }
    
    if (!hasPermission('users', 'read')) {
        return;
    }
    
    // Reload users from localStorage
    loadUsersFromStorage();
    
    const usersList = document.getElementById('usersList');
    if (!usersList) {
        return;
    }
    
    usersList.innerHTML = '';
    
    if (users.length === 0) {
        usersList.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">لا توجد مستخدمين</p>';
        return;
    }
    
    // Sort users: admins first
    const sortedUsers = [...users].sort((a, b) => {
        if (a.role === 'admin' && b.role !== 'admin') return -1;
        if (a.role !== 'admin' && b.role === 'admin') return 1;
        return 0;
    });
    
    sortedUsers.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        
        const hasCustomPermissions = user.permissions && Object.keys(user.permissions).length > 0;
        const roleText = user.role === 'admin' ? 'مدير النظام' : 
                        hasCustomPermissions ? 'مستخدم مخصص' : 'مستخدم عادي';
        
        // Build actions based on permissions
        let actionsHTML = '';
        
        if (hasPermission('users', 'update')) {
            actionsHTML += `<button class="btn btn-info" onclick="manageUserPermissions(${user.id})">
                <i class="fas fa-key"></i> صلاحيات
            </button>`;
        }
        
        if (hasPermission('users', 'delete')) {
            actionsHTML += `<button class="btn btn-danger" onclick="deleteUser(${user.id})" ${user.id === currentUser.id ? 'disabled' : ''}>
                <i class="fas fa-trash"></i> حذف
            </button>`;
        }
        
        userCard.innerHTML = `
            <div class="user-header">
                <div class="user-name">${user.fullName}</div>
                <div class="user-role ${hasCustomPermissions ? 'custom-role' : ''}">${roleText}</div>
            </div>
            <div class="user-info" style="margin-bottom: 1rem; font-size: 0.9rem; color: #666;">
                <div>اسم المستخدم: ${user.username}</div>
                <div>تاريخ الإنشاء: ${new Date(user.createdAt).toLocaleDateString('ar-SA')}</div>
            </div>
            <div class="user-actions">
                ${actionsHTML}
            </div>
        `;
        usersList.appendChild(userCard);
    });
    
    console.log('Users loaded:', users.length);
}

function addUser() {
    console.log('Adding user...');
    
    if (!currentUser) {
        showMessage('يجب تسجيل الدخول أولاً', 'error');
        return;
    }
    
    if (!hasPermission('users', 'create')) {
        showMessage('ليس لديك صلاحية لإضافة المستخدمين', 'error');
        return;
    }
    
    document.getElementById('userModalTitle').textContent = 'إضافة مستخدم جديد';
    document.getElementById('userForm').reset();
    document.getElementById('userModal').style.display = 'block';
}

function deleteUser(id) {
    console.log('Deleting user:', id);
    
    if (!currentUser) {
        showMessage('يجب تسجيل الدخول أولاً', 'error');
        return;
    }
    
    if (!hasPermission('users', 'delete')) {
        showMessage('ليس لديك صلاحية لحذف المستخدمين', 'error');
        return;
    }
    
    if (id === currentUser.id) {
        showMessage('لا يمكن حذف المستخدم الحالي', 'error');
        return;
    }
    
    if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
        users = users.filter(u => u.id !== id);
        localStorage.setItem('users', JSON.stringify(users));
        loadUsers();
        showMessage('تم حذف المستخدم بنجاح', 'success');
    }
}

function closeUserModal() {
    const modal = document.getElementById('userModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function saveUser() {
    console.log('Saving user...');
    
    if (!currentUser) {
        showMessage('يجب تسجيل الدخول أولاً', 'error');
        return;
    }
    
    if (!hasPermission('users', 'create')) {
        showMessage('ليس لديك صلاحية لإنشاء المستخدمين', 'error');
        return;
    }
    
    const fullName = document.getElementById('userFullName').value.trim();
    const username = document.getElementById('userUsername').value.trim();
    const password = document.getElementById('userPassword').value.trim();
    const role = document.getElementById('userRole').value;
    
    if (!fullName || !username || !password || !role) {
        showMessage('يرجى ملء جميع الحقول المطلوبة', 'error');
        return;
    }
    
    // Check if username already exists
    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        showMessage('اسم المستخدم موجود بالفعل', 'error');
        return;
    }
    
    const user = {
        id: Date.now(),
        fullName,
        username,
        password,
        role,
        permissions: permissions[role] || permissions['user'],
        isActive: true,
        createdAt: new Date().toISOString()
    };
    
    // Add user to array
    users.push(user);
    
    // Save to localStorage
    try {
        localStorage.setItem('users', JSON.stringify(users));
        console.log('User saved:', user);
        
        closeUserModal();
        loadUsers();
        showMessage('تم إنشاء المستخدم بنجاح', 'success');
    } catch (error) {
        console.error('Error saving user:', error);
        showMessage('خطأ في حفظ المستخدم: ' + error.message, 'error');
    }
}

function manageUserPermissions(userId) {
    console.log('Managing permissions for user:', userId);
    
    if (!currentUser) {
        showMessage('يجب تسجيل الدخول أولاً', 'error');
        return;
    }
    
    if (!hasPermission('users', 'update')) {
        showMessage('ليس لديك صلاحية لتعديل الصلاحيات', 'error');
        return;
    }
    
    const user = users.find(u => u.id === userId);
    if (!user) {
        showMessage('المستخدم غير موجود', 'error');
        return;
    }
    
    // Ensure user has permissions object
    if (!user.permissions) {
        user.permissions = permissions[user.role] || permissions['user'];
    }
    
    // Create permissions modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'permissionsModal';
    modal.style.display = 'block';
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>إدارة صلاحيات المستخدم: ${user.fullName}</h2>
                <button class="close-btn" onclick="closePermissionsModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="permissions-grid">
                    <div class="permission-section">
                        <h3>النماذج</h3>
                        <label><input type="checkbox" id="forms_create" ${user.permissions?.forms?.includes('create') ? 'checked' : ''}> إنشاء</label>
                        <label><input type="checkbox" id="forms_read" ${user.permissions?.forms?.includes('read') ? 'checked' : ''}> قراءة</label>
                        <label><input type="checkbox" id="forms_update" ${user.permissions?.forms?.includes('update') ? 'checked' : ''}> تعديل</label>
                        <label><input type="checkbox" id="forms_delete" ${user.permissions?.forms?.includes('delete') ? 'checked' : ''}> حذف</label>
                        <label><input type="checkbox" id="forms_print" ${user.permissions?.forms?.includes('print') ? 'checked' : ''}> طباعة</label>
                    </div>
                    
                    <div class="permission-section">
                        <h3>المستندات</h3>
                        <label><input type="checkbox" id="documents_create" ${user.permissions?.documents?.includes('create') ? 'checked' : ''}> إنشاء</label>
                        <label><input type="checkbox" id="documents_read" ${user.permissions?.documents?.includes('read') ? 'checked' : ''}> قراءة</label>
                        <label><input type="checkbox" id="documents_update" ${user.permissions?.documents?.includes('update') ? 'checked' : ''}> تعديل</label>
                        <label><input type="checkbox" id="documents_delete" ${user.permissions?.documents?.includes('delete') ? 'checked' : ''}> حذف</label>
                        <label><input type="checkbox" id="documents_print" ${user.permissions?.documents?.includes('print') ? 'checked' : ''}> طباعة</label>
                        <label><input type="checkbox" id="documents_download" ${user.permissions?.documents?.includes('download') ? 'checked' : ''}> تحميل</label>
                    </div>
                    
                    <div class="permission-section">
                        <h3>التوقيعات</h3>
                        <label><input type="checkbox" id="signatures_create" ${user.permissions?.signatures?.includes('create') ? 'checked' : ''}> إنشاء</label>
                        <label><input type="checkbox" id="signatures_read" ${user.permissions?.signatures?.includes('read') ? 'checked' : ''}> قراءة</label>
                        <label><input type="checkbox" id="signatures_update" ${user.permissions?.signatures?.includes('update') ? 'checked' : ''}> تعديل</label>
                        <label><input type="checkbox" id="signatures_delete" ${user.permissions?.signatures?.includes('delete') ? 'checked' : ''}> حذف</label>
                        <label><input type="checkbox" id="signatures_unify" ${user.permissions?.signatures?.includes('unify') ? 'checked' : ''}> توحيد</label>
                    </div>
                    
                    <div class="permission-section">
                        <h3>المستخدمين</h3>
                        <label><input type="checkbox" id="users_create" ${user.permissions?.users?.includes('create') ? 'checked' : ''}> إنشاء</label>
                        <label><input type="checkbox" id="users_read" ${user.permissions?.users?.includes('read') ? 'checked' : ''}> قراءة</label>
                        <label><input type="checkbox" id="users_update" ${user.permissions?.users?.includes('update') ? 'checked' : ''}> تعديل</label>
                        <label><input type="checkbox" id="users_delete" ${user.permissions?.users?.includes('delete') ? 'checked' : ''}> حذف</label>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closePermissionsModal()">إلغاء</button>
                <button class="btn btn-primary" onclick="saveUserPermissions(${userId})">حفظ الصلاحيات</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closePermissionsModal() {
    const modal = document.getElementById('permissionsModal');
    if (modal) {
        modal.remove();
    }
}

function saveUserPermissions(userId) {
    console.log('Saving permissions for user:', userId);
    
    const user = users.find(u => u.id === userId);
    if (!user) {
        showMessage('المستخدم غير موجود', 'error');
        return;
    }
    
    // Get all permissions
    const newPermissions = {
        forms: [],
        documents: [],
        signatures: [],
        users: [],
        system: []
    };
    
    // Forms permissions
    if (document.getElementById('forms_create')?.checked) newPermissions.forms.push('create');
    if (document.getElementById('forms_read')?.checked) newPermissions.forms.push('read');
    if (document.getElementById('forms_update')?.checked) newPermissions.forms.push('update');
    if (document.getElementById('forms_delete')?.checked) newPermissions.forms.push('delete');
    if (document.getElementById('forms_print')?.checked) newPermissions.forms.push('print');
    
    // Documents permissions
    if (document.getElementById('documents_create')?.checked) newPermissions.documents.push('create');
    if (document.getElementById('documents_read')?.checked) newPermissions.documents.push('read');
    if (document.getElementById('documents_update')?.checked) newPermissions.documents.push('update');
    if (document.getElementById('documents_delete')?.checked) newPermissions.documents.push('delete');
    if (document.getElementById('documents_print')?.checked) newPermissions.documents.push('print');
    if (document.getElementById('documents_download')?.checked) newPermissions.documents.push('download');
    
    // Signatures permissions
    if (document.getElementById('signatures_create')?.checked) newPermissions.signatures.push('create');
    if (document.getElementById('signatures_read')?.checked) newPermissions.signatures.push('read');
    if (document.getElementById('signatures_update')?.checked) newPermissions.signatures.push('update');
    if (document.getElementById('signatures_delete')?.checked) newPermissions.signatures.push('delete');
    if (document.getElementById('signatures_unify')?.checked) newPermissions.signatures.push('unify');
    
    // Users permissions
    if (document.getElementById('users_create')?.checked) newPermissions.users.push('create');
    if (document.getElementById('users_read')?.checked) newPermissions.users.push('read');
    if (document.getElementById('users_update')?.checked) newPermissions.users.push('update');
    if (document.getElementById('users_delete')?.checked) newPermissions.users.push('delete');
    
    // Update user permissions
    user.permissions = newPermissions;
    localStorage.setItem('users', JSON.stringify(users));
    
    // Update current user if modifying own permissions
    if (userId === currentUser.id) {
        currentUser.permissions = newPermissions;
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    
    closePermissionsModal();
    loadUsers();
    showMessage('تم حفظ صلاحيات المستخدم بنجاح', 'success');
}

// Permission Functions
function hasPermission(module, action) {
    if (!currentUser) {
        console.log('No current user');
        return false;
    }
    
    // Admin has all permissions
    if (currentUser.role === 'admin') {
        return true;
    }
    
    // Check if user has custom permissions
    if (currentUser.permissions && currentUser.permissions[module]) {
        return currentUser.permissions[module].includes(action);
    }
    
    // Fallback to role-based permissions
    const userPermissions = permissions[currentUser.role];
    if (!userPermissions || !userPermissions[module]) {
        return false;
    }
    return userPermissions[module].includes(action);
}

function checkPermission(module, action) {
    if (!hasPermission(module, action)) {
        showMessage('ليس لديك صلاحية للقيام بهذا الإجراء', 'error');
        return false;
    }
    return true;
}

function updateUIForPermissions() {
    if (!currentUser) return;
    
    // Update navigation based on permissions
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        const onclick = btn.getAttribute('onclick');
        if (onclick) {
            if (onclick.includes('users') && !hasPermission('users', 'read')) {
            btn.style.display = 'none';
        }
            if (onclick.includes('signatures') && !hasPermission('signatures', 'read')) {
            btn.style.display = 'none';
        }
            if (onclick.includes('documents') && !hasPermission('documents', 'read')) {
            btn.style.display = 'none';
        }
        }
    });
}

// Hijri Date Functions
function getHijriDate() {
    const today = new Date();
    const hijriDate = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    }).format(today);
    
    return hijriDate;
}

function addHijriDateToForm() {
    const hijriDate = getHijriDate();
    const dateElement = document.createElement('div');
    dateElement.className = 'hijri-date';
    dateElement.innerHTML = `
        <div style="background: #f8f9fa; padding: 1rem; border: 1px solid #e0e0e0; border-radius: 8px; margin-bottom: 1rem; text-align: center;">
            <strong>التاريخ الهجري:</strong> ${hijriDate}
        </div>
    `;
    
    const formContent = document.getElementById('formContent');
    if (formContent && formContent.firstChild) {
        formContent.insertBefore(dateElement, formContent.firstChild);
    }
}

// Utility Functions
function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type} show`;
    messageDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease-out;
        max-width: 400px;
        ${type === 'success' ? 'background: #28a745;' : 'background: #dc3545;'}
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    if (!document.querySelector('style[data-message-animation]')) {
        style.setAttribute('data-message-animation', 'true');
    document.head.appendChild(style);
    }
    
    // Insert message
    document.body.appendChild(messageDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
}

// Close modals when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}
