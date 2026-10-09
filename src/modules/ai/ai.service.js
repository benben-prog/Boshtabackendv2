const fs = require("fs");
const path = require("path");
const axios = require("axios");
const env = require("../../config/env");
const aiQueries = require("./ai.queries");
const { getSystemPrompt } = require("./ai.prompts");
const { resolveStoredPath } = require("../../utils/fileStorage");
const {
  assistantFunctionDeclarations,
  executeAssistantTool,
} = require("./tools/assistant.tools");

const FALLBACK_MODELS = [
  env.GEMINI_MODEL || "gemini-flash-lite-latest",
  "gemini-flash-lite-latest",
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash-lite",
  "gemini-3.7-flash",
  "gemini-3.6-flash",
];

const getApiKeys = () => {
  const raw = env.GEMINI_API_KEY || "";
  return raw
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
};

const aiService = {
  // 1. Get current usage quota
  getQuota: async (userType, userId) => {
    const usage = await aiQueries.getTodayUsage(userType, userId);
    const messagesUsed = usage ? Number(usage.message_count) : 0;
    const filesUsed = usage ? Number(usage.file_count) : 0;

    const messageLimit = env.AI_DAILY_MESSAGE_LIMIT;
    const fileLimit = env.AI_DAILY_FILE_LIMIT;

    // Resets at next midnight
    const tomorrow = new Date();
    tomorrow.setHours(24, 0, 0, 0);

    return {
      messages: {
        used: messagesUsed,
        limit: messageLimit,
        remaining: Math.max(0, messageLimit - messagesUsed),
      },
      files: {
        used: filesUsed,
        limit: fileLimit,
        remaining: Math.max(0, fileLimit - filesUsed),
      },
      resets_at: tomorrow.toISOString(),
    };
  },

  // 2. Send message to AI, handle tools, and receive reply
  sendMessage: async ({ userType, userId, messageText, file = null }) => {
    const text = (messageText || "").trim();
    if (!text && !file) {
      const error = new Error("يرجى إرسال رسالة نصية أو ملف");
      error.statusCode = 400;
      throw error;
    }

    // A. Check daily quotas
    const usage = await aiQueries.getTodayUsage(userType, userId);
    const messagesUsed = usage ? Number(usage.message_count) : 0;
    const filesUsed = usage ? Number(usage.file_count) : 0;

    if (messagesUsed >= env.AI_DAILY_MESSAGE_LIMIT) {
      const error = new Error(
        `لقد استنفدت الحد اليومي المسموح به من الرسائل (${env.AI_DAILY_MESSAGE_LIMIT} رسالة). يتجدد رصيدك تلقائياً مع بداية اليوم الجديد.`,
      );
      error.statusCode = 429;
      throw error;
    }

    if (file && filesUsed >= env.AI_DAILY_FILE_LIMIT) {
      const error = new Error(
        `لقد استنفدت الحد اليومي المسموح به لرفع الملفات (${env.AI_DAILY_FILE_LIMIT} ملفات). يمكنك مواصلة المحادثة نصياً أو الانتظار حتى الغد.`,
      );
      error.statusCode = 429;
      throw error;
    }

    // B. Build user identity context
    let userContext = {};
    if (userType === "student") {
      const student = await aiQueries.getStudentContext(userId);
      if (student) {
        userContext = {
          userName: student.full_name,
          gradeName: student.grade_name,
          groupName: student.group_name,
          barcode: student.barcode,
          userPhone: student.phone,
        };
      }
    } else {
      const user = await aiQueries.getUserContext(userId);
      if (user) {
        userContext = {
          userName: user.full_name,
          userPhone: user.phone,
          permissions:
            user.permissions === "all"
              ? "إدارة السنتر والأونلاين كاملة"
              : user.permissions,
        };
      }
    }

    const systemPromptText = getSystemPrompt(userType, userContext);

    // C. Read file if provided (PDF or image)
    let filePart = null;
    let fileName = null;
    let filePath = null;
    let fileMimeType = null;

    if (file) {
      fileName = file.originalname;
      filePath = file.path;
      fileMimeType = file.mimetype;

      const diskPath = resolveStoredPath(file.path) || file.path;
      if (fs.existsSync(diskPath)) {
        const fileBuffer = fs.readFileSync(diskPath);
        const base64Data = fileBuffer.toString("base64");
        filePart = {
          inline_data: {
            mime_type: file.mimetype,
            data: base64Data,
          },
        };
      }
    }

    // D. Build recent conversation history for Gemini context (last 10 messages)
    const recentMessages = await aiQueries.getRecentContext(userType, userId, 10);
    const contents = [];

    for (const msg of recentMessages) {
      contents.push({
        role: msg.role === "model" ? "model" : "user",
        parts: [{ text: msg.message }],
      });
    }

    // E. Build current user turn parts
    const currentParts = [];
    if (text) {
      currentParts.push({ text });
    } else if (file) {
      currentParts.push({
        text: "يرجى قراءة وتحليل هذا الملف المرفق وشرحه أو تلخيصه أو صياغة المطلوب منه وفقاً لتعليماتك.",
      });
    }

    if (filePart) {
      currentParts.push(filePart);
    }

    contents.push({
      role: "user",
      parts: currentParts,
    });

    // F. Tools setup (Enable assistant tools for assistant or teacher)
    const tools = [];
    if (userType === "assistant" || userType === "teacher") {
      tools.push({
        functionDeclarations: assistantFunctionDeclarations,
      });
    }

    // G. Call Gemini with fallback models & Function Calling execution loop
    const apiKeys = getApiKeys();
    if (apiKeys.length === 0) {
      const error = new Error("مفتاح Gemini API غير مهيأ في الخادم");
      error.statusCode = 500;
      throw error;
    }

    let responseText = "";
    let lastError = null;

    for (const model of FALLBACK_MODELS) {
      for (const apiKey of apiKeys) {
        try {
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

          let currentTurnContents = [...contents];
          let functionCallsCount = 0;
          const maxFunctionCalls = 3;

          while (functionCallsCount < maxFunctionCalls) {
            const payload = {
              system_instruction: {
                parts: [{ text: systemPromptText }],
              },
              contents: currentTurnContents,
              generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 8192,
              },
            };

            if (tools.length > 0) {
              payload.tools = tools;
            }

            const res = await axios.post(url, payload, { timeout: 35000 });
            const candidateParts = res.data?.candidates?.[0]?.content?.parts || [];

            // Check if Gemini returned functionCall parts (supports parallel function calling)
            const functionCallParts = candidateParts.filter((p) => p.functionCall);

            if (functionCallParts.length > 0) {
              functionCallsCount++;

              // Append model turn with all candidate parts (including all function calls & signatures)
              currentTurnContents.push({
                role: "model",
                parts: candidateParts,
              });

              // Execute all tool calls and build responses for all of them
              const functionResponseParts = [];
              for (const part of functionCallParts) {
                const fnCall = part.functionCall;
                const fnName = fnCall.name;
                const fnArgs = fnCall.args || {};

                let fnResult;
                try {
                  fnResult = await executeAssistantTool(fnName, fnArgs, {
                    userId,
                    permissions: userContext.permissions,
                  });
                } catch (toolExecErr) {
                  console.error(`Tool execution exception in [${fnName}]:`, toolExecErr.message);
                  fnResult = {
                    success: false,
                    error: `تعذر إتمام العملية: ${toolExecErr.message}`,
                  };
                }

                functionResponseParts.push({
                  functionResponse: {
                    name: fnName,
                    response: fnResult,
                  },
                });
              }

              // Append user turn with all function responses
              currentTurnContents.push({
                role: "user",
                parts: functionResponseParts,
              });

              // Loop to let Gemini interpret all results and respond
              continue;
            }

            // If text was returned, extract it
            const textPart = candidateParts.find((p) => p.text);
            if (textPart?.text) {
              responseText = textPart.text;
              break;
            }

            break;
          }

          if (responseText) {
            break; // Success with current key & model!
          }
        } catch (err) {
          lastError = err;
          console.warn(
            `[AI Gateway] Model ${model} failed:`,
            err.response?.data?.error?.message || err.message,
          );
        }
      }

      if (responseText) {
        break; // Success! Exit outer loop
      }
    }

    if (!responseText) {
      const isUpstreamRateLimit = lastError?.response?.status === 429;
      const errorMessage = isUpstreamRateLimit
        ? "خوادم الذكاء الاصطناعي تشهد ضغطاً مؤقتاً حالياً، يرجى الانتظار بضع ثوانٍ وإعادة المحاولة."
        : lastError?.response?.data?.error?.message ||
          "تعذر الحصول على رد من خدمة الذكاء الاصطناعي حالياً، يرجى المحاولة بعد قليل.";
      const error = new Error(errorMessage);
      // We explicitly set 503 (NOT 429) so frontend never misinterprets Google quota as user message quota!
      error.statusCode = isUpstreamRateLimit
        ? 503
        : lastError?.response?.status || 502;
      throw error;
    }

    // H. Save user message and model response to history
    const userMsgToSave =
      text || (fileName ? `[ملف مرفق: ${fileName}]` : "ملف مرفق");
    await aiQueries.insertMessage({
      userType,
      userId,
      role: "user",
      message: userMsgToSave,
      fileName,
      filePath,
      fileMimeType,
    });

    const modelMsg = await aiQueries.insertMessage({
      userType,
      userId,
      role: "model",
      message: responseText,
    });

    // I. Increment daily usage quota
    const updatedUsage = await aiQueries.incrementUsage(
      userType,
      userId,
      1,
      file ? 1 : 0,
    );

    const messageLimit = env.AI_DAILY_MESSAGE_LIMIT;
    const fileLimit = env.AI_DAILY_FILE_LIMIT;
    const tomorrow = new Date();
    tomorrow.setHours(24, 0, 0, 0);

    return {
      reply: responseText,
      message_id: modelMsg.id,
      has_file: !!file,
      file_name: fileName,
      quota: {
        messages: {
          used: Number(updatedUsage.message_count),
          limit: messageLimit,
          remaining: Math.max(
            0,
            messageLimit - Number(updatedUsage.message_count),
          ),
        },
        files: {
          used: Number(updatedUsage.file_count),
          limit: fileLimit,
          remaining: Math.max(0, fileLimit - Number(updatedUsage.file_count)),
        },
        resets_at: tomorrow.toISOString(),
      },
    };
  },

  // 3. Get chat history
  getHistory: async (userType, userId) => {
    return await aiQueries.getHistory(userType, userId, 50);
  },

  // 4. Clear chat history (New Chat)
  clearHistory: async (userType, userId) => {
    return await aiQueries.clearHistory(userType, userId);
  },
};

module.exports = aiService;
