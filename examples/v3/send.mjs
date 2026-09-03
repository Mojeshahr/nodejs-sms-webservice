#!/usr/bin/env node
/**
 * Send - ساده‌ترین ارسال، یک متن به چند شماره با یک درخواست GET.
 *
 * برای آزمایش سریع خوب است. در محیط عملیاتی SendBulk را بردارید: کلید را از
 * نشانی بیرون می‌برد و برای هر گیرنده شناسه پی‌گیری می‌پذیرد.
 *
 * جز خود Node به چیزی وابسته نیست. کپی کنید و در پروژه خودتان اجرا کنید.
 *
 *   PAYAM_RESAN_API_KEY=... PAYAM_RESAN_SENDER=... node examples/v3/send.mjs
 */

// docs:start
const query = new URLSearchParams({
  ApiKey: process.env.PAYAM_RESAN_API_KEY,
  Sender: process.env.PAYAM_RESAN_SENDER,
  Text: 'کد تأیید شما ۱۲۳۴۵۶ است',
  Recipients: '9121112222,9121113333',
});

// URLSearchParams دقیقاً یک بار encode می‌کند. اگر متن را خودتان هم پیش از
// این encodeURIComponent کنید، پیامک با نویسه‌های %D8 به گوشی می‌رسد.
const url = `https://api.sms-webservice.com/api/V3/Send?${query}`;

const answer = await fetch(url, { signal: AbortSignal.timeout(30_000) });
const response = await answer.json();

if (!response.Success) {
  console.error(`ناموفق. کد ${response.ErrorCode}: ${response.Error}`);
  process.exit(1);
}

for (const message of response.Result) {
  console.log(`شناسه ${message.Id}`);
}
// docs:end
