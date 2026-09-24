# تقرير مراجعة Backend ومشاكل رفع الملفات

**المشروع محل المراجعة:** `FINAL_BACKEND_MAIN_BRANCH.zip`  
**نطاق المراجعة:** مراجعة ثابتة للكود، مع تركيز خاص على دورة رفع الملفات، التخزين، التحقق، الحذف، والتنزيل.  
**حالة الاختبارات:** تم فحص **205 ملف JavaScript** بنجاح باستخدام `node --check`. لم يتم تشغيل الخادم ضد قاعدة بيانات فعلية لأن بيانات الاتصال ليست جزءًا من بيئة اختبار مستقلة.

## الملخص التنفيذي

المشروع يستخدم `multer` للتخزين المحلي، لكن دورة حياة الملف غير محكمة. أهم سببين مباشرين لمشاكل الرفع هما: **تنفيذ Multer قبل Joi validation، ما يسمح بتكوين ملفات orphan عند فشل التحقق**، و**عدم تنظيف الملف الجديد في عدد من مسارات الإنشاء/التعديل عند فشل قاعدة البيانات أو التسجيل**. توجد أيضًا مشكلة تشغيلية مهمة لأن مجلدات الرفع نسبية إلى `process.cwd()`، كما أن التحقق يعتمد على `Content-Type` القادم من العميل فقط.

يوجد كذلك ملف `.env` داخل الأرشيف. حتى دون كشف القيم، يجب اعتبار كل الأسرار الموجودة فيه مكشوفة وإجراء تدوير لها فورًا.

## النتائج ذات الأولوية

| الأولوية | المشكلة | الأثر |
|---|---|---|
| حرجة | الأرشيف يحتوي `.env` بأسرار تشغيلية | احتمال اختراق قاعدة البيانات، JWT، حسابات الإدارة أو WhatsApp إذا تم تداول الأرشيف أو رفعه إلى Git |
| عالية | `multer` يعمل قبل `validate` في عدة مسارات | عند فشل Joi بعد اكتمال الرفع يبقى الملف على القرص بلا سجل في DB |
| عالية | عدم حذف الملف الجديد عند فشل بعض عمليات DB | تراكم ملفات orphan واستهلاك مساحة التخزين |
| عالية | الاعتماد على MIME المرسل من العميل فقط | يمكن رفع محتوى غير مطابق للامتداد/النوع المعلن |
| عالية | مسارات التخزين نسبية | اختلاف `cwd` بين local وPM2/systemd/Docker قد يجعل الرفع ينجح لكن التنزيل أو الحذف يفشل |
| متوسطة | أخطاء رفض النوع ليست `MulterError` ولا تحمل status code | أخطاء نوع الملف قد ترجع 500 بدل 4xx |
| متوسطة | حذف الملف يتم بعد حذف/تحديث السجل دون transaction أو ضمان اتساق | احتمال وجود سجل بلا ملف أو حذف ملف ما زال مستخدمًا إذا فشلت خطوة لاحقة |
| متوسطة | بعض الصور تُخدم Public مع Cache سنة كاملة | الصور الشخصية/المصغرات قد تصبح متاحة لمن يملك الرابط، وتغيير الصورة قد لا يظهر فورًا بسبب cache |
| منخفضة | لا توجد اختبارات تكامل لمسارات multipart | صعوبة اكتشاف مشاكل field names، validation، cleanup، والحدود قبل الإنتاج |

## التفاصيل الفنية

### 1. ترتيب Multer قبل Joi يترك ملفات غير مسجلة

في المسارات التالية يتم حفظ الملف أولًا ثم تشغيل Joi:

- `src/modules/assignments/assignments.routes.js:34-39`
- `src/modules/questions/questions.routes.js:28-33` و `:39-44`
- `src/modules/playlists/playlists.routes.js:21-34`
- `src/modules/videos/videos.routes.js:31-52`

هذا يعني أن طلبًا يحتوي ملفًا صحيحًا لكن `title` أو `grade_id` أو أي حقل آخر غير صحيح سيؤدي إلى رد 400 بعد أن يكون Multer قد كتب الملف بالفعل. في هذه الحالة لا يدخل الطلب إلى controller غالبًا، وبالتالي لا يوجد cleanup.

**الإصلاح المقترح:** استخدم middleware موحدًا يرفع إلى temporary directory، ثم نفّذ validation، وبعد نجاح DB انقل الملف إلى final directory. أو أضف cleanup middleware مخصصًا عند فشل أي middleware لاحق. الأفضل معماريًا: `temp upload -> validate -> DB transaction -> move/promote -> cleanup`.

### 2. عمليات الإنشاء والتعديل لا تنظف الملفات في كل الحالات

- `assignments.controller.js` يستقبل `req.file.path` في الإنشاء، لكن يجب التأكد من حذف الملف إذا فشل `assignmentService.createAssignment` أو `logActivity`.
- مسار تعديل الواجب في `src/modules/assistant/assistant.routes.js:186-189` يستخدم `assignmentUpload`، بينما المسار العام في `src/modules/assignments/assignments.routes.js:45-49` لا يستخدم upload middleware أصلًا. هذا يجعل سلوك API مختلفًا حسب الـ router ويمنع تحديث الملف من المسار العام.
- `playlists.controller.js` يحذف الصورة القديمة بعد نجاح update، لكنه لا يحذف الملف الجديد إذا فشل update أو `logActivity`.
- `videos.controller.js` لا يظهر فيه cleanup للملفات الجديدة في `catch` عند فشل create/update.
- `questions.controller.js` أفضل نسبيًا لأنه ينظف `req.file` داخل `catch`، لكن هذا لا يحل حالة فشل Joi التي تقع قبل controller.
- مسارات bulk Excel تحذف الملف في النجاح والخطأ، وهذا جزء جيد، لكنه يحتاج أيضًا إلى معالجة أخطاء Multer قبل دخول controller.

**الإصلاح المقترح:** إنشاء helper واحد مثل `removeUploadedFiles(req)` يعمل مع `req.file` و`req.files`، واستدعاؤه في كل catch وكل فشل validation. لا تحذف الملف القديم إلا بعد نجاح DB، ولا تعتمد على `logActivity` كخطوة قد تجعل العملية تبدو فاشلة بعد نجاح الحفظ دون استراتيجية تعويض واضحة.

### 3. مسار تحديث الواجب العام لا يدعم رفع ملف

`src/modules/assignments/assignments.routes.js:45-49` يربط `validate(updateAssignmentSchema)` مباشرة بالـ controller ولا يضيف `assignmentUpload.single("file")`. لذلك رفع ملف عند استخدام هذا endpoint لن يصل في `req.file`. بالمقابل، يوجد مسار آخر في `assistant.routes.js:186-189` يضيف middleware، ما يسبب اختلافًا غير متوقع بين الصلاحيات/المسارات.

**الإصلاح المقترح:** توحيد route contract وإضافة middleware في المسار المقصود، أو فصل endpoint واضح لتبديل ملف الواجب. يجب أيضًا تحديث schema لتقبل multipart body بشكل متوقع.

### 4. التحقق من نوع الملف قابل للتجاوز

في `src/middlewares/uploads/baseUpload.js:33-41` و`videoFilesUpload.js:37-59` يتم قبول الملف بناءً على `file.mimetype` فقط. هذه القيمة يرسلها العميل ويمكن تزويرها. كذلك اسم الملف النهائي يبني جزءًا من `originalname` في `baseUpload.js:24-28` و`videoFilesUpload.js:28-32`.

**الإصلاح المقترح:**

1. استخدم allowlist للامتداد بعد تطبيع الاسم، ولا تعتمد على MIME وحده.
2. افحص magic bytes/content signature للصور وPDF وOffice files قبل اعتماد الملف.
3. للصور، أعد ترميزها أو افحصها بمكتبة موثوقة لإزالة payloads غير المرغوبة.
4. لا تستخدم اسم العميل في اسم التخزين؛ استخدم UUID عشوائيًا مع امتداد آمن مستنتج من النوع المفحوص.
5. أضف `limits.files`, `limits.fields`, `limits.parts`, و`limits.fieldSize` حسب كل endpoint، وليس `fileSize` فقط.

### 5. مسارات الملفات تعتمد على مجلد التشغيل

المجلدات معرفة مثل `uploads/assignments` و`uploads/exams` و`uploads/photos` بدون تحويلها إلى absolute path. `express.static` يستخدم `path.join(process.cwd(), ...)` في `src/app.js:113-144`، والحذف يستخدم `path.join(process.cwd(), filePath)` في عدة controllers، بينما التنزيل يستخدم أحيانًا `path.join(__dirname, "../../../", persistedPath)`.

إذا شُغّل التطبيق من مجلد مختلف، قد يتم إنشاء `uploads` خارج المشروع، ثم يفشل التنزيل/الحذف أو يخدم static مجلدًا مختلفًا.

**الإصلاح المقترح:** تعريف `UPLOAD_ROOT` absolute من env أو من `path.resolve(__dirname, "../../uploads")`، وتخزين key نسبي موحد مثل `assignments/<uuid>.pdf` لا مسار filesystem مختلطًا. استخدم helper مركزيًا للتحويل من key إلى path مع منع path traversal.

### 6. أخطاء الرفع ترجع status غير مناسب

في `src/middlewares/error.middleware.js:33-41` تتم معالجة `MulterError` فقط. لكن `fileFilter` يستدعي `cb(new Error(...))` عاديًا، لذلك رفض النوع قد يصل كـ 500. كما أن `LIMIT_FILE_SIZE` يرجع 400، والأفضل 413.

يوجد أيضًا نص إنجليزي داخل رسالة عربية في السطر 37: `حجم الملف exceeds الحد المسموح`.

**الإصلاح المقترح:** تعريف أخطاء مخصصة مثل `InvalidFileTypeError` مع status 415، و`LIMIT_FILE_SIZE` مع 413، وإرجاع رسائل موحدة بالعربية/الإنجليزية حسب API contract.

### 7. الاتساق بين قاعدة البيانات والملفات غير مضمون

الملفات تُحفظ على القرص، ثم تُحفظ path في DB، ثم يتم حذف القديم أو الملف بعد ذلك. لا توجد transaction/compensation واضحة تغطي DB وfilesystem معًا. لذلك أي فشل بين الخطوتين ينتج أحد السيناريوهات التالية:

- ملف موجود بلا سجل DB.
- سجل DB يشير إلى ملف غير موجود.
- ملف قديم تم حذفه قبل اكتمال العملية الجديدة.

**الإصلاح المقترح:** استخدم state machine بسيطًا أو transaction مع حالة `pending/active/failed`، وjob تنظيف دوري للملفات غير المرتبطة. وفي update: ارفع الجديد إلى temp، حدّث DB، ثم promote الجديد، وبعد النجاح احذف القديم asynchronously.

### 8. الملفات العامة والخصوصية والكاش

في `src/app.js:109-144` يتم تقديم thumbnails وvideoFiles وphotos عبر `express.static` مع `Access-Control-Allow-Origin: *` و`Cache-Control: public, max-age=31536000`. هذا مناسب فقط إن كانت كل الملفات عامة فعلًا. صور profiles قد تكون بيانات شخصية، وcache لمدة سنة قد يجعل الصورة القديمة مستمرة بعد التحديث.

**الإصلاح المقترح:** جعل الملفات الخاصة تُقدّم عبر endpoint مصادق عليه أو signed URLs قصيرة العمر. للملفات العامة استخدم أسماء immutable UUID، وعند الحاجة أضف versioning بدل الاعتماد على نفس URL.

### 9. الأسرار داخل الأرشيف

تم العثور على `.env` في جذر المشروع، و`.gitignore` يحتوي قاعدة تمنع `.env` عادةً، لكن وجوده داخل الأرشيف يعني أنه تم تضمينه بالفعل. لا أدرج القيم في هذا التقرير.

**الإجراء الفوري:** تدوير `JWT_SECRET`، بيانات DB، API credentials، بيانات Super Admin، وWhatsApp secrets، ثم حذف `.env` من أي repository/history أو artifacts مشتركة. أضف `.env.example` بقيم placeholder فقط، وافرض فحص secret scanning في CI.

### 10. فحص التبعيات

`npm audit --omit=dev` أبلغ عن **5 ثغرات** في شجرة الإنتاج: 1 منخفضة، 1 متوسطة، و3 عالية. يجب تشغيل `npm audit` مع تحديثات متحكم فيها، ثم اختبار التطبيق خصوصًا حزم `express`, `multer`, `xlsx`, وdependencies العابرة قبل النشر.

## ما تم التحقق منه

- **205** ملف JavaScript اجتاز `node --check`.
- تم تتبع routes التي تستخدم `single`, `fields` ورفع Excel/صور/ملفات الأسئلة/الواجبات/الفيديوهات.
- تم تتبع مسارات `req.file`, `req.files`, الحذف، والتنزيل.
- تم فحص static serving وerror handler و`package.json` و`.env` و`.gitignore`.
- لم يتم اعتبار نجاح syntax دليلًا على سلامة runtime أو صحة تكامل PostgreSQL.

## خطة إصلاح عملية بالترتيب

1. **فورًا:** تدوير كل الأسرار وإزالة `.env` من الأرشيف/repository.
2. توحيد `UPLOAD_ROOT` absolute وhelper مركزي للتخزين/الحذف/التنزيل.
3. إضافة upload lifecycle موحد مع temporary files وcleanup عند فشل validation أو DB.
4. إضافة middleware الرفع المفقود لمسار تحديث assignment وتوحيد routes.
5. استبدال MIME-only validation بفحص content signature، UUID filenames، وlimits كاملة.
6. تعديل error handler إلى 415 للنوع و413 للحجم.
7. تحديد أي الملفات public وأيها private، وإزالة `public max-age=31536000` من الملفات الشخصية.
8. إضافة اختبارات تكامل multipart تغطي: نجاح الرفع، نوع غير مسموح، حجم زائد، body غير صحيح، فشل DB، تحديث ملف، حذف سجل، واختلاف `cwd`.
9. تشغيل cleanup job للملفات غير المرتبطة ومراجعة نتائج `npm audit`.

## الحكم النهائي

**المشروع قابل للإصلاح، لكن مسار رفع الملفات غير جاهز للاعتماد الإنتاجي بصورته الحالية.** أكثر سبب مرجح للمشكلة التي يراها المستخدم هو اختلاف route behavior مع ترتيب `multer -> Joi`، إلى جانب المسارات النسبية وتسرب الملفات عند فشل validation أو DB. إصلاح lifecycle والـ absolute paths والـ error mapping سيعالج الجزء الأكبر من مشاكل الرفع قبل الانتقال إلى التخزين الخارجي مثل S3 أو خدمة media مخصصة.
