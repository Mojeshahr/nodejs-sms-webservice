#!/usr/bin/env node
/**
 * TokenList - قالب‌های حساب، با کلید و متن و وضعیت تأییدشان.
 *
 * برای پیدا کردن TemplateKey که متدهای ارسال قالب لازم دارند. این متد هم مثل
 * AccountInfo از بررسی اعتبار معاف است.
 *
 * روی سرور آزمایشی پیاده نشده و ۴۰۴ می‌دهد؛ همین متد را از سرور عملیاتی
 * صدا بزنید، چیزی نمی‌فرستد و اعتباری مصرف نمی‌کند.
 *
 * جز خود Node به چیزی وابسته نیست. کپی کنید و در پروژه خودتان اجرا کنید.
 *
 *   PAYAM_RESAN_API_KEY=... node examples/v3/token-list.mjs
 */

// docs:start
const payload = { ApiKey: process.env.PAYAM_RESAN_API_KEY };

const answer = await fetch('https://api.sms-webservice.com/api/V3/TokenList', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(payload),
  signal: AbortSignal.timeout(30_000),
});

const response = await answer.json();

if (!response.Success) {
  console.error(`ناموفق. کد ${response.ErrorCode}: ${response.Error}`);
  process.exit(1);
}

for (const template of response.Result) {
  const sendable = template.Status === 2 ? 'قابل ارسال' : 'قابل ارسال نیست';
  console.log(`${template.Key} (${sendable}): ${template.TextTemplate}`);
}
// docs:end
