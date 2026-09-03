#!/usr/bin/env node
/**
 * SendMultiple - متن و خط فرستنده جدا برای هر گیرنده.
 *
 * برای پیام‌های شخصی‌سازی‌شده که با یک قالب ثابت پوشش داده نمی‌شوند. برخلاف
 * SendBulk، اینجا Text و Sender در سطح هر گیرنده تعریف می‌شوند.
 *
 * جز خود Node به چیزی وابسته نیست. کپی کنید و در پروژه خودتان اجرا کنید.
 *
 *   PAYAM_RESAN_API_KEY=... PAYAM_RESAN_SENDER=... node examples/v3/send-multiple.mjs
 */

// docs:start
const sender = Number(process.env.PAYAM_RESAN_SENDER);

const payload = {
  ApiKey: process.env.PAYAM_RESAN_API_KEY,
  Recipients: [
    {
      Sender: sender,
      Destination: 9121112222,
      Text: 'آقای محمدی، سفارش شما ارسال شد.',
      UserTraceId: 1001,
    },
    {
      Sender: sender,
      Destination: 9121113333,
      Text: 'خانم رضایی، سفارش شما ارسال شد.',
      UserTraceId: 1002,
    },
  ],
};

const answer = await fetch('https://api.sms-webservice.com/api/V3/SendMultiple', {
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
