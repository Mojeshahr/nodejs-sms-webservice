#!/usr/bin/env node
/**
 * StatusByUserTraceId - وضعیت پیامک با شناسه‌هایی که خودتان داده‌اید.
 *
 * اگر UserTraceId را کلید رکورد پایگاه داده خودتان بگذارید، دیگر لازم نیست Id
 * سامانه را ذخیره کنید. این متد راه امن تشخیص ارسال تکراری هم هست: بعد از قطع
 * ارتباط، اول اینجا بپرسید ثبت شده یا نه.
 *
 * جز خود Node به چیزی وابسته نیست. کپی کنید و در پروژه خودتان اجرا کنید.
 *
 *   PAYAM_RESAN_API_KEY=... node examples/v3/status-by-user-trace-id.mjs
 */

// docs:start
const payload = {
  ApiKey: process.env.PAYAM_RESAN_API_KEY,
  UserTraceIds: [1001, 1002],
};

const answer = await fetch('https://api.sms-webservice.com/api/V3/StatusByUserTraceId', {
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

for (const message of response.Result) {
  // کد ۸ یعنی این شناسه در حساب شما نیست. بعد از یک timeout، همین یعنی
  // ارسال ثبت نشده و می‌توانید با خیال راحت دوباره بفرستید.
  if (message.StatusCode === 8) {
    console.log(`${message.UserTraceId}: ثبت نشده`);
    continue;
  }

  console.log(`${message.UserTraceId}: ${message.Status}`);
}
// docs:end
