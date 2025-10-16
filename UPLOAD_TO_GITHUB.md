# تعليمات رفع المشروع على GitHub - خطوة بخطوة

## 🚀 الخطوات السريعة

### 1. تثبيت Git
- اذهب إلى: https://git-scm.com/downloads
- حمل وثبت Git على جهازك

### 2. إنشاء حساب GitHub
- اذهب إلى: https://github.com
- اضغط "Sign up" وأنشئ حساب

### 3. إنشاء مستودع جديد
1. اذهب إلى GitHub
2. اضغط "New repository" (الزر الأخضر)
3. املأ البيانات:
   - **Repository name**: `forms-management-system`
   - **Description**: `نظام إدارة النماذج - مركز العمليات - وزارة الداخلية`
   - اختر **Public** أو **Private**
   - **لا تضع علامة** على "Add a README file"
4. اضغط "Create repository"

### 4. رفع المشروع
افتح Command Prompt أو Terminal واكتب:

```bash
# الانتقال لمجلد المشروع
cd "C:\مركز العمليات"

# تهيئة Git
git init

# إضافة جميع الملفات
git add .

# إنشاء commit
git commit -m "Initial commit: Forms Management System"

# ربط المستودع البعيد (استبدل YOUR_USERNAME باسم المستخدم)
git remote add origin https://github.com/YOUR_USERNAME/forms-management-system.git

# رفع المشروع
git push -u origin main
```

## 📁 الملفات المطلوبة

تأكد من وجود هذه الملفات في مجلد المشروع:
- ✅ `index.html`
- ✅ `styles.css`
- ✅ `script.js`
- ✅ `logo.svg`
- ✅ `README.md`
- ✅ `package.json`
- ✅ `LICENSE`
- ✅ `.gitignore`

## 🔧 حل المشاكل

### مشكلة: "git is not recognized"
**الحل**: تأكد من تثبيت Git بشكل صحيح وأعد تشغيل Command Prompt

### مشكلة: "Permission denied"
**الحل**: تأكد من اسم المستخدم وكلمة المرور في GitHub

### مشكلة: "Repository not found"
**الحل**: تأكد من صحة رابط المستودع

### مشكلة: "Authentication failed"
**الحل**: استخدم Personal Access Token بدلاً من كلمة المرور

## 🌐 نشر النظام على الإنترنت

### تفعيل GitHub Pages
1. اذهب إلى إعدادات المستودع
2. انتقل إلى "Pages"
3. اختر "Deploy from a branch"
4. اختر "main" branch
5. اضغط "Save"

### الوصول للنظام المنشور
`https://YOUR_USERNAME.github.io/forms-management-system`

## 📝 تحديث المشروع

### إضافة تغييرات جديدة
```bash
git add .
git commit -m "Update: وصف التغييرات"
git push origin main
```

### سحب التحديثات
```bash
git pull origin main
```

## 🔐 إعدادات الأمان

### إضافة Collaborators
1. اذهب إلى إعدادات المستودع
2. اضغط "Manage access"
3. اضغط "Invite a collaborator"
4. أدخل اسم المستخدم

### إعدادات Branch Protection
1. اذهب إلى "Branches" في الإعدادات
2. اضغط "Add rule"
3. اختر "main" branch
4. فعّل "Require pull request reviews"

## 📊 مراقبة المشروع

### إحصائيات المشروع
- اذهب إلى "Insights" في المستودع
- شاهد إحصائيات الزوار والتحميلات

### إدارة Issues
- اذهب إلى "Issues" في المستودع
- أنشئ issues جديدة للمشاكل أو الميزات

## 🎯 نصائح مهمة

1. **اكتب commit messages واضحة**
2. **استخدم branches للعمل على ميزات جديدة**
3. **راجع التغييرات قبل الـ commit**
4. **احتفظ بنسخ احتياطية محلية**
5. **لا ترفع ملفات حساسة**

## 📞 الدعم

إذا واجهت أي مشاكل:
1. راجع الوثائق الرسمية لـ Git
2. ابحث في Stack Overflow
3. تواصل مع فريق التطوير

## ✅ التحقق من النجاح

بعد رفع المشروع بنجاح:
1. اذهب إلى صفحة المستودع على GitHub
2. تأكد من ظهور جميع الملفات
3. اضغط على "Code" لرؤية الملفات
4. جرب الوصول للنظام المنشور

---
**وزارة الداخلية - المملكة العربية السعودية**
