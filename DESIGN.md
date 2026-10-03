# Design System — Learning Platform (أكاديمي)

> **هذا الملف هو دستور التصميم للمشروع. أي صفحة أو مكون جديد يجب أن يلتزم به.**

---

## 🎯 1. نظرة عامة (Overview)

**المنصة:** منصة تعليمية لتعليم البرمجة والإنجليزية.
**الجمهور:** طلاب، مدرسون، مشرفون، متقدمون للوظائف.
**الأسلوب البصري:** Dark Theme + Glassmorphism + Modern Animations.
**الاتجاه:** RTL (العربية) مع بعض العناصر LTR (Charts, Code).

---

## 🎨 2. الألوان (Color Palette)

### 2.1 الألوان الأساسية (من CSS Variables)

| المتغير | القيمة | الاستخدام |
| :--- | :--- | :--- |
| `var(--bg)` | slate-950 `#020617` | الخلفية الأساسية للموقع |
| `var(--bg-secondary)` | slate-900 `#0f172a` | خلفية ثانوية (Sidebar, Header) |
| `var(--card)` | slate-900/60 | خلفية البطاقات (شفافة) |
| `var(--border)` | slate-800 `#1e293b` | الحدود الفاصلة |
| `var(--accent)` | indigo-500/600 | اللون الرئيسي (Buttons, Highlights) |
| `var(--accent-text)` | indigo-400 | النص بلون الـ Accent |
| `var(--text-primary)` | white | النص الأساسي |
| `var(--text-secondary)` | slate-400 `#94a3b8` | النص الثانوي |
| `var(--text-muted)` | slate-500 `#64748b` | النص الخفيف |
| `var(--surface-hover)` | slate-800/50 | خلفية عند الـ Hover |
| `var(--input-bg)` | slate-950 | خلفية حقول الإدخال |
| `var(--input-border)` | slate-700 | حدود حقول الإدخال |

### 2.2 ألوان الحالات (Status Colors)

| اللون | الكود | الاستخدام |
| :--- | :--- | :--- |
| **Success / Emerald** | `#10b981` | قبول، نجاح، إكمال |
| **Warning / Amber** | `#f59e0b` | تحذير، انتظار |
| **Danger / Rose** | `#ef4444` | رفض، خطأ، مكتمل |
| **Info / Cyan** | `#06b6d4` | معلومات، تفاصيل |
| **Purple** | `#a855f7` | ثانوي، مميز |
| **Blue** | `#3b82f6` | أساسي، محايد |

### 2.3 ألوان الأقسام (Section Colors)

| القسم | اللون | الكود |
| :--- | :--- | :--- |
| **English** | Blue | `#3b82f6` |
| **Programming** | Purple | `#a855f7` |
| **Design** | Cyan | `#06b6d4` |

### 2.4 قواعد استخدام الألوان

- ✅ **دائماً استخدم Tailwind classes** (`bg-slate-900`, `text-indigo-400`).
- ✅ **للألوان الديناميكية** (حسب البيانات) استخدم `style={{ color }}`.
- ❌ **لا تستخدم Hex مباشر** إلا للألوان الديناميكية.
- ❌ **لا تخلط Light/Dark Themes**.

---

## ✍️ 3. الخطوط (Typography)

### 3.1 الخط الأساسي

- **العربية:** `font-display` (الخط المخصص للمشروع).
- **الإنجليزية:** نفس الخط (يدعم اللغتين).

### 3.2 أحجام الخطوط

| الفئة | Class | الاستخدام |
| :--- | :--- | :--- |
| **Hero Title** | `text-3xl sm:text-4xl font-black` | عنوان الصفحة الرئيسية |
| **Page Title** | `text-2xl sm:text-3xl font-black` | عنوان صفحة |
| **Section Title** | `text-lg font-bold` | عنوان قسم |
| **Card Title** | `text-base font-bold` | عنوان بطاقة |
| **Body** | `text-sm` | نص عادي |
| **Caption** | `text-xs` | تعليق، تفاصيل |
| **Tiny** | `text-[10px]` أو `text-[11px]` | Badges، Labels صغيرة |

### 3.3 أوزان الخطوط

- `font-black` — للـ Hero Titles.
- `font-bold` — للـ Headings والـ Buttons.
- `font-semibold` — للـ Subheadings والـ Badges.
- `font-medium` — للـ Labels.
- `font-normal` — للنص العادي.

---

## 📏 4. المسافات (Spacing)

### 4.1 الحاويات (Containers)

```jsx
// Container عادي
<div className="mx-auto max-w-7xl px-4 sm:px-6">

// Container للـ Forms
<div className="mx-auto max-w-2xl px-6">

// Container للـ Detail Pages
<div className="mx-auto max-w-4xl px-6">