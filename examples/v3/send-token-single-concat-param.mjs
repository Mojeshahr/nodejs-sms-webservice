#!/usr/bin/env node
/**
 * SendTokenSingleConcatParam - مقدارهای قالب با جداکننده ; در رشته p.
 *
 * مسیر معمول رمز یک‌بارمصرف. خط فرستنده ورودی ندارد؛ سامانه آن را از روی خود
 * قالب برمی‌دارد. همین واریانت POST را به کار ببرید، نه GET: در GET هم کلید
 * حساب و هم خود رمز داخل نشانی و لاگ وب‌سرور می‌نشینند.
 *
 * جز خود Node به چیزی وابسته نیست. کپی کنید و در پروژه خودتان اجرا کنید.
 *
 *   PAYAM_RESAN_API_KEY=... node examples/v3/send-token-single-concat-param.mjs
 */

// docs:start
const payload = {
  ApiKey: process.env.PAYAM_RESAN_API_KEY,
  TemplateKey: 'postcode',
  Destination: 9121112222,
  // مقدار اول برای {1} و مقدار دوم برای {2} است.
  p: 'BARCODE-AAA;شیراز',
};

const answer = await fetch('https://www.payam-resan.com/api/V3/SendTokenSingleConcatParam', {
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

// این متد در ورودی UserTraceId ندارد؛ فیلد پاسخ UserTraceId nullable است و مقدارش را سرویس تعیین می‌کند. اگر شناسه
// پی‌گیری لازم دارید، SendTokenMulti را حتی برای یک گیرنده هم می‌شود به کار برد.
for (const message of response.Result) {
  console.log(`شناسه ${message.Id} از خط ${message.Sender}`);
  console.log(`متن نهایی: ${message.FinalText ?? ''}`);
}
// docs:end
