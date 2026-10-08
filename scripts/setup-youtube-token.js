const readline = require("readline");
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const env = require("../src/config/env");

async function main() {
  console.log("\n============================================================");
  console.log("🎬 سكريبت ربط قناة يوتيوب المركزية للمنصة (One-Time Setup)");
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

  const scopes = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube.readonly",
    "https://www.googleapis.com/auth/youtube",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile"
  ];

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes
  });

  console.log("📌 الخطوة 1: افتح الرابط التالي في المتصفح:");
  console.log("👉 سجل الدخول بحساب الجيميل: abdelrhmanmagdy123456789@gmail.com واضغط 'سماح / Allow':\n");
  console.log("------------------------------------------------------------");
  console.log(authUrl);
  console.log("------------------------------------------------------------\n");
  console.log("📌 الخطوة 2: بعد الضغط على 'سماح'، سينقلك المتصفح إلى رابط Callback.");
  console.log("انسخ الرابط كاملاً من شريط عنوان المتصفح (أو انسخ كود الـ code فقط) والصقه هنا بالأسفل:\n");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question("📋 الصق الرابط أو الكود هنا: ", async (input) => {
    rl.close();
    try {
      let code = input.trim();
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

      const refreshToken = tokens.refresh_token;

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

      if (refreshToken) {
        // حفظ التوكن في .env
        const envPath = path.join(__dirname, "../.env");
        let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf-8") : "";

        if (envContent.includes("YOUTUBE_REFRESH_TOKEN=")) {
          envContent = envContent.replace(
            /YOUTUBE_REFRESH_TOKEN=.*/g,
            `YOUTUBE_REFRESH_TOKEN=${refreshToken}`
          );
        } else {
          envContent += `\n# YouTube Central Channel Token\nYOUTUBE_REFRESH_TOKEN=${refreshToken}\n`;
        }

        fs.writeFileSync(envPath, envContent, "utf-8");
        console.log("💾 تم حفظ YOUTUBE_REFRESH_TOKEN في ملف .env بنجاح!");
      }

      console.log("\n🎉 اكتمل الإعداد بنجاح! الآن السيرفر جاهز تماماً لرفع الفيديوهات مباشرة للقناة.\n");
    } catch (err) {
      console.error("\n❌ حدث خطأ أثناء التوثيق:", err.message);
    }
  });
}

main().catch(console.error);
