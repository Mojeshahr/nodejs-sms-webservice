#!/usr/bin/env node
/**
 * AccountInfo - اعتبار باقی‌مانده و خطوط فعال حساب.
 *
 * سبک‌ترین متد سرویس و بهترین راه آزمودن کلید: چیزی ارسال نمی‌کند، اعتباری
 * مصرف نمی‌کند، و حتی با اعتبار صفر هم جواب می‌دهد.
 *
 * جز خود Node به چیزی وابسته نیست. کپی کنید و در پروژه خودتان اجرا کنید.
 *
 *   PAYAM_RESAN_API_KEY=... node examples/v3/account-info.mjs
 */

// docs:start
const payload = { ApiKey: process.env.PAYAM_RESAN_API_KEY };

const answer = await fetch('https://api.sms-webservice.com/api/V3/AccountInfo', {
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

console.log(`اعتبار: ${response.Result.Credit}`);

for (const line of response.Result.AvailableSenders) {
  console.log(`خط: ${line}`);
}
// docs:end
