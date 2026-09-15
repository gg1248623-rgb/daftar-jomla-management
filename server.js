const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/daftar-jomla', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ تم الاتصال بقاعدة البيانات');
}).catch(err => {
  console.error('❌ خطأ في الاتصال:', err);
});

// Constants
const PORT = process.env.PORT || 5000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'daftar-jomla-2026';
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN || '';
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID || '';

// Routes
app.get('/', (req, res) => {
  res.json({
    app: 'دفتر الجملة - نظام الإدارة المتكامل',
    status: 'online',
    version: '1.0.0',
    endpoints: [
      'GET /',
      'GET /webhook',
      'POST /webhook',
      'GET /api/products',
      'POST /api/products',
      'GET /api/orders',
      'POST /api/orders',
      'GET /api/customers',
      'POST /api/customers',
      'GET /api/invoices',
      'GET /api/reports'
    ]
  });
});

// ==================== Webhook Verification ====================
app.get('/webhook', (req, res) => {
  const { 'hub.mode': mode, 'hub.verify_token': token, 'hub.challenge': challenge } = req.query;

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ تم التحقق من Webhook بنجاح');
    return res.status(200).send(challenge);
  }
  console.log('❌ فشل التحقق من Webhook');
  return res.sendStatus(403);
});

// ==================== Webhook Receiver ====================
app.post('/webhook', async (req, res) => {
  res.sendStatus(200);

  try {
    const message = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    const statuses = req.body?.entry?.[0]?.changes?.[0]?.value?.statuses?.[0];

    if (message) {
      console.log('📩 رسالة واردة:', JSON.stringify(message, null, 2));
      await handleIncomingMessage(message);
    }

    if (statuses) {
      console.log('📊 تحديث حالة:', statuses.status);
      await handleStatusUpdate(statuses);
    }
  } catch (error) {
    console.error('❌ خطأ في معالجة الـ Webhook:', error);
  }
});

// ==================== Message Handler ====================
async function handleIncomingMessage(message) {
  const from = message.from;
  const text = message.text?.body?.trim();
  const type = message.type;

  if (!from || !text) return;

  console.log(`👤 من: ${from}`);
  console.log(`💬 النص: ${text}`);

  // معالجة الأوامر
  if (text.toLowerCase().includes('طلب')) {
    await sendMessage(from, `مرحباً بك في دفتر الجملة 👋\n\nلإنشاء طلب جديد، من فضلك أرسل البيانات التالية:\n📦 المنتج\n📊 الكمية\n💰 السعر`);
  } else if (text.toLowerCase().includes('منتجات')) {
    await sendMessage(from, `📋 قائمة المنتجات:\n\n1️⃣ منتج 1 - 100 ريال\n2️⃣ منتج 2 - 200 ريال\n3️⃣ منتج 3 - 300 ريال\n\nأرسل رقم المنتج لمزيد من التفاصيل`);
  } else if (text.toLowerCase().includes('فاتورة')) {
    await sendMessage(from, `🧾 طلب رقمك:\n\nهل تريد تفاصيل فاتورة معينة؟\nأرسل رقم الفاتورة`);
  } else {
    await sendMessage(from, `أهلاً بك في دفتر الجملة 👋\n\nوصلت رسالتك: "${text}"\n\n⌨️ الأوامر المتاحة:\n🔹 "طلب" - إنشاء طلب جديد\n🔹 "منتجات" - عرض المنتجات\n🔹 "فاتورة" - عرض الفواتير\n🔹 "حالة" - معرفة حالة الطلب`);
  }
}

// ==================== Status Handler ====================
async function handleStatusUpdate(statuses) {
  const status = statuses.status;
  const recipientId = statuses.recipient_id;
  const timestamp = statuses.timestamp;

  console.log(`✉️ حالة الرسالة: ${status}`);
  console.log(`🕐 الوقت: ${new Date(timestamp * 1000).toLocaleString('ar-SA')}`);
}

// ==================== Send Message ====================
async function sendMessage(to, body) {
  if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
    console.log('⚠️ تحذير: WHATSAPP_TOKEN أو PHONE_NUMBER_ID مفقود');
    return;
  }

  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'text',
        text: {
          preview_url: false,
          body,
        },
      }),
    });

    const data = await response.json();
    if (data.messages) {
      console.log('✅ تم إرسال الرسالة بنجاح');
    } else {
      console.error('❌ خطأ في الإرسال:', data);
    }
  } catch (error) {
    console.error('❌ خطأ في اتصال الإرسال:', error);
  }
}

// ==================== API Routes ====================

// Products API
app.get('/api/products', (req, res) => {
  res.json({
    status: 'success',
    message: 'قائمة المنتجات',
    products: [
      { id: 1, name: 'منتج 1', price: 100, stock: 50 },
      { id: 2, name: 'منتج 2', price: 200, stock: 30 },
      { id: 3, name: 'منتج 3', price: 300, stock: 20 },
    ],
  });
});

app.post('/api/products', (req, res) => {
  res.json({
    status: 'success',
    message: 'تم إضافة المنتج بنجاح',
  });
});

// Orders API
app.get('/api/orders', (req, res) => {
  res.json({
    status: 'success',
    message: 'قائمة الط��بات',
    orders: [
      { id: 1, customer: 'أحمد', total: 500, status: 'معلق' },
      { id: 2, customer: 'محمد', total: 750, status: 'مكتمل' },
    ],
  });
});

app.post('/api/orders', (req, res) => {
  res.json({
    status: 'success',
    message: 'تم إنشاء الطلب بنجاح',
    orderId: Math.random().toString(36).substr(2, 9),
  });
});

// Customers API
app.get('/api/customers', (req, res) => {
  res.json({
    status: 'success',
    message: 'قائمة العملاء',
    customers: [
      { id: 1, name: 'أحمد محمد', phone: '0557699144', totalOrders: 5 },
      { id: 2, name: 'فاطمة علي', phone: '0555555555', totalOrders: 3 },
    ],
  });
});

app.post('/api/customers', (req, res) => {
  res.json({
    status: 'success',
    message: 'تم إضافة العميل بنجاح',
  });
});

// Invoices API
app.get('/api/invoices', (req, res) => {
  res.json({
    status: 'success',
    message: 'قائمة الفواتير',
    invoices: [
      { id: 'INV-001', customer: 'أحمد', date: '2026-01-15', total: 500, status: 'مدفوعة' },
      { id: 'INV-002', customer: 'محمد', date: '2026-01-16', total: 750, status: 'معلقة' },
    ],
  });
});

// Reports API
app.get('/api/reports', (req, res) => {
  res.json({
    status: 'success',
    message: 'التقارير',
    reports: {
      totalRevenue: 5000,
      totalOrders: 10,
      totalCustomers: 5,
      averageOrderValue: 500,
    },
  });
});

// ==================== Error Handler ====================
app.use((err, req, res, next) => {
  console.error('❌ خطأ:', err);
  res.status(500).json({
    status: 'error',
    message: 'حدث خطأ في الخادم',
  });
});

// ==================== Start Server ====================
app.listen(PORT, () => {
  console.log(`\n🚀 خادم دفتر الجملة يعمل على المنفذ ${PORT}`);
  console.log(`📍 رابط التطبيق: http://localhost:${PORT}`);
  console.log(`📱 رقم الهاتف المسجل: 0557699144\n`);
});