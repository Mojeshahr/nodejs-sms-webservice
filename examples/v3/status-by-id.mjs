#!/usr/bin/env node
/**
 * StatusById - وضعیت پیامک با شناسه‌هایی که متد ارسال برگردانده است.
 *
 * دسته‌ای بپرسید، نه یکی‌یکی. فاصله استعلام‌ها را هم کمتر از چند دقیقه
 * نگذارید، وگرنه به خطای ۲۰ می‌خورید.
 *
 * جز خود Node به چیزی وابسته نیست. کپی کنید و در پروژه خودتان اجرا کنید.
 *
 *   PAYAM_RESAN_API_KEY=... node examples/v3/status-by-id.mjs
 */

// docs:start
const payload = {
  ApiKey: process.env.PAYAM_RESAN_API_KEY,
  Ids: [9903211, 9903212],
};

const answer = await fetch('https://api.sms-webservice.com/api/V3/StatusById', {
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

// شرط را روی StatusCode بگذارید، نه روی متن Status. این پنج کد یعنی هنوز در
// راه است و باید بعداً دوباره استعلام کنید، نه اینکه دوباره بفرستید.
const pending = new Set([0, 1, 2, 3, 10]);

for (const message of response.Result) {
  const again = pending.has(message.StatusCode) ? ' (بعداً دوباره بپرسید)' : '';
  console.log(`${message.Id}: ${message.Status}${again}`);
}
// docs:end
