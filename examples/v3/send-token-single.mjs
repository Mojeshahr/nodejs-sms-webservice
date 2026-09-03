#!/usr/bin/env node
/**
 * SendTokenSingle - ارسال قالب به یک شماره، با بدنه JSON.
 *
 * مسیر معمول رمز یک‌بارمصرف. خط فرستنده ورودی ندارد؛ سامانه آن را از روی خود
 * قالب برمی‌دارد. همین واریانت POST را به کار ببرید، نه GET: در GET هم کلید
 * حساب و هم خود رمز داخل نشانی و لاگ وب‌سرور می‌نشینند.
 *
 * جز خود Node به چیزی وابسته نیست. کپی کنید و در پروژه خودتان اجرا کنید.
 *
 *   PAYAM_RESAN_API_KEY=... node examples/v3/send-token-single.mjs
 */

// docs:start
const payload = {
  ApiKey: process.env.PAYAM_RESAN_API_KEY,
  TemplateKey: 'verifycode',
  Destination: 9121112222,
  p1: '123456',
};

const answer = await fetch('https://api.sms-webservice.com/api/V3/SendTokenSingle', {
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

// این متد UserTraceId در ورودی ندارد، پس در پاسخ null برمی‌گردد. اگر شناسه
// پی‌گیری لازم دارید، SendTokenMulti را حتی برای یک گیرنده هم می‌شود به کار برد.
for (const message of response.Result) {
  console.log(`شناسه ${message.Id} از خط ${message.Sender}`);
  console.log(`متن نهایی: ${message.FinalText}`);
}
// docs:end
