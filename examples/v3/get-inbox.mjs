#!/usr/bin/env node
/**
 * GetInbox - پیامک‌هایی که کاربران به خطوط حساب شما فرستاده‌اند.
 *
 * این یک استعلام است، نه webhook: سامانه چیزی به سرور شما نمی‌فرستد و باید
 * خودتان دوره‌ای صدایش بزنید. فاصله را کمتر از چند دقیقه نگذارید، وگرنه به
 * خطای ۲۰ می‌خورید.
 *
 * جز خود Node به چیزی وابسته نیست. کپی کنید و در پروژه خودتان اجرا کنید.
 *
 *   PAYAM_RESAN_API_KEY=... node examples/v3/get-inbox.mjs
 */

// docs:start
const payload = { ApiKey: process.env.PAYAM_RESAN_API_KEY };

const answer = await fetch('https://api.sms-webservice.com/api/V3/GetInbox', {
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

for (const sms of response.Result) {
  // نام فیلد فرستنده در خود سرویس Form است، نه From. دنبال From نگردید.
  console.log(`${sms.Time}  ${sms.Form} -> ${sms.To}: ${sms.Text}`);
}
// docs:end
