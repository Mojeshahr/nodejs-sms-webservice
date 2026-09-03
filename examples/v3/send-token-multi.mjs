#!/usr/bin/env node
/**
 * SendTokenMulti - یک قالب، چند گیرنده، مقادیر متفاوت.
 *
 * پارامترها اینجا آرایه‌اند، نه p1 تا p10. درایه اول به {1} می‌نشیند، دومی به
 * {2} و همین‌طور تا آخر: ترتیب از شماره جای‌گاه می‌آید، نه از جایی که در متن
 * قالب دیده می‌شود.
 *
 * جز خود Node به چیزی وابسته نیست. کپی کنید و در پروژه خودتان اجرا کنید.
 *
 *   PAYAM_RESAN_API_KEY=... node examples/v3/send-token-multi.mjs
 */

// docs:start
// قالب نمونه: «مرسوله شما از {2} تحویل پست شد. بارکد مرسوله پستی: {1}»
const payload = {
  ApiKey: process.env.PAYAM_RESAN_API_KEY,
  TemplateKey: 'postcode',
  Recipients: [
    {
      Destination: 9121112222,
      UserTraceId: 1001,
      Parameters: ['BARCODE-AAA', 'شیراز'],
    },
    {
      Destination: 9121113333,
      UserTraceId: 1002,
      Parameters: ['BARCODE-BBB', 'تبریز'],
    },
  ],
};

const answer = await fetch('https://api.sms-webservice.com/api/V3/SendTokenMulti', {
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
  console.log(`${message.UserTraceId} => ${message.FinalText}`);
}
// docs:end
