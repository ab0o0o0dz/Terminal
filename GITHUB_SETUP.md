# تعليمات رفع المشروع على GitHub

## الخطوة 1: تثبيت Git

### Windows
1. اذهب إلى https://git-scm.com/downloads
2. حمل Git for Windows
3. شغل الملف المحمل
4. اتبع التعليمات للتثبيت

### macOS
```bash
# باستخدام Homebrew
brew install git

# أو حمل من الموقع الرسمي
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install git
```

## الخطوة 2: إنشاء حساب GitHub

1. اذهب إلى https://github.com
2. اضغط "Sign up"
3. املأ البيانات المطلوبة
4. تأكد من الحساب عبر البريد الإلكتروني

## الخطوة 3: إنشاء مستودع جديد

1. اذهب إلى GitHub
2. اضغط "New repository" (الزر الأخضر)
3. املأ البيانات:
   - **Repository name**: `forms-management-system`
   - **Description**: `نظام إدارة النماذج - مركز العمليات - وزارة الداخلية`
   - **Public** أو **Private** (اختر حسب الحاجة)
   - **لا تضع علامة** على "Add a README file"
4. اضغط "Create repository"

## الخطوة 4: رفع المشروع

### فتح Terminal/Command Prompt
- **Windows**: اضغط `Win + R` واكتب `cmd`
- **macOS**: اضغط `Cmd + Space` واكتب `Terminal`
- **Linux**: اضغط `Ctrl + Alt + T`

### الانتقال لمجلد المشروع
```bash
cd "C:\مركز العمليات"
```

### تهيئة Git
```bash
git init
```

### إضافة الملفات
```bash
git add .
```

### إنشاء Commit
```bash
git commit -m "Initial commit: Forms Management System for Interior Ministry"
```

### إضافة Remote Repository
```bash
git remote add origin https://github.com/YOUR_USERNAME/forms-management-system.git
```

### رفع المشروع
```bash
git branch -M main
git push -u origin main
```

## الخطوة 5: تفعيل GitHub Pages (اختياري)

### إذا كنت تريد نشر النظام على الإنترنت:

1. اذهب إلى إعدادات المستودع
2. انتقل إلى "Pages" في القائمة الجانبية
3. في "Source" اختر "Deploy from a branch"
4. اختر "main" branch
5. اضغط "Save"

### الوصول للنظام المنشور:
`https://YOUR_USERNAME.github.io/forms-management-system`

## الخطوة 6: إدارة المشروع

### إضافة ملفات جديدة
```bash
git add .
git commit -m "Add: وصف التغييرات"
git push
```

### تحديث المشروع
```bash
git pull origin main
```

### إنشاء فرع جديد
```bash
git checkout -b feature/new-feature
git add .
git commit -m "Add: ميزة جديدة"
git push origin feature/new-feature
```

## الخطوة 7: إعدادات إضافية

### إضافة Collaborators
1. اذهب إلى إعدادات المستودع
2. اضغط "Manage access"
3. اضغط "Invite a collaborator"
4. أدخل اسم المستخدم أو البريد الإلكتروني

### إعدادات الأمان
1. اذهب إلى "Security" في إعدادات المستودع
2. فعّل "Dependency alerts"
3. فعّل "Dependabot alerts"

## الخطوة 8: إدارة Issues

### إنشاء Issue جديد
1. اذهب إلى صفحة المستودع
2. اضغط "Issues"
3. اضغط "New issue"
4. اكتب العنوان والوصف
5. اضغط "Submit new issue"

### إدارة Labels
1. اذهب إلى "Issues"
2. اضغط "Labels"
3. أضف labels جديدة حسب الحاجة

## الخطوة 9: إعدادات المشروع

### إضافة وصف للمستودع
1. اذهب إلى إعدادات المستودع
2. في "About" أضف:
   - **Website**: رابط الموقع إذا كان متاحاً
   - **Topics**: `forms-management`, `saudi-arabia`, `government`, `interior-ministry`

### إضافة README
- الملف موجود بالفعل: `README.md`
- يحتوي على وصف شامل للمشروع

## الخطوة 10: النسخ الاحتياطي

### نسخ احتياطي محلي
```bash
# إنشاء نسخة احتياطية
git clone https://github.com/YOUR_USERNAME/forms-management-system.git backup-forms-system
```

### نسخ احتياطي على GitHub
- GitHub يحتفظ بنسخ احتياطية تلقائياً
- يمكنك تحميل نسخة ZIP من المستودع

## استكشاف الأخطاء

### مشكلة في Git
```bash
# إعادة تعيين Git
rm -rf .git
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/forms-management-system.git
git push -u origin main
```

### مشكلة في المصادقة
```bash
# إعداد Git credentials
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### مشكلة في Push
```bash
# سحب التغييرات أولاً
git pull origin main --allow-unrelated-histories
git push origin main
```

## نصائح مهمة

1. **لا ترفع ملفات حساسة**: تأكد من وجود `.gitignore`
2. **اكتب commit messages واضحة**: وصف ما تم تغييره
3. **استخدم branches**: للعمل على ميزات جديدة
4. **راجع التغييرات**: قبل الـ commit
5. **احتفظ بنسخ احتياطية**: من المشروع محلياً

## الدعم

إذا واجهت أي مشاكل:
1. راجع الوثائق الرسمية لـ Git
2. ابحث في Stack Overflow
3. تواصل مع فريق التطوير

---
**وزارة الداخلية - المملكة العربية السعودية**
