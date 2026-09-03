const messages = {
  welcome: (name, barcode, parent_token) => `
    تم تسجيل الطالب/ة : ${name}
    بسنتر بشتة التعليمي
    باركود الطالب : ${barcode}
    ولمتابعة  بيانات ابنكم / بنتكم من خلال الرابط التالي 
    https://boshta.benb3n.cloud/parent/${parent_token}
    `,
  absent: (name, barcode, date, parent_token) => `
    تنبيه بعدم حضور ابنكم : ${name}
    باركود الطالب : ${barcode}
    بحصة اليوم الموافق : ${date}
    برجاء متابعة ابنكم 
    مع تحيات الأستاذ محمد بشته
    ولمزيد من المعلومات عن الطالب من خلال الضغط علي 
    https://boshta.benb3n.cloud/parent/${parent_token}
    `,
  payment: (name, date, amount) => `
  تم سداد المصروفات للطالب : ${name} بنجاح
  عن شهر ${date}بالمبلغ المدفوع وهو ${amount} جنيه
  مع تحيات الأستاذ محمد بشته
    `,
  exams: (name, score, finalDegree, date, day, barcode) => `
  نود إبلاغكم بأن الطالب ${name} حصل علي درجة :(${score}من${finalDegree})
  في امتحان بتاريخ: ${date} الموافق ${day}
  باركود الطالب : ${barcode}
  مع تحيات الأستاذ محمد بشته.
    `,
};

module.exports = messages;

 
