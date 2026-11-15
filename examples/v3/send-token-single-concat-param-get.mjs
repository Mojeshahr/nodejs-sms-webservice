#!/usr/bin/env node
/**
 * SendTokenSingleConcatParam با GET - مقدارهای قالب در رشته p داخل نشانی.
 *
 * برای آزمایش دستی مناسب است، برای محیط عملیاتی نه: در GET هم کلید حساب و هم
 * مقدار رمز یک‌بارمصرف داخل نشانی می‌نشینند و در لاگ وب‌سرور و هدر Referer
 * ثبت می‌شوند. واریانت POST را بردارید.
 *
 * جز خود Node به چیزی وابسته نیست. کپی کنید و در پروژه خودتان اجرا کنید.
 *
 *   PAYAM_RESAN_API_KEY=... node examples/v3/send-token-single-concat-param-get.mjs
 */

// docs:start
const query = new URLSearchParams({
  ApiKey: process.env.PAYAM_RESAN_API_KEY,
  TemplateKey: 'postcode',
  Destination: '9121112222',
  // مقدار اول برای {1} و مقدار دوم برای {2} است.
  p: 'BARCODE-AAA;شیراز',
});

const url = `https://www.payam-resan.com/api/V3/SendTokenSingleConcatParam?${query}`;

const answer = await fetch(url, { signal: AbortSignal.timeout(30_000) });
const response = await answer.json();

if (!response.Success) {
  console.error(`ناموفق. کد ${response.ErrorCode}: ${response.Error}`);
  process.exit(1);
}

for (const message of response.Result) {
  console.log(`شناسه ${message.Id}، متن نهایی: ${message.FinalText ?? ''}`);
}
// docs:end
