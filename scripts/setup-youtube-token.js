const readline = require("readline");
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const env = require("../src/config/env");
const googleAuth = require("../src/utils/googleAuth");
const { query } = require("../src/config/database");

async function main() {
  console.log("\n============================================================");
  console.log("🎬 سكريبت ربط قناة يوتيوب المركزية للمنصة (YouTube OAuth Setup)");
  console.log("============================================================\n");

  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    console.error("❌ خطأ: GOOGLE_CLIENT_ID أو GOOGLE_CLIENT_SECRET غير موجودين في ملف .env");
    process.exit(1);
  }

  const redirectUri = env.GOOGLE_REDIRECT_URI || "https://backend.benb3n.cloud/api/teacher/google/callback";

  const oauth2Client = new google.auth.OAuth2(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    redirectUri
  );

  const authUrl = googleAuth.generateYouTubeAuthUrl(null, 1);

  console.log("📌 الطريقة الأولى (الأسهل والأسرع):");
  console.log("افتح الرابط التالي في المتصفح، وسجل الدخول بحساب القناة واضغط 'Allow/سماح'.");
  console.log("سيقوم السيرفر تلقائياً بحفظ وتحديث التوكن الجديد وعرض صفحة نجاح خضراء!\n");
  console.log("------------------------------------------------------------");
  console.log(authUrl);
  console.log("------------------------------------------------------------\n");

  console.log("📌 الطريقة الثانية (عبر سطر الأوامر):");
  console.log("إذا أردت إتمام الربط من هنا، بعد الضغط على 'سماح'، انسخ الرابط كاملاً من شريط عنوان المتصفح أو كود code والصقه بالأسفل:\n");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question("📋 الصق الرابط أو الكود هنا (أو اضغط Enter إذا تم الربط بنجاح عبر المتصفح): ", async (input) => {
    rl.close();
    try {
      let code = input.trim();
      if (!code) {
        console.log("\n⏳ جاري التحقق من حالة القناة والتوكن في النظام...");
        try {
          const { getChannelInfo } = require("../src/modules/videos/youtube.service");
          const info = await getChannelInfo();
          if (info.is_connected) {
            console.log("\n✅ القناة متصلة وشغالة بنجاح!");
            console.log(`📺 اسم القناة: ${info.title}`);
            console.log(`📊 عدد الفيديوهات: ${info.video_count}`);
            process.exit(0);
          } else {
            console.log("\n⚠️ لم يتم الربط بعد:", info.message);
          }
        } catch (err) {
          console.log("\n⚠️ التوكن غير متصل أو منتهي:", err.message);
        }
        return;
      }

      if (code.includes("code=")) {
        const urlParams = new URL(code.startsWith("http") ? code : `https://dummy.com/${code}`).searchParams;
        code = urlParams.get("code") || code;
      }

      console.log("\n⏳ جاري التحقق من الكود واستخراج التوكن من Google...");
      const { tokens } = await oauth2Client.getToken(code);

      if (!tokens.refresh_token) {
        console.warn("\n⚠️ تنبيه: جوجل لم يُرجع refresh_token جديد، قد يكون الحساب تم إعطاء الصلاحية له مسبقاً.");
        console.warn("إذا كان لديك Refresh Token سابق يمكنك استخدامه، أو ألغِ صلاحية التطبيق من https://myaccount.google.com/permissions ثم أعد تشغيل السكريبت.");
      }

      // حفظ التوكن عبر الخدمة المركزية في .env وقاعدة البيانات
      await googleAuth.saveYouTubeToken(tokens, 1);

      // تحقق من القناة عبر التوكن
      oauth2Client.setCredentials(tokens);
      const youtube = google.youtube({ version: "v3", auth: oauth2Client });
      
      const channelRes = await youtube.channels.list({
        part: ["snippet", "statistics"],
        mine: true
      });

      const channel = channelRes.data.items && channelRes.data.items[0];
      if (channel) {
        console.log("\n✅ تم الاتصال بالقناة بنجاح!");
        console.log(`📺 اسم القناة: ${channel.snippet.title}`);
        console.log(`🆔 معرف القناة: ${channel.id}`);
        console.log(`📊 عدد الفيديوهات: ${channel.statistics.videoCount}`);
      } else {
        console.log("\n⚠️ الحساب متصل ولكن لم يتم العثور على قناة يوتيوب مفعلة به.");
      }

      console.log("💾 تم حفظ وتحديث توكن القناة بنجاح في ملف .env وقاعدة البيانات!");
      console.log("\n🎉 اكتمل الإعداد بنجاح! الآن السيرفر جاهز تماماً لرفع الفيديوهات مباشرة للقناة.\n");
      process.exit(0);
    } catch (err) {
      console.error("\n❌ حدث خطأ أثناء التوثيق:", err.message);
      process.exit(1);
    }
  });
}

main().catch(console.error);
