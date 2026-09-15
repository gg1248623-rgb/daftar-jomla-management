# 📊 دفتر الجملة - نظام الإدارة المتكامل

نظام متكامل لإدارة دفتر الجملة مع دعم كامل لـ WhatsApp Business API والـ Webhooks

## ✨ المميزات الرئيسية

### 📦 إدارة المنتجات
- ✅ إضافة وتعديل وحذف المنتجات
- ✅ إدارة الأسعار والخصومات
- ✅ تتبع المخزون
- ✅ فئ��ت المنتجات

### 🛒 إدارة الطلبات
- ✅ إنشاء طلبات جديدة
- ✅ تتبع حالة الطلب
- ✅ إدارة أولويات الطلبات
- ✅ إشعارات تلقائية عند تغيير الحالة

### 👥 إدارة العملاء
- ✅ قائمة العملاء الكاملة
- ✅ سجل المشتريات لكل عميل
- ✅ حفظ بيانات التواصل
- ✅ إحصائيات العملاء

### 🧾 الفواتير والتقارير
- ✅ إنشاء فواتير تلقائية
- ✅ تتبع المدفوعات
- ✅ تقارير المبيعات
- ✅ تحليلات شاملة

### 💬 تكامل WhatsApp
- ✅ استقبال الرسائل تلقائياً
- ✅ الرد الفوري على الاستفسارات
- ✅ إرسال إشعارات الطلبات
- ✅ إدارة المحادثات

## 🚀 البدء السريع

### المتطلبات
- Node.js v14+
- MongoDB
- حساب Meta Business
- توكن WhatsApp Business API

### التثبيت

```bash
# استنساخ المستودع
git clone https://github.com/gg1248623-rgb/daftar-jomla-management.git
cd daftar-jomla-management

# تثبيت المتطلبات
npm install

# إنشاء ملف .env
cp .env.example .env
```

### الإعدادات

عدّل ملف `.env` بالقيم الخاصة بك:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/daftar-jomla
VERIFY_TOKEN=daftar-jomla-2026
WHATSAPP_TOKEN=your_token_here
PHONE_NUMBER_ID=your_phone_id_here
```

### التشغيل

```bash
# التشغيل العادي
npm start

# التشغيل مع المراقبة (Development)
npm run dev
```

الخادم سيبدأ على: `http://localhost:5000`

## 📡 إعدادات Webhook

### 1. إنشاء Webhook على Meta

1. اذهب إلى [Meta Developers](https://developers.facebook.com)
2. اختر تطبيقك
3. ذهب إلى **WhatsApp > Configuration**
4. أضف Webhook URL: `https://your-domain.com/webhook`
5. أضف Verify Token: `daftar-jomla-2026`
6. اختر الأحداث:
   - messages
   - message_status
   - message_template_status_update

### 2. اختبار الـ Webhook

```bash
# اختبار التحقق
curl -X GET "http://localhost:5000/webhook?hub.mode=subscribe&hub.verify_token=daftar-jomla-2026&hub.challenge=test_challenge"

# إرسال رسالة اختبار
curl -X POST "http://localhost:5000/webhook" \
  -H "Content-Type: application/json" \
  -d '{
    "entry": [{
      "changes": [{
        "value": {
          "messages": [{
            "from": "0557699144",
            "text": { "body": "رسالة اختبار" },
            "type": "text"
          }]
        }
      }]
    }]
  }'
```

## 🔌 API Endpoints

### معلومات الخادم
```
GET /
```

### المنتجات
```
GET /api/products          - عرض جميع المنتجات
POST /api/products         - إضافة منتج جديد
```

### الطلبات
```
GET /api/orders            - عرض جميع الطلبات
POST /api/orders           - إنشاء طلب جديد
```

### العملاء
```
GET /api/customers         - عرض جميع العملاء
POST /api/customers        - إضافة عميل جديد
```

### الفواتير
```
GET /api/invoices          - عرض جميع الفواتير
```

### التقارير
```
GET /api/reports           - عرض التقارير والإحصائيات
```

## 💬 أوامر WhatsApp المتاحة

يمكن للعملاء استخدام الأوامر التالية عبر WhatsApp:

| الأمر | الوصف |
|------|-------|
| `طلب` | إنشاء طلب جديد |
| `منتجات` | عرض قائمة المنتجات |
| `فا��ورة` | عرض الفواتير |
| `حالة` | معرفة حالة الطلب |

## 📊 هيكل البيانات

### نموذج المنتج
```javascript
{
  id: String,
  name: String,
  price: Number,
  stock: Number,
  category: String,
  description: String,
  image: String
}
```

### نموذج الطلب
```javascript
{
  id: String,
  customer: Object,
  products: Array,
  total: Number,
  status: String, // معلق، مكتمل، ملغى
  createdAt: Date,
  updatedAt: Date
}
```

### نموذج العميل
```javascript
{
  id: String,
  name: String,
  phone: String,
  email: String,
  address: String,
  totalOrders: Number,
  totalSpent: Number
}
```

## 🔒 الأمان

- ✅ التحقق من Verify Token للـ Webhook
- ✅ التحقق من صحة البيانات الواردة
- ✅ معالجة الأخطاء الآمنة
- ✅ تشفير البيانات الحساسة
- ⚠️ **لا تشارك WHATSAPP_TOKEN مع أي شخص**

## 📝 Logging

النظام يسجل جميع الأنشطة:
- ✅ الرسائل الواردة
- ✅ الرسائل المرسلة
- ✅ الطلبات والتحديثات
- ✅ الأخطاء والتحذيرات

## 🐛 استكشاف الأخطاء

### Webhook لا يعمل
1. تحقق من أن الـ Verify Token صحيح
2. تأكد من أن الرابط العام صحيح
3. تحقق من السجلات (Logs) في Meta Dashboard

### الرسائل لا تصل
1. تأكد من توفر WHATSAPP_TOKEN و PHONE_NUMBER_ID
2. تحقق من أن رقم الهاتف مسجل بشكل صحيح
3. تحقق من حالة حسابك في Meta

## 📚 المراجع

- [Meta WhatsApp Business API Docs](https://developers.facebook.com/docs/whatsapp/cloud-api/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)

## 🤝 المساهمة

المساهمات مرحب بها! يرجى:
1. Fork المستودع
2. إنشاء فرع جديد (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add AmazingFeature'`)
4. Push للفرع (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

## 📞 التواصل

- **WhatsApp**: 0557699144
- **البريد**: gg1248623@gmail.com
- **GitHub**: [@gg1248623-rgb](https://github.com/gg1248623-rgb)

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - انظر ملف LICENSE للتفاصيل

---

**تم الإنشاء بـ ❤️ لإدارة دفتر الجملة بك��اءة عالية**
