// Firebase Realtime Database Example
// مثال على هيكل قاعدة بيانات المستخدمين في Firebase

// هيكل قاعدة البيانات المقترح:
const databaseStructure = {
    "users": {
        "user_uid_1": {
            "fullName": "أحمد محمد العتيبي",
            "email": "ahmed@example.com",
            "phone": "+966501234567",
            "role": "admin",
            "department": "قسم العمليات",
            "permissions": {
                "forms": ["create", "read", "update", "delete", "print"],
                "documents": ["create", "read", "update", "delete", "print", "download"],
                "signatures": ["create", "read", "update", "delete", "unify"],
                "users": ["create", "read", "update", "delete"],
                "system": ["monitor", "logs", "settings"]
            },
            "isActive": true,
            "createdAt": 1703123456789,
            "lastLogin": 1703200000000,
            "profileImage": "https://example.com/profile1.jpg"
        },
        "user_uid_2": {
            "fullName": "فاطمة عبدالله الزهراني",
            "email": "fatima@example.com",
            "phone": "+966507654321",
            "role": "user",
            "department": "قسم الموارد البشرية",
            "permissions": {
                "forms": ["create", "read", "print"],
                "documents": ["read", "print"],
                "signatures": ["read"],
                "users": [],
                "system": []
            },
            "isActive": true,
            "createdAt": 1703123456789,
            "lastLogin": 1703200000000
        },
        "user_uid_3": {
            "fullName": "محمد سعد القحطاني",
            "email": "mohammed@example.com",
            "phone": "+966509876543",
            "role": "user",
            "department": "قسم الأمن",
            "permissions": {
                "forms": ["create", "read", "print"],
                "documents": ["read", "print"],
                "signatures": ["read"],
                "users": [],
                "system": []
            },
            "isActive": true,
            "createdAt": 1703123456789,
            "lastLogin": null
        }
    },
    "forms": {
        "form_1": {
            "type": "absence",
            "title": "نموذج تأخير أو غياب",
            "data": {
                "name": "أحمد محمد العتيبي",
                "rank": "رائد",
                "militaryNumber": "12345",
                "unit": "منسوبي قسم العمليات",
                "reason": "ظروف صحية",
                "evidence": "تقرير طبي",
                "commitment": "أتعهد بعدم التكرار"
            },
            "createdBy": "user_uid_1",
            "createdAt": 1703123456789,
            "status": "pending",
            "approvedBy": null,
            "approvedAt": null
        }
    },
    "documents": {
        "doc_1": {
            "title": "تقرير شهري - ديسمبر 2023",
            "type": "report",
            "content": "محتوى التقرير...",
            "createdBy": "user_uid_1",
            "createdAt": 1703123456789,
            "fileUrl": "https://example.com/files/report1.pdf",
            "isPublic": false
        }
    },
    "signatures": {
        "sig_1": {
            "name": "توقيع القائد",
            "data": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
            "createdBy": "user_uid_1",
            "createdAt": 1703123456789,
            "isDefault": true
        }
    },
    "system": {
        "settings": {
            "maintenanceMode": false,
            "allowRegistration": true,
            "maxFileSize": 10485760, // 10MB
            "sessionTimeout": 3600000 // 1 hour
        },
        "logs": {
            "log_1": {
                "action": "user_login",
                "userId": "user_uid_1",
                "timestamp": 1703123456789,
                "ipAddress": "192.168.1.100",
                "userAgent": "Mozilla/5.0..."
            }
        }
    }
};

// دوال مساعدة للتعامل مع قاعدة البيانات
class FirebaseDatabaseHelper {
    constructor() {
        this.database = firebase.database();
    }

    // إنشاء مستخدم جديد
    async createUser(userData) {
        try {
            const userRef = this.database.ref('users/' + userData.uid);
            await userRef.set({
                ...userData,
                createdAt: firebase.database.ServerValue.TIMESTAMP,
                isActive: true
            });
            return true;
        } catch (error) {
            console.error('Error creating user:', error);
            return false;
        }
    }

    // الحصول على بيانات مستخدم
    async getUser(userId) {
        try {
            const userRef = this.database.ref('users/' + userId);
            const snapshot = await userRef.once('value');
            return snapshot.val();
        } catch (error) {
            console.error('Error getting user:', error);
            return null;
        }
    }

    // تحديث بيانات مستخدم
    async updateUser(userId, userData) {
        try {
            const userRef = this.database.ref('users/' + userId);
            await userRef.update({
                ...userData,
                updatedAt: firebase.database.ServerValue.TIMESTAMP
            });
            return true;
        } catch (error) {
            console.error('Error updating user:', error);
            return false;
        }
    }

    // حذف مستخدم
    async deleteUser(userId) {
        try {
            const userRef = this.database.ref('users/' + userId);
            await userRef.remove();
            return true;
        } catch (error) {
            console.error('Error deleting user:', error);
            return false;
        }
    }

    // الحصول على جميع المستخدمين
    async getAllUsers() {
        try {
            const usersRef = this.database.ref('users');
            const snapshot = await usersRef.once('value');
            return snapshot.val();
        } catch (error) {
            console.error('Error getting all users:', error);
            return null;
        }
    }

    // تسجيل نشاط المستخدم
    async logUserActivity(userId, action, details = {}) {
        try {
            const logsRef = this.database.ref('system/logs');
            await logsRef.push({
                userId: userId,
                action: action,
                details: details,
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                ipAddress: await this.getClientIP(),
                userAgent: navigator.userAgent
            });
            return true;
        } catch (error) {
            console.error('Error logging activity:', error);
            return false;
        }
    }

    // الحصول على عنوان IP للعميل (تقريبي)
    async getClientIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            return 'unknown';
        }
    }

    // تحديث آخر تسجيل دخول
    async updateLastLogin(userId) {
        try {
            const userRef = this.database.ref('users/' + userId);
            await userRef.update({
                lastLogin: firebase.database.ServerValue.TIMESTAMP
            });
            return true;
        } catch (error) {
            console.error('Error updating last login:', error);
            return false;
        }
    }

    // الحصول على إحصائيات النظام
    async getSystemStats() {
        try {
            const usersRef = this.database.ref('users');
            const formsRef = this.database.ref('forms');
            const documentsRef = this.database.ref('documents');
            
            const [usersSnapshot, formsSnapshot, documentsSnapshot] = await Promise.all([
                usersRef.once('value'),
                formsRef.once('value'),
                documentsRef.once('value')
            ]);

            const users = usersSnapshot.val() || {};
            const forms = formsSnapshot.val() || {};
            const documents = documentsSnapshot.val() || {};

            return {
                totalUsers: Object.keys(users).length,
                activeUsers: Object.values(users).filter(user => user.isActive).length,
                totalForms: Object.keys(forms).length,
                totalDocuments: Object.keys(documents).length,
                lastUpdated: Date.now()
            };
        } catch (error) {
            console.error('Error getting system stats:', error);
            return null;
        }
    }
}

// إنشاء مثيل من المساعد
const dbHelper = new FirebaseDatabaseHelper();

// تصدير للاستخدام في الملفات الأخرى
window.FirebaseDatabaseHelper = FirebaseDatabaseHelper;
window.dbHelper = dbHelper;
