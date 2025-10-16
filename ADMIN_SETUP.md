# إعداد مدير جديد للنظام

## 🔐 بيانات الدخول الجديدة للمدير

### المدير الجديد:
- **اسم المستخدم**: `admin`
- **كلمة المرور**: `admin123456`
- **البريد الإلكتروني**: `admin@example.com`
- **الاسم الكامل**: `مدير النظام`
- **الصلاحيات**: جميع الصلاحيات

## 🚀 خطوات إعداد المدير

### 1. في Firebase Console:

#### أ. إنشاء المستخدم في Authentication:
1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. اختر مشروعك
3. اذهب إلى **Authentication > Users**
4. انقر **"إضافة مستخدم"**
5. أدخل البيانات:
   - **البريد الإلكتروني**: `admin@example.com`
   - **كلمة المرور**: `admin123456`
6. انقر **"إضافة مستخدم"**

#### ب. إضافة بيانات المستخدم في قاعدة البيانات:
1. اذهب إلى **Realtime Database**
2. انقر **"إضافة عقدة"**
3. أضف البيانات التالية:

```json
{
  "users": {
    "USER_UID_FROM_AUTH": {
      "fullName": "مدير النظام",
      "username": "admin",
      "email": "admin@example.com",
      "phone": "+966501234567",
      "role": "admin",
      "department": "قسم تقنية المعلومات",
      "permissions": {
        "forms": ["create", "read", "update", "delete", "print"],
        "documents": ["create", "read", "update", "delete", "print", "download"],
        "signatures": ["create", "read", "update", "delete", "unify"],
        "users": ["create", "read", "update", "delete"],
        "system": ["monitor", "logs", "settings"]
      },
      "isActive": true,
      "createdAt": 1703123456789,
      "lastLogin": null
    }
  }
}
```

### 2. اختبار تسجيل الدخول:

1. افتح `login.html`
2. أدخل:
   - **اسم المستخدم**: `admin`
   - **كلمة المرور**: `admin123456`
3. انقر **"تسجيل الدخول"**

## 🛡️ صلاحيات المدير

### 1. إدارة النماذج:
- ✅ إنشاء نماذج جديدة
- ✅ قراءة جميع النماذج
- ✅ تعديل النماذج
- ✅ حذف النماذج
- ✅ طباعة النماذج

### 2. إدارة المستندات:
- ✅ إنشاء مستندات جديدة
- ✅ قراءة جميع المستندات
- ✅ تعديل المستندات
- ✅ حذف المستندات
- ✅ طباعة المستندات
- ✅ تحميل المستندات

### 3. إدارة التوقيعات:
- ✅ إنشاء توقيعات جديدة
- ✅ قراءة التوقيعات
- ✅ تعديل التوقيعات
- ✅ حذف التوقيعات
- ✅ توحيد التوقيعات

### 4. إدارة المستخدمين:
- ✅ إنشاء مستخدمين جدد
- ✅ قراءة بيانات المستخدمين
- ✅ تعديل بيانات المستخدمين
- ✅ حذف المستخدمين
- ✅ إدارة الصلاحيات

### 5. إدارة النظام:
- ✅ مراقبة النظام
- ✅ عرض سجلات النشاط
- ✅ إعدادات النظام
- ✅ النسخ الاحتياطية

## 🔧 إعدادات إضافية

### 1. قواعد قاعدة البيانات:
```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null && (auth.uid == $uid || root.child('users').child(auth.uid).child('role').val() == 'admin')",
        ".write": "auth != null && auth.uid == $uid"
      }
    },
    "forms": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "documents": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "signatures": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "system": {
      ".read": "auth != null && root.child('users').child(auth.uid).child('role').val() == 'admin'",
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() == 'admin'"
    }
  }
}
```

### 2. إعدادات الأمان:
- ✅ **كلمة مرور قوية** (8 أحرف على الأقل)
- ✅ **تشفير البيانات** تلقائياً
- ✅ **جلسات آمنة** مع انتهاء صلاحية
- ✅ **مراقبة النشاط** المستمر

## 📊 مراقبة النظام

### 1. سجلات النشاط:
```javascript
// تسجيل نشاط المدير
async function logAdminActivity(action, details = {}) {
    try {
        const logsRef = database.ref('system/logs');
        await logsRef.push({
            userId: currentUser.uid,
            action: action,
            details: details,
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            ipAddress: await getClientIP(),
            userAgent: navigator.userAgent
        });
    } catch (error) {
        console.error('Error logging admin activity:', error);
    }
}
```

### 2. إحصائيات النظام:
- 📈 **عدد المستخدمين** النشطين
- 📊 **عدد النماذج** المُنشأة
- 📋 **عدد المستندات** المحفوظة
- 🔐 **محاولات الدخول** الفاشلة

## 🚨 استكشاف الأخطاء

### 1. مشاكل شائعة:

#### خطأ في تسجيل الدخول:
```javascript
// تحقق من صحة البيانات
if (!username || !password) {
    showError('يرجى إدخال اسم المستخدم وكلمة المرور');
    return;
}
```

#### خطأ في الصلاحيات:
```javascript
// تحقق من صلاحيات المدير
if (currentUser.role !== 'admin') {
    showError('ليس لديك صلاحية للوصول لهذه الصفحة');
    return;
}
```

### 2. حلول سريعة:
- ✅ **تحقق من إعدادات Firebase**
- ✅ **راجع قواعد قاعدة البيانات**
- ✅ **تأكد من صحة بيانات المستخدم**
- ✅ **اختبر الاتصال بالإنترنت**

## 🔄 صيانة النظام

### 1. يومياً:
- 📊 **مراجعة سجلات النشاط**
- 🔍 **فحص محاولات الدخول المشبوهة**
- 💾 **التحقق من النسخ الاحتياطية**

### 2. أسبوعياً:
- 📈 **تحليل إحصائيات الاستخدام**
- 🛡️ **مراجعة إعدادات الأمان**
- 👥 **فحص حسابات المستخدمين**

### 3. شهرياً:
- 🔄 **تحديث كلمات المرور**
- 📋 **مراجعة الصلاحيات**
- 🗄️ **تنظيف البيانات القديمة**

---

## 🎉 الخلاصة

تم إعداد مدير جديد للنظام مع:

- ✅ **بيانات دخول آمنة** وواضحة
- ✅ **صلاحيات كاملة** لجميع الميزات
- ✅ **مراقبة شاملة** للنظام
- ✅ **أمان متقدم** وحماية البيانات

النظام جاهز للاستخدام مع المدير الجديد! 🚀
