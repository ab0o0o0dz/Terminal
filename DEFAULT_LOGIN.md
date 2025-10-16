# بيانات الدخول الافتراضية للنظام

## 🔐 بيانات الدخول الافتراضية

### بعد إعداد Firebase:

#### المستخدم الإداري الأول:
- **اسم المستخدم**: `admin`
- **كلمة المرور**: `admin123456`
- **البريد الإلكتروني**: `admin@example.com`

#### أو يمكنك إنشاء مستخدم جديد:
1. اذهب إلى `register.html`
2. أنشئ حساب جديد
3. سجل دخول بالبيانات الجديدة

## 🚀 إعداد سريع للاختبار

### 1. إنشاء مستخدم إداري في Firebase Console:
1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. اختر مشروعك
3. اذهب إلى Authentication > Users
4. انقر "إضافة مستخدم"
5. أدخل:
   - **البريد الإلكتروني**: `admin@example.com`
   - **كلمة المرور**: `admin123456`
6. انقر "إضافة مستخدم"

### 2. إضافة بيانات المستخدم في قاعدة البيانات:
1. اذهب إلى Realtime Database
2. أضف البيانات التالية:

```json
{
  "users": {
    "USER_UID_FROM_AUTH": {
      "fullName": "مدير النظام",
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin",
      "permissions": {
        "forms": ["create", "read", "update", "delete", "print"],
        "documents": ["create", "read", "update", "delete", "print", "download"],
        "signatures": ["create", "read", "update", "delete", "unify"],
        "users": ["create", "read", "update", "delete"],
        "system": ["monitor", "logs", "settings"]
      },
      "isActive": true,
      "createdAt": 1703123456789
    }
  }
}
```

## 📱 اختبار النظام

### على الكمبيوتر:
1. افتح `http://localhost:8000`
2. سيتم توجيهك لصفحة تسجيل الدخول
3. أدخل بيانات الدخول

### على الجوال:
1. تأكد من أن الخادم يعمل على الشبكة المحلية
2. افتح المتصفح على الجوال
3. اذهب إلى `http://YOUR_IP:8000`
4. اختبر النظام

## 🔧 استكشاف الأخطاء

### إذا لم يعمل تسجيل الدخول:
1. تأكد من إعداد Firebase بشكل صحيح
2. تحقق من تفعيل Authentication
3. تأكد من إضافة بيانات المستخدم في قاعدة البيانات
4. راجع Console في المتصفح للأخطاء

### رسائل الخطأ الشائعة:
- `auth/user-not-found`: المستخدم غير موجود
- `auth/wrong-password`: كلمة المرور خاطئة
- `auth/invalid-email`: البريد الإلكتروني غير صحيح
