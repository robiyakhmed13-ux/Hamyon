# 💰 HAMYON - Moliyaviy Yordamchi

## Telegram Mini App + Bot - Barcha funksiyalar BEPUL!

O'zbek tilidagi moliyaviy tracker. Daromad va xarajatlarni ovoz, matn yoki chek orqali oson kuzating.

---

## 📁 Loyiha Tuzilishi

```
hamyon/
├── mini-app/                 # React Mini App
│   ├── src/
│   │   ├── App.jsx          # Asosiy komponent
│   │   ├── main.jsx         # Entry point
│   │   ├── index.css        # Stillar
│   │   └── supabase.js      # Supabase helper
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env.example
│
├── bot/                      # Telegram Bot
│   ├── src/
│   │   └── index.ts         # Bot kodi
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── supabase/
│   └── schema.sql           # Database schema
│
└── README.md
```

---

## 🚀 QADAM-BAQADAM O'RNATISH

### 📋 TALAB QILINADIGAN NARSALAR

1. **Node.js** (v18+) - [nodejs.org](https://nodejs.org)
2. **Supabase account** - [supabase.com](https://supabase.com) (BEPUL)
3. **Telegram account** - Bot yaratish uchun
4. **OpenAI API key** - [platform.openai.com](https://platform.openai.com) (ovoz va chek uchun)
5. **Vercel account** - [vercel.com](https://vercel.com) (Mini App deploy uchun, BEPUL)

---

## 1️⃣ SUPABASE O'RNATISH (Database)

### 1.1 Supabase'da yangi loyiha yarating:
1. [supabase.com](https://supabase.com) ga boring
2. "Start your project" bosing
3. GitHub bilan kiring
4. "New project" bosing
5. Ma'lumotlarni to'ldiring:
   - **Name:** `hamyon`
   - **Database Password:** (xavfsiz parol yarating va saqlang!)
   - **Region:** Frankfurt (EU) yoki yaqinroq server

### 1.2 Database schema yarating:
1. Supabase Dashboard'da **SQL Editor** ga boring
2. "New query" bosing
3. `supabase/schema.sql` faylining butun mazmunini nusxalang va joylashtiring
4. **Run** bosing
5. "Success" xabari chiqishi kerak

### 1.3 API kalitlarini oling:
1. **Settings** → **API** ga boring
2. Quyidagilarni nusxalab saqlang:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon public key:** `eyJhbGci...` (uzun kalit)

---

## 2️⃣ TELEGRAM BOT YARATISH

### 2.1 BotFather'da bot yarating:
1. Telegram'da [@BotFather](https://t.me/BotFather) ni oching
2. `/newbot` yuboring
3. Bot nomini kiriting: `Hamyon`
4. Username kiriting: `hamyon_uz_bot` (yoki boshqa unique nom)
5. **Bot token** ni saqlang: `7123456789:AAH...` (uzun token)

### 2.2 Mini App yarating:
1. BotFather'da `/newapp` yuboring
2. Botingizni tanlang
3. App nomini kiriting: `Hamyon`
4. App tavsifini kiriting: `Moliyaviy yordamchi`
5. Rasm yuboring (512x512 PNG)
6. Web App URL hozircha skip qiling (keyinroq qo'shamiz)

### 2.3 Bot sozlamalari:
```
/setdescription - Moliyaviy yordamchi. Xarajat va daromadlarni oson kuzating.
/setabouttext - Hamyon - bepul moliyaviy tracker
/setuserpic - (bot rasmini yuklang)
```

---

## 3️⃣ OPENAI API KEY OLISH

1. [platform.openai.com](https://platform.openai.com) ga boring
2. Sign up / Login qiling
3. **API Keys** ga boring
4. "Create new secret key" bosing
5. Kalitni saqlang: `sk-...` (faqat bir marta ko'rsatiladi!)

⚠️ **Eslatma:** OpenAI API pulli, lekin yangi account'ga $5 kredit beriladi.

---

## 4️⃣ MINI APP O'RNATISH (Local)

### 4.1 Papkaga o'ting va dependencies o'rnating:
```bash
cd mini-app
npm install
```

### 4.2 .env fayl yarating:
```bash
cp .env.example .env
```

### 4.3 .env faylini tahrirlang:
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

### 4.4 Development server ishga tushiring:
```bash
npm run dev
```

Brauzerda oching: `http://localhost:3000`

---

## 5️⃣ BOT O'RNATISH (Local)

### 5.1 Papkaga o'ting va dependencies o'rnating:
```bash
cd bot
npm install
```

### 5.2 .env fayl yarating:
```bash
cp .env.example .env
```

### 5.3 .env faylini tahrirlang:
```env
TELEGRAM_BOT_TOKEN=7123456789:AAH...
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGci...
OPENAI_API_KEY=sk-...
WEBAPP_URL=https://t.me/hamyon_uz_bot/app
```

### 5.4 Bot ishga tushiring:
```bash
npm run dev
```

"🚀 Hamyon Bot ishga tushdi..." xabari chiqishi kerak.

---

## 6️⃣ MINI APP DEPLOY QILISH (Vercel)

### 6.1 GitHub'ga yuklash:
```bash
cd mini-app
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/hamyon-mini-app.git
git push -u origin main
```

### 6.2 Vercel'da deploy:
1. [vercel.com](https://vercel.com) ga boring
2. GitHub bilan kiring
3. "Import Project" bosing
4. `hamyon-mini-app` repo'ni tanlang
5. Environment variables qo'shing:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. "Deploy" bosing
7. URL ni saqlang: `https://hamyon-mini-app.vercel.app`

### 6.3 BotFather'da Mini App URL yangilang:
1. [@BotFather](https://t.me/BotFather) ga boring
2. `/myapps` yuboring
3. Botingizni tanlang
4. "Edit Web App URL" bosing
5. Vercel URL ni kiriting: `https://hamyon-mini-app.vercel.app`

---

## 7️⃣ BOT DEPLOY QILISH (Railway)

### 7.1 GitHub'ga yuklash:
```bash
cd bot
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/hamyon-bot.git
git push -u origin main
```

### 7.2 Railway'da deploy:
1. [railway.app](https://railway.app) ga boring
2. GitHub bilan kiring
3. "New Project" → "Deploy from GitHub repo"
4. `hamyon-bot` ni tanlang
5. Environment variables qo'shing:
   - `TELEGRAM_BOT_TOKEN`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`
   - `WEBAPP_URL`
6. "Deploy" bosing

---

## ✅ TEST QILISH

### Bot test:
1. Telegram'da botingizni oching
2. `/start` yuboring
3. "Kofe 15000" deb yozing
4. Tranzaksiya saqlanishi kerak!

### Ovozli test:
1. Ovozli xabar yuboring: "Taksi o'ttiz ming"
2. Bot transkripsiya qilib, saqlashi kerak

### Mini App test:
1. Bot menyu tugmasini bosing
2. Mini App ochilishi kerak
3. Balans va tranzaksiyalar ko'rinishi kerak

---

## 🔧 MUAMMOLARNI BARTARAF ETISH

### "Database error":
- Supabase URL va key to'g'riligini tekshiring
- Schema to'g'ri yaratilganini tekshiring

### "Bot ishlamayapti":
- Token to'g'riligini tekshiring
- Console'da xatolarni ko'ring

### "Mini App ochilmayapti":
- Vercel deploy muvaffaqiyatli bo'lganini tekshiring
- BotFather'da URL to'g'ri kiritilganini tekshiring

### "Ovoz transkripsiya qilmayapti":
- OpenAI API key to'g'riligini tekshiring
- OpenAI account'da kredit borligini tekshiring

---

## 📱 FOYDALANISH

### Ovozli xabar:
```
"Kofe o'n besh ming"
"Taksiga 30k sarfladim"
"Oylik maosh 5 million"
```

### Matn:
```
"Tushlik 45000"
"Korzinka 150 000"
"Maosh 5m"
```

### Chek:
- Chek rasmini yuboring
- Bot avtomatik summa va do'kon nomini aniqlaydi

---

O'zbekistonda ❤️ bilan yaratildi
