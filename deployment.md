# دليل نشر النظام

## النشر المحلي

### 1. تشغيل النظام محلياً

#### باستخدام Python
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### باستخدام Node.js
```bash
# تثبيت http-server
npm install -g http-server

# تشغيل السيرفر
http-server -p 8000
```

#### باستخدام PHP
```bash
# PHP 5.4+
php -S localhost:8000
```

### 2. الوصول للنظام
افتح المتصفح واذهب إلى: `http://localhost:8000`

## النشر على الإنترنت

### 1. GitHub Pages

#### إنشاء مستودع جديد
1. اذهب إلى GitHub
2. اضغط "New repository"
3. اختر اسم المستودع
4. اختر "Public"
5. اضغط "Create repository"

#### رفع المشروع
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/REPOSITORY_NAME.git
git push -u origin main
```

#### تفعيل GitHub Pages
1. اذهب إلى إعدادات المستودع
2. انتقل إلى "Pages"
3. اختر "Deploy from a branch"
4. اختر "main" branch
5. اضغط "Save"

#### الوصول للنظام
`https://YOUR_USERNAME.github.io/REPOSITORY_NAME`

### 2. Netlify

#### النشر المباشر
1. اذهب إلى [Netlify](https://netlify.com)
2. اضغط "New site from Git"
3. اختر GitHub
4. اختر المستودع
5. اضغط "Deploy site"

#### النشر من المجلد
1. اذهب إلى [Netlify](https://netlify.com)
2. اسحب مجلد المشروع إلى منطقة النشر
3. انتظر حتى يكتمل النشر

### 3. Vercel

#### النشر باستخدام Vercel CLI
```bash
# تثبيت Vercel CLI
npm install -g vercel

# النشر
vercel
```

#### النشر من GitHub
1. اذهب إلى [Vercel](https://vercel.com)
2. اضغط "New Project"
3. اختر GitHub
4. اختر المستودع
5. اضغط "Deploy"

### 4. Firebase Hosting

#### تثبيت Firebase CLI
```bash
npm install -g firebase-tools
```

#### تسجيل الدخول
```bash
firebase login
```

#### تهيئة المشروع
```bash
firebase init hosting
```

#### النشر
```bash
firebase deploy
```

## النشر على السيرفر

### 1. Apache

#### إعداد Virtual Host
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /path/to/your/project
    DirectoryIndex index.html
</VirtualHost>
```

#### إعداد SSL
```bash
# تثبيت Certbot
sudo apt install certbot python3-certbot-apache

# الحصول على شهادة SSL
sudo certbot --apache -d your-domain.com
```

### 2. Nginx

#### إعداد Server Block
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/your/project;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
```

#### إعداد SSL
```bash
# تثبيت Certbot
sudo apt install certbot python3-certbot-nginx

# الحصول على شهادة SSL
sudo certbot --nginx -d your-domain.com
```

### 3. Docker

#### إنشاء Dockerfile
```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### بناء وتشغيل الحاوية
```bash
# بناء الصورة
docker build -t forms-management-system .

# تشغيل الحاوية
docker run -p 80:80 forms-management-system
```

## إعدادات الأمان

### 1. HTTPS
- تأكد من استخدام HTTPS في الإنتاج
- قم بتحديث الشهادات بانتظام

### 2. Headers الأمان
```apache
# Apache
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
```

```nginx
# Nginx
add_header X-Content-Type-Options nosniff;
add_header X-Frame-Options DENY;
add_header X-XSS-Protection "1; mode=block";
```

### 3. CORS
```javascript
// إعداد CORS إذا لزم الأمر
app.use(cors({
    origin: ['https://your-domain.com'],
    credentials: true
}));
```

## مراقبة الأداء

### 1. Google Analytics
```html
<!-- إضافة Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 2. مراقبة الأخطاء
```javascript
// إضافة مراقبة الأخطاء
window.addEventListener('error', function(e) {
    console.error('Error:', e.error);
    // إرسال الخطأ إلى خدمة المراقبة
});
```

## النسخ الاحتياطي

### 1. نسخ احتياطي للبيانات
```bash
# نسخ احتياطي للبيانات المحلية
cp -r /path/to/project /backup/location/
```

### 2. نسخ احتياطي لقاعدة البيانات
```bash
# إذا كنت تستخدم قاعدة بيانات
mysqldump -u username -p database_name > backup.sql
```

## التحديثات

### 1. تحديث النظام
```bash
# سحب التحديثات
git pull origin main

# إعادة تشغيل الخدمة
sudo systemctl restart nginx
```

### 2. تحديث التبعيات
```bash
# تحديث npm packages
npm update

# تحديث Python packages
pip install --upgrade package_name
```

## استكشاف الأخطاء

### 1. فحص السجلات
```bash
# Apache logs
tail -f /var/log/apache2/error.log

# Nginx logs
tail -f /var/log/nginx/error.log
```

### 2. فحص الحالة
```bash
# فحص حالة Apache
sudo systemctl status apache2

# فحص حالة Nginx
sudo systemctl status nginx
```

## الدعم الفني

للحصول على الدعم الفني:
- افتح issue في GitHub
- تواصل مع فريق التطوير
- راجع الوثائق

---
**وزارة الداخلية - المملكة العربية السعودية**
