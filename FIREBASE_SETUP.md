# إعداد Firebase Authentication - دليل سريع

## 🚀 الخطوات السريعة

### 1. إنشاء مشروع Firebase
1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. انقر "إضافة مشروع"
3. أدخل اسم المشروع: `forms-management-system`
4. فعّل Google Analytics (اختياري)
5. انقر "إنشاء مشروع"

### 2. إضافة تطبيق ويب
1. انقر على أيقونة الويب `</>`
2. أدخل اسم التطبيق: `Forms Management Web`
3. انقر "تسجيل التطبيق"
4. انسخ إعدادات Firebase

### 3. تفعيل Authentication
1. في القائمة الجانبية: Authentication
2. انقر "بدء"
3. تبويب "Sign-in method"
4. فعّل "البريد الإلكتروني/كلمة المرور"
5. انقر "حفظ"

### 4. إعداد Realtime Database
1. في القائمة الجانبية: Realtime Database
2. انقر "إنشاء قاعدة بيانات"
3. اختر "بدء في وضع الاختبار"
4. اختر موقع الخادم (الأقرب للسعودية)
5. انقر "تم"

### 5. تحديث الإعدادات

#### في `login.html` و `register.html`:
```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

#### في `script.js`:
```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### 6. إعداد قواعد قاعدة البيانات

في Firebase Console > Realtime Database > Rules:

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid == $uid",
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
    }
  }
}
```

### 7. إضافة مستخدم إداري

#### في Firebase Console > Authentication > Users:
1. انقر "إضافة مستخدم"
2. أدخل البريد الإلكتروني وكلمة المرور
3. انقر "إضافة مستخدم"

#### في Firebase Console > Realtime Database:
أضف بيانات المستخدم:

```json
{
  "users": {
    "USER_UID_HERE": {
      "fullName": "مدير النظام",
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

## 🔧 اختبار النظام

1. افتح `login.html`
2. سجل دخول بالمستخدم الإداري
3. تأكد من عمل جميع الوظائف
4. جرب إنشاء مستخدم جديد من `register.html`

## 📁 الملفات المطلوبة

- `login.html` - صفحة تسجيل الدخول
- `register.html` - صفحة إنشاء حساب جديد
- `index.html` - الصفحة الرئيسية (محدثة)
- `script.js` - الملف الرئيسي (محدث)
- `styles.css` - ملف التنسيق (محدث)
- `firebase-config.js` - إعدادات Firebase
- `firebase-database-example.js` - مثال قاعدة البيانات

## ⚠️ ملاحظات مهمة

1. **استبدل إعدادات Firebase** في جميع الملفات
2. **فعّل Authentication** قبل الاختبار
3. **أضف مستخدم إداري** أولاً
4. **اختبر النظام** قبل النشر
5. **احفظ نسخة احتياطية** من الإعدادات

## 🆘 استكشاف الأخطاء

### مشاكل شائعة:
- **خطأ في الاتصال**: تأكد من صحة إعدادات Firebase
- **خطأ في الصلاحيات**: راجع قواعد قاعدة البيانات
- **خطأ في تسجيل الدخول**: تأكد من تفعيل Email/Password

### رسائل الخطأ:
- `auth/user-not-found`: المستخدم غير موجود
- `auth/wrong-password`: كلمة المرور خاطئة
- `auth/email-already-in-use`: البريد الإلكتروني مستخدم

## 📞 الدعم

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase)
