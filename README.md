<div align="center">

<a href="https://payam-resan.com">
  <img src=".github/assets/logo.svg" width="64" height="64" alt="پیام رسان">
</a>

<h1>نمونه‌کدهای Node.js وب‌سرویس پیام رسان</h1>

اتصال به وب‌سرویس <a href="https://payam-resan.com"><b>پنل پیامکی پیام رسان</b></a> با Node.js<br>
یک فایل قابل اجرا به‌ازای هر متد سرویس، بدون هیچ وابستگی

[![API](https://img.shields.io/badge/API-V3-0a7cbd)](https://payam-resan.com)
[![Node](https://img.shields.io/badge/Node-18%2B-339933)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-none-2ea44f)](#شروع-سریع)
[![License](https://img.shields.io/badge/license-MIT-6e7781)](LICENSE)

<b>فارسی</b> · <a href="README.en.md">English</a>

</div>

<sub>دنبال زبان دیگری هستید؟ همین نمونه‌ها برای زبان‌های دیگر هم در
[github.com/Mojeshahr](https://github.com/Mojeshahr) هست.</sub>

---

## شروع سریع

```bash
git clone https://github.com/Mojeshahr/nodejs-sms-webservice.git
cd nodejs-sms-webservice

export PAYAM_RESAN_API_KEY='123456-XXXXXXXXXXXXXXX'
export PAYAM_RESAN_SENDER='30004040'

node examples/v3/account-info.mjs
```

نه `npm install` لازم است و نه `package.json`. از Node 18 به بعد تابع `fetch`
در خود Node هست و نمونه‌ها به همان تکیه می‌کنند.

با `account-info.mjs` شروع کنید: چیزی ارسال نمی‌کند، اعتباری مصرف نمی‌کند، و
اگر جواب داد یعنی کلید و اتصال هر دو سالم‌اند.

## پیش از ارسال واقعی

یک سرور آزمایشی هست که مثل سرور عملیاتی جواب می‌دهد ولی پیامکی نمی‌فرستد و
اعتباری مصرف نمی‌کند. کافی است `V3` در نشانی را با `V3SandBox` عوض کنید. تنها
استثنا `TokenList` است که روی آن سرور پیاده نشده.

## متدها

<div dir="rtl">

| نمونه | متد | کار |
|---|---|---|
| [account-info.mjs](examples/v3/account-info.mjs) | `AccountInfo` | اعتبار و خطوط فعال |
| [send.mjs](examples/v3/send.mjs) | `Send` | ارسال ساده با `GET` |
| [send-bulk.mjs](examples/v3/send-bulk.mjs) | `SendBulk` | یک متن به چند گیرنده، با شناسه پی‌گیری |
| [send-multiple.mjs](examples/v3/send-multiple.mjs) | `SendMultiple` | متن جدا برای هر گیرنده |
| [token-list.mjs](examples/v3/token-list.mjs) | `TokenList` | فهرست قالب‌ها |
| [send-token-single.mjs](examples/v3/send-token-single.mjs) | `SendTokenSingle` | ارسال قالب به یک شماره |
| [send-token-single-get.mjs](examples/v3/send-token-single-get.mjs) | `SendTokenSingle` | همان، با `GET` |
| [send-token-multi.mjs](examples/v3/send-token-multi.mjs) | `SendTokenMulti` | یک قالب، چند گیرنده |
| [status-by-id.mjs](examples/v3/status-by-id.mjs) | `StatusById` | وضعیت با شناسه سامانه |
| [status-by-user-trace-id.mjs](examples/v3/status-by-user-trace-id.mjs) | `StatusByUserTraceId` | وضعیت با شناسه خودتان |
| [get-inbox.mjs](examples/v3/get-inbox.mjs) | `GetInbox` | پیامک‌های رسیده |

</div>

## چرا پسوند mjs

با `.mjs` تابع `await` در سطح فایل کار می‌کند و به `package.json` نیازی نیست،
پس هر فایل تنها با `node <file>` اجرا می‌شود.

اگر پروژه شما CommonJS است، همان کد را داخل یک تابع async بگذارید:

```js
async function main() {
  // بدنه نمونه، بدون تغییر
}

main();
```

## استفاده در پروژه خودتان

نمونه‌ها عمداً به هیچ چیز این مخزن وابسته نیستند، پس کپی‌کردن فایل داخل پروژه
شما کافی است. اگر کلاینت HTTP خودتان را دارید، فقط بدنه درخواست و بررسی پاسخ
را بردارید:

```js
const response = await got.post('https://api.sms-webservice.com/api/V3/SendBulk', {
  json: {
    ApiKey: process.env.PAYAM_RESAN_API_KEY,
    Sender: 30004040,
    Text: 'کد تأیید شما ۱۲۳۴۵۶ است',
    Recipients: [{ Destination: 9121112222, UserTraceId: 1001 }],
  },
}).json();

if (!response.Success) {
  throw new Error(`پیامک ارسال نشد: ${response.Error} (کد ${response.ErrorCode})`);
}
```

یک بسته نصب‌شدنی npm هم در برنامه هست و در مخزن جداگانه‌ای منتشر می‌شود.

## چند نکته که وقت‌تان را می‌خرد

**کد وضعیت HTTP را نخوانید.** سرویس همیشه `200` برمی‌گرداند، حتی وقتی کلید
اشتباه است. یعنی `answer.ok` چیزی درباره موفقیت نمی‌گوید؛ تصمیم را از فیلد
`Success` بگیرید. هر نمونه اینجا همین کار را می‌کند.

**شماره گیرنده صفر ابتدایی ندارد.** یعنی `9121112222` یا با کد کشور
`989121112222`. شماره‌ای که با `9` یا `989` شروع نشود کد خطای `13` می‌گیرد.

**متن را دوباره encode نکنید.** در `send.mjs` کلاس `URLSearchParams` خودش یک بار
این کار را می‌کند. اگر پیش از آن هم `encodeURIComponent` کنید، پیامک با
نویسه‌های `%D8` به گوشی می‌رسد.

**برای هر گیرنده یک `UserTraceId` یکتا بفرستید.** بعد از یک timeout، این تنها
راه فهمیدن این است که پیامک ثبت شده یا نه.

## امنیت کلید

کلید یک راز است. در مخزن کد، در جاوااسکریپت مرورگر و در بسته اپلیکیشن موبایل
نباید قرار بگیرد. جای آن متغیر محیطی است، همان‌طور که همه نمونه‌ها می‌خوانندش.

اگر کلیدی لو رفت، از پنل یکی تازه بسازید. کلید حذف‌شده برنمی‌گردد.

## ساختار

<div dir="rtl">

| مسیر | چه چیزی دارد |
|---|---|
| `examples/v3/` | یک نمونه مستقل به‌ازای هر عملیات سرویس |
| `.env.example` | نمونه متغیرهای محیطی |

</div>

عدد `v3` در مسیر عمدی است. نسخه تازه سرویس یعنی پوشه `examples/v<n>/` تازه، و
پوشه موجود دست‌نخورده می‌ماند.

## مستندات و پشتیبانی

راهنمای کامل وب‌سرویس در [docs.payam-resan.com](https://docs.payam-resan.com)
است. توصیف ماشین‌خوان OpenAPI هم در
[sms-webservice-spec](https://github.com/Mojeshahr/sms-webservice-spec).

## مجوز

MIT. متن کامل در [`LICENSE`](LICENSE).
