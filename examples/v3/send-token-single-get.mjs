#!/usr/bin/env node
/**
 * SendTokenSingle با GET - همان ارسال قالب، با ورودی در نشانی.
 *
 * برای آزمایش دستی مناسب است، برای محیط عملیاتی نه: در GET هم کلید حساب و هم
 * مقدار رمز یک‌بارمصرف داخل نشانی می‌نشینند و در لاگ وب‌سرور و هدر Referer
 * ثبت می‌شوند. واریانت POST را بردارید.
 *
 * جز خود Node به چیزی وابسته نیست. کپی کنید و در پروژه خودتان اجرا کنید.
 *
 *   PAYAM_RESAN_API_KEY=... node examples/v3/send-token-single-get.mjs
 */

// docs:start
const query = new URLSearchParams({
  ApiKey: process.env.PAYAM_RESAN_API_KEY,
  TemplateKey: 'verifycode',
  Destination: '9121112222',
  p1: '123456',
});

const url = `https://api.sms-webservice.com/api/V3/SendTokenSingle?${query}`;

const answer = await fetch(url, { signal: AbortSignal.timeout(30_000) });
const response = await answer.json();

if (!response.Success) {
  console.error(`ناموفق. کد ${response.ErrorCode}: ${response.Error}`);
  process.exit(1);
}

for (const message of response.Result) {
  console.log(`شناسه ${message.Id}، متن نهایی: ${message.FinalText}`);
}
// docs:end
