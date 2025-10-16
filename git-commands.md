# أوامر Git الأساسية

## الأوامر الأساسية

### تهيئة Git
```bash
git init
```

### إضافة الملفات
```bash
# إضافة جميع الملفات
git add .

# إضافة ملف محدد
git add filename

# إضافة ملفات متعددة
git add file1 file2 file3
```

### إنشاء Commit
```bash
git commit -m "رسالة وصف التغييرات"
```

### ربط المستودع البعيد
```bash
git remote add origin https://github.com/USERNAME/REPOSITORY.git
```

### رفع التغييرات
```bash
git push origin main
```

### سحب التغييرات
```bash
git pull origin main
```

## أوامر مفيدة

### عرض الحالة
```bash
git status
```

### عرض التاريخ
```bash
git log
```

### عرض الفروق
```bash
git diff
```

### إعادة تعيين
```bash
# إعادة تعيين الملفات
git reset HEAD filename

# إعادة تعيين كامل
git reset --hard HEAD
```

### إنشاء فرع جديد
```bash
git checkout -b new-branch
```

### التبديل بين الفروع
```bash
git checkout main
git checkout branch-name
```

### دمج الفروع
```bash
git merge branch-name
```

## أوامر متقدمة

### إخفاء التغييرات
```bash
git stash
git stash pop
```

### إعادة تسمية الفرع
```bash
git branch -m old-name new-name
```

### حذف الفرع
```bash
git branch -d branch-name
```

### عرض الفروع
```bash
git branch
git branch -a
```

### إعادة كتابة التاريخ
```bash
git rebase -i HEAD~3
```

## حل المشاكل

### مشكلة في المصادقة
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### مشكلة في Push
```bash
git pull origin main --allow-unrelated-histories
```

### إعادة تعيين كامل
```bash
rm -rf .git
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

### حذف الملفات من Git
```bash
git rm filename
git commit -m "Remove filename"
```

### إضافة ملفات إلى .gitignore
```bash
echo "filename" >> .gitignore
git add .gitignore
git commit -m "Add filename to gitignore"
```

## أوامر GitHub

### استنساخ مستودع
```bash
git clone https://github.com/USERNAME/REPOSITORY.git
```

### إضافة Fork
```bash
git remote add upstream https://github.com/ORIGINAL-USER/REPOSITORY.git
```

### مزامنة مع المستودع الأصلي
```bash
git fetch upstream
git merge upstream/main
```

### رفع إلى Fork
```bash
git push origin main
```

## نصائح مهمة

1. **اكتب commit messages واضحة**
2. **استخدم branches للعمل على ميزات جديدة**
3. **راجع التغييرات قبل الـ commit**
4. **احتفظ بنسخ احتياطية**
5. **لا ترفع ملفات حساسة**

## أمثلة عملية

### إضافة ملف جديد
```bash
git add new-file.html
git commit -m "Add: new HTML file"
git push origin main
```

### تعديل ملف موجود
```bash
git add modified-file.js
git commit -m "Update: improve JavaScript functionality"
git push origin main
```

### إنشاء ميزة جديدة
```bash
git checkout -b feature/new-feature
# قم بالتعديلات
git add .
git commit -m "Add: new feature"
git push origin feature/new-feature
```

### دمج الميزة
```bash
git checkout main
git merge feature/new-feature
git push origin main
```

---
**وزارة الداخلية - المملكة العربية السعودية**
