// معالج تحديثات حالة الرسائل

async function handleStatusUpdate(status) {
  const statusMap = {
    'sent': 'تم الإرسال ✓',
    'delivered': 'تم التسليم ✓✓',
    'read': 'تم القراءة ✓✓✓',
    'failed': 'فشل الإرسال ❌'
  };

  const statusAr = statusMap[status.status] || status.status;

  console.log(`📊 تحديث حالة الرسالة:`);
  console.log(`   الحالة: ${statusAr}`);
  console.log(`   معرّف الرسالة: ${status.id}`);
  console.log(`   الوقت: ${new Date(status.timestamp * 1000).toLocaleString('ar-SA')}`);

  // يمكن إضافة منطق إضافي هنا
  // مثل تحديث قاعدة البيانات أو إرسال إشعارات
}

module.exports = { handleStatusUpdate };
