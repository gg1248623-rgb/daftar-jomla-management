// معالج الرسائل الواردة من WhatsApp

async function handleIncomingMessage(message, sendMessage) {
  const from = message.from;
  const text = message.text?.body?.trim();
  const type = message.type;

  if (!from || !text) return;

  const lowerText = text.toLowerCase();

  // معالجة الأوامر المختلفة
  if (lowerText.includes('طلب') || lowerText.includes('order')) {
    await sendMessage(from, `مرحباً بك في دفتر الجملة 👋

لإنشاء طلب جديد، من فضلك أرسل البيانات التالية:
📦 المنتج
📊 الكمية
💰 السعر

أو اختر من قائمتنا:
/products`);
  } 
  else if (lowerText.includes('منتجات') || lowerText.includes('products')) {
    await sendMessage(from, `📋 قائمة المنتجات:

1️⃣ منتج 1 - 100 ريال
2️⃣ منتج 2 - 200 ريال
3️⃣ منتج 3 - 300 ريال

أرسل رقم المنتج لمزيد من التفاصيل`);
  } 
  else if (lowerText.includes('فاتورة') || lowerText.includes('invoice')) {
    await sendMessage(from, `🧾 خدمة الفواتير

هل تريد تفاصيل فاتورة معينة؟
أرسل رقم الفاتورة (مثال: INV-001)`);
  } 
  else if (lowerText.includes('حالة') || lowerText.includes('status')) {
    await sendMessage(from, `📊 خدمة الحالة

أرسل رقم طلبك لمعرفة الحالة الحالية`);
  } 
  else if (lowerText.includes('تواصل') || lowerText.includes('contact')) {
    await sendMessage(from, `📞 معلومات التواصل

☎️ الهاتف: 0557699144
📧 البريد: gg1248623@gmail.com
💬 WhatsApp: https://wa.me/0557699144`);
  }
  else {
    await sendMessage(from, `أهلاً بك في دفتر الجملة 👋

وصلت رسالتك: "${text}"

⌨️ الأوامر المتاحة:
🔹 "طلب" - إنشاء طلب جديد
🔹 "منتجات" - عرض المنتجات
🔹 "فاتورة" - عرض الفواتير
🔹 "حالة" - معرفة حالة الطلب
🔹 "تواصل" - معلومات التواصل

كيف يمكني مساعدتك؟`);
  }
}

module.exports = { handleIncomingMessage };
