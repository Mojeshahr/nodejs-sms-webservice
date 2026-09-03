#!/usr/bin/env node
/**
 * SendBulk - یک متن به چند گیرنده، هر کدام با شناسه پی‌گیری خودتان.
 *
 * روش پیشنهادی برای ارسال عملیاتی. کلید در بدنه درخواست می‌رود نه در نشانی،
 * و برای هر گیرنده UserTraceId می‌پذیرد تا گزارش تحویل را بدون نگه‌داشتن Id
 * سامانه بگیرید.
 *
 * جز خود Node به چیزی وابسته نیست. کپی کنید و در پروژه خودتان اجرا کنید.
 *
 *   PAYAM_RESAN_API_KEY=... PAYAM_RESAN_SENDER=... node examples/v3/send-bulk.mjs
 */

// docs:start
const payload = {
  ApiKey: process.env.PAYAM_RESAN_API_KEY,
  Sender: Number(process.env.PAYAM_RESAN_SENDER),
  Text: 'سفارش شما ثبت شد.',
  Recipients: [
    { Destination: 9121112222, UserTraceId: 1001 },
    { Destination: 9121113333, UserTraceId: 1002 },
  ],
};

const answer = await fetch('https://api.sms-webservice.com/api/V3/SendBulk', {
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
  console.log(`${message.UserTraceId} => شناسه ${message.Id}`);
}
// docs:end
