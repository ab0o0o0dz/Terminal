# دليل إعداد Firebase Authentication

## الخطوة 1: إنشاء مشروع Firebase

1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. انقر على "إضافة مشروع" (Add Project)
3. أدخل اسم المشروع (مثل: forms-management-system)
4. اختر "تمكين Google Analytics" إذا كنت تريد ذلك
5. انقر على "إنشاء مشروع"

## الخطوة 2: إضافة تطبيق ويب

1. في لوحة التحكم، انقر على أيقونة الويب `</>`
2. أدخل اسم التطبيق (مثل: Forms Management Web App)
3. انقر على "تسجيل التطبيق"
4. انسخ إعدادات Firebase (سيتم استخدامها لاحقاً)

## الخطوة 3: تفعيل Authentication

1. في القائمة الجانبية، انقر على "Authentication"
2. انقر على "بدء" (Get Started)
3. اذهب إلى تبويب "Sign-in method"
4. فعّل "البريد الإلكتروني/كلمة المرور" (Email/Password)
5. انقر على "حفظ"

## الخطوة 4: إعداد Realtime Database

1. في القائمة الجانبية، انقر على "Realtime Database"
2. انقر على "إنشاء قاعدة بيانات"
3. اختر "بدء في وضع الاختبار" (Start in test mode)
4. اختر موقع الخادم (الأقرب للمملكة العربية السعودية)
5. انقر على "تم"

## الخطوة 5: تحديث إعدادات Firebase

### في ملف `firebase-config.js`:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyC...", // من Firebase Console
    authDomain: "your-project-id.firebaseapp.com",
    databaseURL: "https://your-project-id-default-rtdb.firebaseio.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef..."
};
```

### في ملفات `login.html` و `register.html`:

استبدل إعدادات Firebase في بداية كل ملف:

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

## الخطوة 6: إعداد قواعد قاعدة البيانات

### في Firebase Console > Realtime Database > Rules:

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
    },
    "system": {
      ".read": "auth != null",
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() == 'admin'"
    }
  }
}
```

## الخطوة 7: إضافة مستخدم إداري أول

### في Firebase Console > Authentication > Users:

1. انقر على "إضافة مستخدم"
2. أدخل البريد الإلكتروني وكلمة المرور
3. انقر على "إضافة مستخدم"

### في Firebase Console > Realtime Database:

أضف بيانات المستخدم الإداري:

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

## الخطوة 8: اختبار النظام

1. افتح `login.html` في المتصفح
2. سجل دخول بالمستخدم الإداري
3. تأكد من عمل جميع الوظائف
4. جرب إنشاء مستخدم جديد من `register.html`

## نصائح الأمان

### 1. تحديث قواعد قاعدة البيانات:

```json
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

### 2. إعدادات الأمان الإضافية:

- فعّل "تأكيد البريد الإلكتروني" في Authentication
- فعّل "كلمة مرور قوية" في Authentication
- أضف "تقييد النطاق" في Authentication

### 3. مراقبة الاستخدام:

- استخدم Firebase Analytics لمراقبة الاستخدام
- راجع سجلات Authentication بانتظام
- راقب استخدام قاعدة البيانات

## استكشاف الأخطاء

### مشاكل شائعة:

1. **خطأ في الاتصال**: تأكد من صحة إعدادات Firebase
2. **خطأ في الصلاحيات**: راجع قواعد قاعدة البيانات
3. **خطأ في تسجيل الدخول**: تأكد من تفعيل Email/Password في Authentication

### رسائل الخطأ:

- `auth/user-not-found`: المستخدم غير موجود
- `auth/wrong-password`: كلمة المرور خاطئة
- `auth/email-already-in-use`: البريد الإلكتروني مستخدم
- `auth/weak-password`: كلمة المرور ضعيفة

## الدعم

للحصول على المساعدة:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase)
