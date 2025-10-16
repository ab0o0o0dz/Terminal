# حل المشاكل الشائعة - Troubleshooting Guide

## 🚨 مشاكل تسجيل الدخول

### 1. خطأ "اسم المستخدم غير موجود"

#### السبب:
- اسم المستخدم غير مسجل في قاعدة البيانات
- خطأ في إعداد Firebase
- مشكلة في الاتصال بقاعدة البيانات

#### الحل:
```javascript
// تحقق من إعدادات Firebase
console.log('Firebase config:', firebaseConfig);

// تحقق من قاعدة البيانات
database.ref('users').once('value').then(snapshot => {
    const users = snapshot.val();
    console.log('Users in database:', users);
});
```

### 2. خطأ "كلمة المرور غير صحيحة"

#### السبب:
- كلمة المرور خاطئة
- مشكلة في تشفير كلمة المرور
- خطأ في Firebase Authentication

#### الحل:
```javascript
// تحقق من صحة كلمة المرور
if (password.length < 6) {
    showError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
    return;
}
```

### 3. خطأ "حدث خطأ أثناء تسجيل الدخول"

#### السبب:
- مشكلة في الاتصال بالإنترنت
- خطأ في إعدادات Firebase
- مشكلة في قاعدة البيانات

#### الحل:
```javascript
// تحقق من الاتصال
if (!navigator.onLine) {
    showError('لا يوجد اتصال بالإنترنت');
    return;
}

// تحقق من إعدادات Firebase
if (!firebase.apps.length) {
    showError('خطأ في إعداد Firebase');
    return;
}
```

## 🔧 مشاكل النظام

### 1. خطأ في تحميل الصفحة

#### السبب:
- Firebase غير محمل بشكل صحيح
- خطأ في JavaScript
- مشكلة في الملفات

#### الحل:
```javascript
// تحقق من تحميل Firebase
if (typeof firebase === 'undefined') {
    console.error('Firebase is not loaded');
    // إعادة تحميل الصفحة
    window.location.reload();
}
```

### 2. خطأ في قاعدة البيانات

#### السبب:
- قواعد قاعدة البيانات خاطئة
- صلاحيات غير صحيحة
- مشكلة في الاتصال

#### الحل:
```json
// قواعد قاعدة البيانات الصحيحة
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null && (auth.uid == $uid || root.child('users').child(auth.uid).child('role').val() == 'admin')",
        ".write": "auth != null && auth.uid == $uid"
      }
    }
  }
}
```

### 3. خطأ في الصلاحيات

#### السبب:
- المستخدم ليس لديه صلاحيات كافية
- خطأ في إعداد الصلاحيات
- مشكلة في قاعدة البيانات

#### الحل:
```javascript
// تحقق من صلاحيات المستخدم
function checkPermission(module, action) {
    if (!currentUser) return false;
    
    if (currentUser.permissions && currentUser.permissions[module]) {
        return currentUser.permissions[module].includes(action);
    }
    
    return false;
}
```

## 📱 مشاكل الجوال

### 1. التوقيع الإلكتروني لا يعمل

#### السبب:
- عدم دعم اللمس
- مشكلة في Canvas
- خطأ في JavaScript

#### الحل:
```javascript
// إضافة دعم اللمس
canvas.addEventListener('touchstart', handleTouch);
canvas.addEventListener('touchmove', handleTouch);
canvas.addEventListener('touchend', stopDrawing);

function handleTouch(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 
                                     e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
}
```

### 2. النماذج لا تظهر بشكل صحيح

#### السبب:
- مشكلة في CSS
- خطأ في JavaScript
- مشكلة في التخطيط

#### الحل:
```css
/* تحسين التخطيط للجوال */
@media (max-width: 768px) {
    .form-group input,
    .form-group select {
        padding: 0.8rem;
        font-size: 0.9rem;
    }
    
    .btn {
        padding: 0.8rem 1rem;
        font-size: 0.9rem;
    }
}
```

## 🔍 تشخيص المشاكل

### 1. فحص Console في المتصفح

```javascript
// فتح Console (F12)
// البحث عن الأخطاء الحمراء
// نسخ رسائل الخطأ
```

### 2. فحص Network Tab

```javascript
// فتح Network Tab
// البحث عن طلبات فاشلة
// فحص حالة HTTP (200, 404, 500)
```

### 3. فحص Firebase Console

```javascript
// اذهب إلى Firebase Console
// تحقق من Authentication
// تحقق من Realtime Database
// فحص القواعد
```

## 🛠️ حلول سريعة

### 1. إعادة تعيين النظام

```javascript
// مسح جميع البيانات المحلية
localStorage.clear();
sessionStorage.clear();

// إعادة تحميل الصفحة
window.location.reload();
```

### 2. فحص الاتصال

```javascript
// تحقق من الاتصال بالإنترنت
if (!navigator.onLine) {
    showError('لا يوجد اتصال بالإنترنت');
    return;
}

// تحقق من Firebase
if (!firebase.apps.length) {
    showError('خطأ في إعداد Firebase');
    return;
}
```

### 3. إعادة تعيين كلمة المرور

```javascript
// في صفحة تسجيل الدخول
// انقر على "نسيت كلمة المرور؟"
// أدخل اسم المستخدم
// تحقق من البريد الإلكتروني
```

## 📊 مراقبة الأخطاء

### 1. تسجيل الأخطاء

```javascript
// تسجيل الأخطاء في قاعدة البيانات
function logError(error, context = '') {
    try {
        database.ref('errors').push({
            error: error.message,
            context: context,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            userAgent: navigator.userAgent,
            url: window.location.href
        });
    } catch (e) {
        console.error('Error logging failed:', e);
    }
}
```

### 2. مراقبة الأداء

```javascript
// قياس وقت التحميل
const startTime = performance.now();
window.addEventListener('load', () => {
    const loadTime = performance.now() - startTime;
    console.log(`Page loaded in ${loadTime}ms`);
});
```

## 🚀 نصائح للوقاية

### 1. نسخ احتياطية منتظمة

```javascript
// نسخ احتياطية يومية
function createBackup() {
    const backup = {
        users: localStorage.getItem('users'),
        documents: localStorage.getItem('documents'),
        signatures: localStorage.getItem('signatures'),
        timestamp: new Date().toISOString()
    };
    
    // حفظ النسخة الاحتياطية
    localStorage.setItem('backup_' + Date.now(), JSON.stringify(backup));
}
```

### 2. مراقبة الأمان

```javascript
// فحص محاولات الدخول المشبوهة
function checkSuspiciousActivity() {
    const failedAttempts = localStorage.getItem('failedAttempts') || 0;
    if (failedAttempts > 5) {
        showError('تم تجاوز عدد المحاولات المسموح');
        return false;
    }
    return true;
}
```

### 3. تحديث النظام

```javascript
// فحص التحديثات
function checkForUpdates() {
    const currentVersion = '1.0.0';
    const storedVersion = localStorage.getItem('appVersion');
    
    if (storedVersion !== currentVersion) {
        showMessage('يوجد تحديث جديد متاح', 'info');
        localStorage.setItem('appVersion', currentVersion);
    }
}
```

---

## 🎯 الخلاصة

### المشاكل الشائعة:
1. **خطأ في تسجيل الدخول** - تحقق من إعدادات Firebase
2. **مشاكل الجوال** - تحقق من CSS والJavaScript
3. **أخطاء قاعدة البيانات** - راجع القواعد والصلاحيات

### الحلول:
1. **فحص Console** للأخطاء
2. **إعادة تعيين النظام** عند الحاجة
3. **مراقبة الأداء** والأمان

النظام محمي من الأخطاء الشائعة! 🛡️
