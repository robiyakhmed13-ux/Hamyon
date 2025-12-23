import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * HAMYON — Telegram Mini App
 * Offline-first (localStorage) + optional Supabase REST sync
 *
 * SECURITY:
 * - Do NOT put Telegram bot token or OpenAI key in frontend.
 * - Mini-app only uses VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (public anon key).
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// ---------------------------
// i18n
// ---------------------------
const I18N = {
  uz: {
    appName: "Hamyon",
    hello: "Salom",
    assistant: "Moliyaviy yordamchingiz",
    balance: "Joriy balans",
    todaySummary: "Bugungi xulosa",
    expenses: "Xarajatlar",
    income: "Daromad",
    home: "Bosh sahifa",
    stats: "Statistika",
    add: "Qo‘shish",
    transactions: "Tranzaksiyalar",
    categories: "Kategoriyalar",
    limits: "Limitlar",
    goals: "Maqsadlar",
    debts: "Qarzlar",
    settings: "Sozlamalar",
    openBot: "Botni ochish",
    addTransaction: "Tranzaksiya qo‘shish",
    editTransaction: "Tranzaksiyani tahrirlash",
    type: "Turi",
    expense: "Xarajat",
    incomeType: "Daromad",
    debtType: "Qarz",
    amount: "Summa",
    description: "Tavsif",
    category: "Kategoriya",
    date: "Sana",
    save: "Saqlash",
    cancel: "Bekor",
    delete: "O‘chirish",
    edit: "Tahrirlash",
    empty: "Hozircha hech narsa yo‘q",
    allTransactions: "Barcha tranzaksiyalar",
    filters: "Filtrlar",
    all: "Hammasi",
    today: "Bugun",
    week: "Bu hafta",
    month: "Bu oy",
    addCategory: "Kategoriya qo‘shish",
    editCategory: "Kategoriyani tahrirlash",
    language: "Til",
    dataMode: "Ma’lumotlar rejimi",
    localMode: "Local (offline)",
    remoteMode: "Supabase (online)",
    sync: "Yangilash / Sync",
    syncOk: "Synclandi",
    syncFail: "Sync bo‘lmadi (offline ishlayapti)",
    confirmDelete: "O‘chirishni tasdiqlaysizmi?",
    quickAdd: "Tez qo‘shish",
    addExpense: "Xarajat qo‘shish",
    addIncome: "Daromad qo‘shish",
    analytics: "Analitika",
    weekSpending: "Haftalik xarajat",
    monthSpending: "Oylik xarajat",
    topCategories: "Top kategoriyalar",
    noLimits: "Limitlar yo‘q",
    noGoals: "Maqsadlar yo‘q",
    noCategories: "Kategoriyalar yo‘q",
    botHint: "Bot orqali ham qo‘shishingiz mumkin, lekin mini-app mustaqil ishlaydi.",
    tgOpen: "Telegramda ochish",
    resetLocal: "Local ma’lumotlarni tozalash",
  },
  ru: {
    appName: "Hamyon",
    hello: "Привет",
    assistant: "Ваш финансовый помощник",
    balance: "Баланс",
    todaySummary: "Сегодня",
    expenses: "Расходы",
    income: "Доходы",
    home: "Главная",
    stats: "Статистика",
    add: "Добавить",
    transactions: "Транзакции",
    categories: "Категории",
    limits: "Лимиты",
    goals: "Цели",
    debts: "Долги",
    settings: "Настройки",
    openBot: "Открыть бота",
    addTransaction: "Добавить транзакцию",
    editTransaction: "Редактировать транзакцию",
    type: "Тип",
    expense: "Расход",
    incomeType: "Доход",
    debtType: "Долг",
    amount: "Сумма",
    description: "Описание",
    category: "Категория",
    date: "Дата",
    save: "Сохранить",
    cancel: "Отмена",
    delete: "Удалить",
    edit: "Редактировать",
    empty: "Пока пусто",
    allTransactions: "Все транзакции",
    filters: "Фильтры",
    all: "Все",
    today: "Сегодня",
    week: "Неделя",
    month: "Месяц",
    addCategory: "Добавить категорию",
    editCategory: "Редактировать категорию",
    language: "Язык",
    dataMode: "Режим данных",
    localMode: "Local (offline)",
    remoteMode: "Supabase (online)",
    sync: "Обновить / Sync",
    syncOk: "Синхронизировано",
    syncFail: "Синхронизация не удалась (работаем offline)",
    confirmDelete: "Удалить?",
    quickAdd: "Быстро добавить",
    addExpense: "Добавить расход",
    addIncome: "Добавить доход",
    analytics: "Аналитика",
    weekSpending: "Расходы за неделю",
    monthSpending: "Расходы за месяц",
    topCategories: "Топ категории",
    noLimits: "Нет лимитов",
    noGoals: "Нет целей",
    noCategories: "Нет категорий",
    botHint: "Можно добавлять через бота, но мини-приложение работает автономно.",
    tgOpen: "Открыть в Telegram",
    resetLocal: "Сбросить local данные",
  },
  en: {
    appName: "Hamyon",
    hello: "Hello",
    assistant: "Your financial assistant",
    balance: "Balance",
    todaySummary: "Today",
    expenses: "Expenses",
    income: "Income",
    home: "Home",
    stats: "Statistics",
    add: "Add",
    transactions: "Transactions",
    categories: "Categories",
    limits: "Limits",
    goals: "Goals",
    debts: "Debts",
    settings: "Settings",
    openBot: "Open bot",
    addTransaction: "Add transaction",
    editTransaction: "Edit transaction",
    type: "Type",
    expense: "Expense",
    incomeType: "Income",
    debtType: "Debt",
    amount: "Amount",
    description: "Description",
    category: "Category",
    date: "Date",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    empty: "Nothing here yet",
    allTransactions: "All transactions",
    filters: "Filters",
    all: "All",
    today: "Today",
    week: "This week",
    month: "This month",
    addCategory: "Add category",
    editCategory: "Edit category",
    language: "Language",
    dataMode: "Data mode",
    localMode: "Local (offline)",
    remoteMode: "Supabase (online)",
    sync: "Refresh / Sync",
    syncOk: "Synced",
    syncFail: "Sync failed (running offline)",
    confirmDelete: "Delete?",
    quickAdd: "Quick add",
    addExpense: "Add expense",
    addIncome: "Add income",
    analytics: "Analytics",
    weekSpending: "Weekly spend",
    monthSpending: "Monthly spend",
    topCategories: "Top categories",
    noLimits: "No limits",
    noGoals: "No goals",
    noCategories: "No categories",
    botHint: "You can add via bot too, but the mini-app works independently.",
    tgOpen: "Open in Telegram",
    resetLocal: "Reset local data",
  },
};

const LANGS = [
  { key: "uz", label: "O‘zbek", flag: "🇺🇿" },
  { key: "ru", label: "Русский", flag: "🇷🇺" },
  { key: "en", label: "English", flag: "🇬🇧" },
];

// ---------------------------
// Theme
// ---------------------------
const THEME = {
  bg: {
    primary: "#0B1020",     // deep navy
    secondary: "#0F172A",   // slate
    card: "#111C33",        // card base
    cardHover: "#152241",
    input: "#0E1A33",
  },
  accent: {
    primary: "#22C55E",     // green (main CTA)
    secondary: "#38BDF8",   // cyan
    tertiary: "#A78BFA",    // soft purple
    success: "#22C55E",
    warning: "#FBBF24",
    danger: "#EF4444",
    info: "#38BDF8",
    purple: "#8B5CF6",
  },
  text: {
    primary: "#F8FAFC",
    secondary: "#CBD5E1",
    muted: "#94A3B8",
  },
  gradient: {
    primary: "linear-gradient(135deg, #22C55E 0%, #38BDF8 55%, #A78BFA 100%)",
    success: "linear-gradient(135deg, #22C55E 0%, #4ADE80 100%)",
    danger: "linear-gradient(135deg, #EF4444 0%, #F87171 100%)",
    purple: "linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)",
    blue: "linear-gradient(135deg, #38BDF8 0%, #60A5FA 100%)",
  },
};

// ---------------------------
// Helpers
// ---------------------------
const uid = () => Math.random().toString(16).slice(2) + Date.now().toString(16);

const formatUZS = (n) => {
  const amount = Number(n || 0);
  const abs = Math.abs(amount);
  if (abs >= 1_000_000) return `${(amount / 1_000_000).toFixed(1).replace(".0", "")}M`;
  return new Intl.NumberFormat("uz-UZ").format(amount).replaceAll(",", " ");
};

const todayISO = () => new Date().toISOString().slice(0, 10);

const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

const startOfWeekISO = () => {
  const d = new Date();
  const day = (d.getDay() + 6) % 7; // Monday=0
  d.setDate(d.getDate() - day);
  return d.toISOString().slice(0, 10);
};

const monthPrefix = () => new Date().toISOString().slice(0, 7);

const safeJSON = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
};

const GlassCard = ({ children, className = "", onClick, style = {}, gradient }) => (
  <motion.div
    whileHover={onClick ? { scale: 1.01, y: -2 } : {}}
    whileTap={onClick ? { scale: 0.99 } : {}}
    onClick={onClick}
    className={`relative overflow-hidden rounded-2xl border border-white/5 ${onClick ? "cursor-pointer" : ""} ${className}`}
    style={{ background: gradient || THEME.bg.card, ...style }}
  >
    {children}
  </motion.div>
);

const ModalShell = ({ children, onClose, mode = "bottom" }) => {
  const backdrop = { background: "rgba(0,0,0,0.75)" };

  if (mode === "center") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] flex items-center justify-center p-4"
        style={backdrop}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ type: "spring", damping: 24 }}
          className="w-full max-w-md rounded-3xl p-5"
          style={{ background: THEME.bg.secondary }}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-end"
      style={backdrop}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 28 }}
        className="w-full max-h-[92vh] overflow-y-auto rounded-t-3xl p-6"
        style={{ background: THEME.bg.secondary }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1 rounded-full mx-auto mb-5" style={{ background: "rgba(255,255,255,0.2)" }} />
        {children}
      </motion.div>
    </motion.div>
  );
};

// ---------------------------
// Default categories
// ---------------------------
const DEFAULT_CATEGORIES = {
  expense: [
    { id: "food", uz: "Oziq-ovqat", ru: "Продукты", en: "Food", emoji: "🍕", color: "#FF6B6B" },
    { id: "restaurants", uz: "Restoranlar", ru: "Рестораны", en: "Restaurants", emoji: "🍽️", color: "#FF8787" },
    { id: "coffee", uz: "Kofe", ru: "Кофе", en: "Coffee", emoji: "☕", color: "#D4A574" },
    { id: "taxi", uz: "Taksi", ru: "Такси", en: "Taxi", emoji: "🚕", color: "#FFD43B" },
    { id: "fuel", uz: "Benzin", ru: "Бензин", en: "Fuel", emoji: "⛽", color: "#FAB005" },
    { id: "bills", uz: "Kommunal", ru: "Коммунальные", en: "Bills", emoji: "💡", color: "#12B886" },
    { id: "shopping", uz: "Xaridlar", ru: "Покупки", en: "Shopping", emoji: "🛍️", color: "#BE4BDB" },
    { id: "health", uz: "Salomatlik", ru: "Здоровье", en: "Health", emoji: "💊", color: "#F06595" },
    { id: "education", uz: "Ta'lim", ru: "Образование", en: "Education", emoji: "📚", color: "#4DABF7" },
    { id: "other", uz: "Boshqa", ru: "Другое", en: "Other", emoji: "📦", color: "#90A4AE" },
  ],
  income: [
    { id: "salary", uz: "Oylik", ru: "Зарплата", en: "Salary", emoji: "💰", color: "#51CF66" },
    { id: "freelance", uz: "Frilanser", ru: "Фриланс", en: "Freelance", emoji: "💻", color: "#40C057" },
    { id: "bonus", uz: "Bonus", ru: "Бонус", en: "Bonus", emoji: "🎉", color: "#F59F00" },
    { id: "other_income", uz: "Boshqa", ru: "Другое", en: "Other", emoji: "💵", color: "#82C91E" },
  ],
  debt: [
    { id: "borrowed", uz: "Qarz oldim", ru: "Взял в долг", en: "Borrowed", emoji: "🤝", color: "#FF6B6B" },
    { id: "lent", uz: "Qarz berdim", ru: "Дал в долг", en: "Lent", emoji: "💸", color: "#51CF66" },
    { id: "loan_payment", uz: "Qarz to'lovi", ru: "Платёж по долгу", en: "Debt payment", emoji: "🏦", color: "#339AF0" },
    { id: "credit", uz: "Kredit karta", ru: "Кредитка", en: "Credit card", emoji: "💳", color: "#845EF7" },
  ],
};

// ---------------------------
// Supabase REST helper (optional)
// ---------------------------
const sb = {
  enabled: () => !!SUPABASE_URL && !!SUPABASE_KEY,
  async req(path, { method = "GET", body } = {}) {
    const url = `${SUPABASE_URL}/rest/v1/${path}`;
    const headers = {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
    };
    if (method === "POST") headers.Prefer = "return=representation";
    if (method === "PATCH") headers.Prefer = "return=representation";

    const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
    const txt = await res.text();
    let json = null;
    try {
      json = txt ? JSON.parse(txt) : null;
    } catch {
      json = null;
    }
    if (!res.ok) {
      const err = new Error("Supabase request failed");
      err.status = res.status;
      err.payload = json || txt;
      throw err;
    }
    return json;
  },
};

// ---------------------------
// App
// ---------------------------
export default function HamyonApp() {
  const [lang, setLang] = useState(() => safeJSON.get("hamyon_lang", "uz"));
  const t = I18N[lang] || I18N.uz;

  // Telegram user
  const [tgUser, setTgUser] = useState(null);

  // Data mode
  const [remoteOk, setRemoteOk] = useState(false);
  const [dataMode, setDataMode] = useState(() => safeJSON.get("hamyon_dataMode", "auto")); // auto | local | remote

  // Core data
  const [balance, setBalance] = useState(() => safeJSON.get("hamyon_balance", 0));
  const [transactions, setTransactions] = useState(() => safeJSON.get("hamyon_transactions", []));
  const [limits, setLimits] = useState(() => safeJSON.get("hamyon_limits", []));
  const [goals, setGoals] = useState(() => safeJSON.get("hamyon_goals", []));
  const [categories, setCategories] = useState(() => safeJSON.get("hamyon_categories", DEFAULT_CATEGORIES));

  // UI state
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const [showAddTx, setShowAddTx] = useState(false);
  const [editTxId, setEditTxId] = useState(null);

  const [showCategories, setShowCategories] = useState(false);
  const [showLimits, setShowLimitsScreen] = useState(false);
  const [showTransactions, setShowTransactionsScreen] = useState(false);
  const [showAnalytics, setShowAnalyticsScreen] = useState(false);
  const [showDebts, setShowDebtsScreen] = useState(false);
  const [showGoals, setShowGoalsScreen] = useState(false);
  const [showSettings, setShowSettingsScreen] = useState(false);

  // Forms
  const [txForm, setTxForm] = useState({
    type: "expense", // expense|income|debt
    amount: "",
    description: "",
    categoryId: "food",
    date: todayISO(),
  });

  const [limitForm, setLimitForm] = useState({ id: null, categoryId: "food", amount: "" });
  const [goalForm, setGoalForm] = useState({ id: null, name: "", target: "", current: "", emoji: "🎯" });

  // ---------------------------
  // Toast
  // ---------------------------
  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2000);
  };

  // ---------------------------
  // Persist local changes
  // ---------------------------
  useEffect(() => safeJSON.set("hamyon_lang", lang), [lang]);
  useEffect(() => safeJSON.set("hamyon_dataMode", dataMode), [dataMode]);
  useEffect(() => safeJSON.set("hamyon_balance", balance), [balance]);
  useEffect(() => safeJSON.set("hamyon_transactions", transactions), [transactions]);
  useEffect(() => safeJSON.set("hamyon_limits", limits), [limits]);
  useEffect(() => safeJSON.set("hamyon_goals", goals), [goals]);
  useEffect(() => safeJSON.set("hamyon_categories", categories), [categories]);

  // ---------------------------
  // Telegram init
  // ---------------------------
  useEffect(() => {
    let u = null;
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      tg.setHeaderColor(THEME.bg.primary);
      tg.setBackgroundColor(THEME.bg.primary);
      u = tg.initDataUnsafe?.user || null;
    }
    if (!u) {
      u = { id: safeJSON.get("hamyon_uid", Date.now()), first_name: "User" };
      safeJSON.set("hamyon_uid", u.id);
    }
    setTgUser(u);
  }, []);

  // ---------------------------
  // Supabase connectivity check
  // ---------------------------
  useEffect(() => {
    (async () => {
      if (!sb.enabled()) {
        setRemoteOk(false);
        return;
      }
      try {
        await sb.req("users?select=id&limit=1");
        setRemoteOk(true);
      } catch {
        setRemoteOk(false);
      }
    })();
  }, []);

  const useRemote = useMemo(() => {
    if (dataMode === "local") return false;
    if (dataMode === "remote") return remoteOk && sb.enabled();
    return remoteOk && sb.enabled();
  }, [dataMode, remoteOk]);

  // ---------------------------
  // Category helpers
  // ---------------------------
  const allCats = useMemo(() => {
    const c = categories || DEFAULT_CATEGORIES;
    return {
      expense: c.expense || [],
      income: c.income || [],
      debt: c.debt || [],
    };
  }, [categories]);

  const getCat = (id) => {
    const list = [...allCats.expense, ...allCats.income, ...allCats.debt];
    return list.find((x) => x.id === id) || { id, uz: id, ru: id, en: id, emoji: "❓", color: "#777" };
  };

  const catLabel = (cat) => (lang === "uz" ? cat.uz : lang === "ru" ? cat.ru : cat.en);

  // ---------------------------
  // Derived stats
  // ---------------------------
  const today = todayISO();
  const weekStart = startOfWeekISO();
  const month = monthPrefix();

  const txToday = transactions.filter((x) => x.date === today);
  const txWeek = transactions.filter((x) => x.date >= weekStart);
  const txMonth = transactions.filter((x) => x.date.startsWith(month));

  const todayExp = txToday.filter((x) => x.amount < 0).reduce((s, x) => s + Math.abs(x.amount), 0);
  const todayInc = txToday.filter((x) => x.amount > 0).reduce((s, x) => s + x.amount, 0);

  const weekSpend = txWeek.filter((x) => x.amount < 0).reduce((s, x) => s + Math.abs(x.amount), 0);
  const monthSpend = txMonth.filter((x) => x.amount < 0).reduce((s, x) => s + Math.abs(x.amount), 0);

  const topCats = useMemo(() => {
    const m = new Map();
    for (const x of txMonth) {
      if (x.amount >= 0) continue;
      m.set(x.categoryId, (m.get(x.categoryId) || 0) + Math.abs(x.amount));
    }
    return [...m.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([categoryId, spent]) => ({ categoryId, spent, cat: getCat(categoryId) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions, month, categories, lang]);

  const monthSpentByCategory = (categoryId) => {
    return txMonth
      .filter((x) => x.categoryId === categoryId && x.amount < 0)
      .reduce((s, x) => s + Math.abs(x.amount), 0);
  };

  // ---------------------------
  // Remote sync (optional)
  // ---------------------------
  const syncFromRemote = async () => {
    if (!tgUser?.id) return;
    if (!useRemote) {
      showToast(t.syncFail, false);
      return;
    }
    try {
      const users = await sb.req(`users?telegram_id=eq.${tgUser.id}&select=*`);
      let u = users?.[0] || null;
      if (!u) {
        const created = await sb.req("users", {
          method: "POST",
          body: { telegram_id: tgUser.id, name: tgUser.first_name || "User", balance: 0 },
        });
        u = created?.[0] || null;
      }

      const [tx, lim, gl] = await Promise.all([
        sb.req(`transactions?user_telegram_id=eq.${tgUser.id}&select=*&order=created_at.desc&limit=200`),
        sb.req(`limits?user_telegram_id=eq.${tgUser.id}&select=*`),
        sb.req(`goals?user_telegram_id=eq.${tgUser.id}&select=*`),
      ]);

      const txLocal =
        (tx || []).map((r) => ({
          id: r.id,
          type: r.amount < 0 ? "expense" : "income",
          amount: Number(r.amount),
          description: r.description || "",
          categoryId: r.category_id || "other",
          date: (r.created_at || new Date().toISOString()).slice(0, 10),
          time: (r.created_at || new Date().toISOString()).slice(11, 16),
          source: r.source || "app",
          remote: true,
        })) || [];

      const limLocal =
        (lim || []).map((r) => ({
          id: r.id,
          categoryId: r.category_id,
          amount: Number(r.limit_amount || 0),
          remote: true,
        })) || [];

      const goalsLocal =
        (gl || []).map((r) => ({
          id: r.id,
          name: r.name,
          target: Number(r.target_amount || 0),
          current: Number(r.current_amount || 0),
          emoji: r.emoji || "🎯",
          remote: true,
        })) || [];

      setBalance(Number(u?.balance || 0));
      setTransactions(txLocal);
      setLimits(limLocal);
      setGoals(goalsLocal);

      showToast(t.syncOk, true);
    } catch (e) {
      console.error(e);
      showToast(t.syncFail, false);
    }
  };

  const pushTxToRemote = async (tx) => {
    if (!tgUser?.id) return;
    if (!useRemote) return;

    try {
      const users = await sb.req(`users?telegram_id=eq.${tgUser.id}&select=id,telegram_id`);
      if (!users?.[0]) {
        await sb.req("users", {
          method: "POST",
          body: { telegram_id: tgUser.id, name: tgUser.first_name || "User", balance: 0 },
        });
      }

      const created_at = new Date(`${tx.date}T${tx.time || "12:00"}:00.000Z`).toISOString();

      const inserted = await sb.req("transactions", {
        method: "POST",
        body: {
          user_telegram_id: tgUser.id,
          description: tx.description,
          amount: tx.amount,
          category_id: tx.categoryId,
          created_at,
          source: "app",
        },
      });

      const row = inserted?.[0];
      if (row?.id) {
        setTransactions((prev) => prev.map((x) => (x.id === tx.id ? { ...x, id: row.id, remote: true } : x)));
      }

      try {
        const users2 = await sb.req(`users?telegram_id=eq.${tgUser.id}&select=id,balance`);
        const u = users2?.[0];
        if (u?.id) {
          await sb.req(`users?id=eq.${u.id}`, { method: "PATCH", body: { balance: balance + tx.amount } });
        }
      } catch {}
    } catch (e) {
      console.error("pushTxToRemote error:", e);
    }
  };

  const deleteTxRemote = async (tx) => {
    if (!useRemote) return;
    if (!tx?.id || typeof tx.id !== "string" || tx.id.length < 10) return;
    try {
      await sb.req(`transactions?id=eq.${tx.id}`, { method: "DELETE" });
    } catch (e) {
      console.error(e);
    }
  };

  // ---------------------------
  // CRUD: Transactions
  // ---------------------------
  const openAddTx = (type) => {
    const defaultCat =
      type === "expense"
        ? allCats.expense[0]?.id || "food"
        : type === "income"
        ? allCats.income[0]?.id || "salary"
        : allCats.debt[0]?.id || "borrowed";

    setEditTxId(null);
    setTxForm({
      type,
      amount: "",
      description: "",
      categoryId: defaultCat,
      date: todayISO(),
    });
    setShowAddTx(true);
  };

  const openEditTx = (tx) => {
    setEditTxId(tx.id);
    setTxForm({
      type: tx.type,
      amount: String(Math.abs(tx.amount)),
      description: tx.description || "",
      categoryId: tx.categoryId,
      date: tx.date || todayISO(),
    });
    setShowAddTx(true);
  };

  const saveTx = async () => {
    const amtNum = Number(txForm.amount);
    if (!amtNum || !txForm.categoryId) return;

    const isExpense = txForm.type === "expense";
    const isIncome = txForm.type === "income";
    const isDebt = txForm.type === "debt";

    const debtSign = (() => {
      if (!isDebt) return 1;
      const c = txForm.categoryId;
      if (c === "borrowed") return 1;
      if (c === "lent") return -1;
      if (c === "loan_payment") return -1;
      if (c === "credit") return -1;
      return 1;
    })();

    const signed =
      isExpense ? -Math.abs(amtNum) : isIncome ? Math.abs(amtNum) : debtSign * Math.abs(amtNum);

    const now = new Date();
    const time = now.toISOString().slice(11, 16);

    if (editTxId) {
      setTransactions((prev) => {
        const old = prev.find((x) => x.id === editTxId);
        const delta = old ? signed - old.amount : signed;
        setBalance((b) => b + delta);

        return prev.map((x) =>
          x.id === editTxId
            ? {
                ...x,
                type: txForm.type,
                amount: signed,
                categoryId: txForm.categoryId,
                description: txForm.description || catLabel(getCat(txForm.categoryId)),
                date: txForm.date,
                time,
              }
            : x
        );
      });
      showToast("✓", true);
      setShowAddTx(false);
      return;
    }

    const tx = {
      id: uid(),
      type: txForm.type,
      amount: signed,
      categoryId: txForm.categoryId,
      description: txForm.description || catLabel(getCat(txForm.categoryId)),
      date: txForm.date,
      time,
      source: "app",
      remote: false,
    };

    setTransactions((prev) => [tx, ...prev]);
    setBalance((b) => b + signed);
    setShowAddTx(false);
    showToast("✓", true);

    await pushTxToRemote(tx);
  };

  const removeTx = async (tx) => {
    if (!confirm(t.confirmDelete)) return;
    setTransactions((prev) => prev.filter((x) => x.id !== tx.id));
    setBalance((b) => b - tx.amount);
    showToast("✓", true);
    await deleteTxRemote(tx);
  };

  // ---------------------------
  // CRUD: Limits
  // ---------------------------
  const openAddLimit = () => {
    setLimitForm({ id: null, categoryId: allCats.expense[0]?.id || "food", amount: "" });
  };

  const openEditLimit = (lim) => {
    setLimitForm({ id: lim.id, categoryId: lim.categoryId, amount: String(lim.amount) });
  };

  const saveLimit = () => {
    const amt = Number(limitForm.amount);
    if (!limitForm.categoryId || !amt) return;

    if (limitForm.id) {
      setLimits((prev) =>
        prev.map((l) => (l.id === limitForm.id ? { ...l, categoryId: limitForm.categoryId, amount: amt } : l))
      );
    } else {
      setLimits((prev) => [{ id: uid(), categoryId: limitForm.categoryId, amount: amt }, ...prev]);
    }
    showToast("✓", true);
    setLimitForm({ id: null, categoryId: allCats.expense[0]?.id || "food", amount: "" });
  };

  const deleteLimit = (id) => {
    if (!confirm(t.confirmDelete)) return;
    setLimits((prev) => prev.filter((x) => x.id !== id));
    showToast("✓", true);
  };

  // ---------------------------
  // CRUD: Goals
  // ---------------------------
  const openAddGoal = () => setGoalForm({ id: null, name: "", target: "", current: "0", emoji: "🎯" });
  const openEditGoal = (g) =>
    setGoalForm({ id: g.id, name: g.name, target: String(g.target), current: String(g.current), emoji: g.emoji || "🎯" });

  const saveGoal = () => {
    const name = (goalForm.name || "").trim();
    const target = Number(goalForm.target);
    const current = Number(goalForm.current || 0);
    if (!name || !target) return;

    if (goalForm.id) {
      setGoals((prev) => prev.map((g) => (g.id === goalForm.id ? { ...g, name, target, current, emoji: goalForm.emoji || "🎯" } : g)));
    } else {
      setGoals((prev) => [{ id: uid(), name, target, current, emoji: goalForm.emoji || "🎯" }, ...prev]);
    }
    showToast("✓", true);
    setGoalForm({ id: null, name: "", target: "", current: "", emoji: "🎯" });
  };

  const deleteGoal = (id) => {
    if (!confirm(t.confirmDelete)) return;
    setGoals((prev) => prev.filter((g) => g.id !== id));
    showToast("✓", true);
  };

  const depositToGoal = (goalId, delta) => {
    const d = Number(delta || 0);
    if (!d) return;
    setGoals((prev) => prev.map((g) => (g.id === goalId ? { ...g, current: clamp((g.current || 0) + d, 0, g.target || 0) } : g)));
    showToast("✓", true);
  };

  // ---------------------------
  // Open bot
  // ---------------------------
  const openBot = () => {
    const BOT_USERNAME = "hamyonmoneybot"; // change if needed
    if (window.Telegram?.WebApp?.openTelegramLink) {
      window.Telegram.WebApp.openTelegramLink(`https://t.me/${BOT_USERNAME}`);
    } else {
      window.open(`https://t.me/${BOT_USERNAME}`, "_blank");
    }
  };

  // ---------------------------
  // UI
  // ---------------------------
  const Header = () => (
    <header className="px-5 pt-6 pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold" style={{ background: THEME.gradient.primary }}>
            {(tgUser?.first_name || "U").charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: THEME.text.primary }}>
              {t.hello}, {tgUser?.first_name || "User"}!
            </h1>
            <p className="text-sm" style={{ color: THEME.text.muted }}>
              {t.assistant}
            </p>
          </div>
        </div>
        <button
          className="text-2xl font-black tracking-tight"
          style={{ background: THEME.gradient.primary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          onClick={() => setShowSettingsScreen(true)}
          title={t.settings}
        >
          {t.appName}
        </button>
      </div>
    </header>
  );

  const BalanceCard = () => (
    <div className="px-5 mb-4">
      <GlassCard className="p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm mb-1" style={{ color: THEME.text.muted }}>
              {t.balance}
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: THEME.accent.success }} />
              <h2 className="text-3xl font-bold" style={{ color: THEME.text.primary }}>
                {formatUZS(balance)} UZS
              </h2>
            </div>
          </div>

          <button
            onClick={syncFromRemote}
            className="px-4 py-3 rounded-2xl text-sm font-semibold"
            style={{
              background: useRemote ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.06)",
              color: useRemote ? THEME.accent.success : THEME.text.secondary,
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            🔄 {t.sync}
          </button>
        </div>

        <div className="mt-4 p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
          <p className="text-sm mb-3 text-center" style={{ color: THEME.text.muted }}>
            {t.todaySummary}
          </p>
          <div className="flex justify-around">
            <div className="text-center">
              <p className="text-xl font-bold" style={{ color: THEME.accent.danger }}>
                {todayExp ? `${formatUZS(todayExp)} UZS` : "0"}
              </p>
              <div className="flex items-center gap-1 justify-center">
                <span style={{ color: THEME.accent.danger }}>↘</span>
                <span className="text-xs" style={{ color: THEME.text.muted }}>
                  {t.expenses}
                </span>
              </div>
            </div>

            <div className="w-px" style={{ background: "rgba(255,255,255,0.1)" }} />

            <div className="text-center">
              <p className="text-xl font-bold" style={{ color: THEME.accent.success }}>
                {todayInc ? `${formatUZS(todayInc)} UZS` : "0"}
              </p>
              <div className="flex items-center gap-1 justify-center">
                <span style={{ color: THEME.accent.success }}>↗</span>
                <span className="text-xs" style={{ color: THEME.text.muted }}>
                  {t.income}
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs mt-3" style={{ color: THEME.text.muted }}>
          {t.dataMode}:{" "}
          <span style={{ color: useRemote ? THEME.accent.success : THEME.text.secondary }}>
            {useRemote ? t.remoteMode : t.localMode}
          </span>
          {sb.enabled() ? "" : " (no env)"}
        </p>
      </GlassCard>
    </div>
  );

  const QuickActions = () => (
    <div className="px-5 mb-4">
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: "➕", label: t.addExpense, action: () => openAddTx("expense"), grad: THEME.gradient.primary },
          { icon: "💰", label: t.addIncome, action: () => openAddTx("income"), grad: THEME.gradient.success },
         { icon: "📁", label: t.categories, action: () => setShowCategories(true), grad: THEME.gradient.blue },
         { icon: "🎯", label: t.limits, action: () => setShowLimitsScreen(true), grad: "linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)" },
        ].map((x, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={x.action}
            className="p-4 rounded-2xl flex flex-col items-center gap-2"
            style={{ background: THEME.bg.card, border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: x.grad }}>
              {x.icon}
            </div>
            <span className="text-sm font-medium" style={{ color: THEME.text.primary }}>
              {x.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );

  const AnalyticsCard = () => (
    <div className="px-5 mb-4">
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => setShowAnalyticsScreen(true)}
        className="w-full p-5 rounded-2xl flex items-center gap-4"
        style={{ background: THEME.bg.card, border: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: THEME.gradient.purple }}>
          <span className="text-2xl">📈</span>
        </div>
        <div className="text-left flex-1">
          <p className="font-semibold" style={{ color: THEME.text.primary }}>
            {t.analytics}
          </p>
          <p className="text-sm" style={{ color: THEME.text.muted }}>
            {t.weekSpending}: {formatUZS(weekSpend)} • {t.monthSpending}: {formatUZS(monthSpend)}
          </p>
        </div>
        <span style={{ color: THEME.text.muted }}>→</span>
      </motion.button>
    </div>
  );

  const RecentTx = () => (
    <div className="px-5 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold" style={{ color: THEME.text.primary }}>
          {t.allTransactions}
        </h3>
        <button onClick={() => setShowTransactionsScreen(true)} className="text-sm font-medium" style={{ color: THEME.accent.primary }}>
          {t.all}
        </button>
      </div>

      <div className="space-y-2">
        {transactions.slice(0, 5).length === 0 ? (
          <GlassCard className="p-6 text-center">
            <span className="text-5xl block mb-2">📝</span>
            <p style={{ color: THEME.text.muted }}>{t.empty}</p>
            <div className="mt-4">
              <button
                onClick={() => openAddTx("expense")}
                className="px-4 py-3 rounded-2xl font-semibold"
                style={{ background: THEME.gradient.primary, color: "#000" }}
              >
                {t.addTransaction}
              </button>
            </div>
          </GlassCard>
        ) : (
          transactions.slice(0, 5).map((tx) => {
            const c = getCat(tx.categoryId);
            return (
              <GlassCard key={tx.id} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: `${c.color}20` }}>
                    {c.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate" style={{ color: THEME.text.primary }}>
                      {tx.description}
                    </p>
                    <p className="text-xs" style={{ color: THEME.text.muted }}>
                      {tx.date} • {catLabel(c)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold" style={{ color: tx.amount > 0 ? THEME.accent.success : THEME.accent.danger }}>
                      {tx.amount > 0 ? "+" : ""}
                      {formatUZS(tx.amount)} UZS
                    </p>
                    <div className="flex gap-2 justify-end mt-1">
                      <button onClick={() => openEditTx(tx)} className="text-xs" style={{ color: THEME.accent.info }}>
                        {t.edit}
                      </button>
                      <button onClick={() => removeTx(tx)} className="text-xs" style={{ color: THEME.accent.danger }}>
                        {t.delete}
                      </button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            );
          })
        )}
      </div>

      <div className="mt-4">
        <GlassCard className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold" style={{ color: THEME.text.primary }}>
                🤖
              </p>
              <p className="text-sm" style={{ color: THEME.text.muted }}>
                {t.botHint}
              </p>
            </div>
            <button
              onClick={openBot}
              className="px-4 py-3 rounded-2xl font-semibold"
              style={{
                background: "rgba(249,115,22,0.15)",
                color: THEME.accent.primary,
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {t.openBot}
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );

  const HomeScreen = () => (
    <div className="pb-28">
      <Header />
      <BalanceCard />
      <QuickActions />
      <AnalyticsCard />
      <RecentTx />
    </div>
  );

  // ---------------------------
  // Add/Edit Transaction Modal helpers
  // ---------------------------
  const txModalType = txForm.type;
  const txModalCats = txModalType === "expense" ? allCats.expense : txModalType === "income" ? allCats.income : allCats.debt;

  const setTxType = (newType) => {
    const defaultCat =
      newType === "expense"
        ? allCats.expense[0]?.id || "food"
        : newType === "income"
        ? allCats.income[0]?.id || "salary"
        : allCats.debt[0]?.id || "borrowed";
    setTxForm((p) => ({ ...p, type: newType, categoryId: defaultCat }));
  };

  const handleCategoryPick = (c) => {
    setTxForm((p) => ({ ...p, categoryId: c.id }));

    // If amount is empty -> ask amount immediately (fast flow)
    if (!txForm.amount) {
      const v = prompt(`${catLabel(c)} — ${t.amount} (UZS)`, "500000");
      if (v === null) return;
      const num = String(v).replace(/[^\d]/g, "");
      if (!num) return;
      setTxForm((p) => ({
        ...p,
        categoryId: c.id,
        amount: num,
        description: p.description || catLabel(c),
      }));
    }
  };

  // Add/Edit Transaction Modal JSX (NOT a component - just JSX)
  const addTxModalContent = (
    <ModalShell key="add-tx-modal" onClose={() => setShowAddTx(false)} mode="bottom">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold" style={{ color: THEME.text.primary }}>
          {editTxId ? t.editTransaction : t.addTransaction}
        </h2>
        <button onClick={() => setShowAddTx(false)} style={{ color: THEME.text.muted }}>
          ✕
        </button>
      </div>

      <div className="flex gap-2 my-4">
        {[
          { k: "expense", label: t.expense, icon: "↘" },
          { k: "income", label: t.incomeType, icon: "↗" },
          { k: "debt", label: t.debtType, icon: "💳" },
        ].map((x) => (
          <button
            key={x.k}
            onClick={() => setTxType(x.k)}
            className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2"
            style={{
              background: txModalType === x.k ? "rgba(249,115,22,0.18)" : THEME.bg.card,
              color: txModalType === x.k ? THEME.accent.primary : THEME.text.secondary,
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <span>{x.icon}</span>
            <span className="text-sm font-semibold">{x.label}</span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-sm block mb-2" style={{ color: THEME.text.muted }}>
            {t.amount} (UZS)
          </label>
          <input
            value={txForm.amount}
            onChange={(e) => setTxForm((p) => ({ ...p, amount: e.target.value }))}
            type="number"
            className="w-full p-4 rounded-2xl"
            style={{ background: THEME.bg.input, color: THEME.text.primary, border: "1px solid rgba(255,255,255,0.06)" }}
            placeholder="15000"
          />
        </div>

        <div>
          <label className="text-sm block mb-2" style={{ color: THEME.text.muted }}>
            {t.description}
          </label>
          <input
            value={txForm.description}
            onChange={(e) => setTxForm((p) => ({ ...p, description: e.target.value }))}
            type="text"
            className="w-full p-4 rounded-2xl"
            style={{ background: THEME.bg.input, color: THEME.text.primary, border: "1px solid rgba(255,255,255,0.06)" }}
            placeholder={catLabel(getCat(txForm.categoryId))}
          />
        </div>

        <div>
          <label className="text-sm block mb-2" style={{ color: THEME.text.muted }}>
            {t.date}
          </label>
          <input
            value={txForm.date}
            onChange={(e) => setTxForm((p) => ({ ...p, date: e.target.value }))}
            type="date"
            className="w-full p-4 rounded-2xl"
            style={{ background: THEME.bg.input, color: THEME.text.primary, border: "1px solid rgba(255,255,255,0.06)" }}
          />
        </div>

        <div>
          <label className="text-sm block mb-2" style={{ color: THEME.text.muted }}>
            {t.category}
          </label>
          <div className="grid grid-cols-4 gap-2">
            {txModalCats.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCategoryPick(c)}
                className="p-3 rounded-2xl flex flex-col items-center gap-1"
                style={{
                  background: txForm.categoryId === c.id ? `${c.color}30` : THEME.bg.card,
                  border: txForm.categoryId === c.id ? `2px solid ${c.color}` : "2px solid transparent",
                }}
              >
                <span className="text-xl">{c.emoji}</span>
                <span className="text-[11px] w-full truncate text-center" style={{ color: THEME.text.secondary }}>
                  {catLabel(c)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-3">
          <button
            onClick={() => setShowAddTx(false)}
            className="flex-1 py-4 rounded-2xl font-semibold"
            style={{ background: THEME.bg.card, color: THEME.text.secondary, border: "1px solid rgba(255,255,255,0.06)" }}
          >
            {t.cancel}
          </button>
          <button onClick={saveTx} className="flex-1 py-4 rounded-2xl font-semibold" style={{ background: THEME.gradient.primary, color: "#000" }}>
            {t.save}
          </button>
        </div>
      </div>
    </ModalShell>
  );

  // ---------------------------
  // Categories Screen (UPDATED: inline edit + simple add via prompts)
  // ---------------------------
  const CategoriesScreen = () => {
    const [activeType, setActiveType] = useState("expense");
    const list = allCats[activeType] || [];

    const [editInlineId, setEditInlineId] = useState(null);
    const [editName, setEditName] = useState("");

    const startInlineEdit = (cat) => {
      setEditInlineId(cat.id);
      setEditName(catLabel(cat));
    };

    const saveInlineEdit = (cat) => {
      const name = (editName || "").trim();
      if (!name) return;

      setCategories((prev) => {
        const copy = { ...prev, [activeType]: [...(prev[activeType] || [])] };
        const idx = copy[activeType].findIndex((c) => c.id === cat.id);
        if (idx >= 0) {
          const old = copy[activeType][idx];
          const patch = lang === "uz" ? { uz: name } : lang === "ru" ? { ru: name } : { en: name };
          copy[activeType][idx] = { ...old, ...patch, custom: true };
        }
        return copy;
      });

      setEditInlineId(null);
      setEditName("");
      showToast("✓", true);
    };

    const cancelInlineEdit = () => {
      setEditInlineId(null);
      setEditName("");
    };

    const addCategorySimple = () => {
      const name = prompt(`${t.addCategory}: ${t.description}`, "");
      if (name === null) return;
      const nm = String(name).trim();
      if (!nm) return;

      const emoji = prompt("Emoji (optional)", "📦");
      if (emoji === null) return;

      const color = prompt("Color hex (optional)", "#90A4AE");
      if (color === null) return;

      const newId = uid().slice(0, 8);
      const newCat = {
        id: newId,
        uz: nm,
        ru: nm,
        en: nm,
        emoji: String(emoji || "📦").trim() || "📦",
        color: String(color || "#90A4AE").trim() || "#90A4AE",
        custom: true,
      };

      setCategories((prev) => {
        const copy = { ...prev, [activeType]: [...(prev[activeType] || [])] };
        copy[activeType].unshift(newCat);
        return copy;
      });

      showToast("✓", true);
    };

    const deleteCategory = (type, catId) => {
      if (!confirm(t.confirmDelete)) return;

      const usedTx = transactions.some((x) => x.categoryId === catId);
      const usedLim = limits.some((x) => x.categoryId === catId);
      if (usedTx || usedLim) {
        showToast("⚠️ Used", false);
        return;
      }

      setCategories((prev) => {
        const copy = { ...prev, [type]: [...(prev[type] || [])] };
        copy[type] = copy[type].filter((c) => c.id !== catId);
        return copy;
      });
      showToast("✓", true);
    };

    return (
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed inset-0 z-50 overflow-y-auto" style={{ background: THEME.bg.primary }}>
        <div className="p-5 pb-28">
          <div className="flex items-center gap-4 mb-6">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowCategories(false)} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: THEME.bg.card }}>
              ←
            </motion.button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold" style={{ color: THEME.text.primary }}>
                {t.categories}
              </h1>
              <p className="text-sm" style={{ color: THEME.text.muted }}>
                {list.length}
              </p>
            </div>
            <button onClick={addCategorySimple} className="px-4 py-3 rounded-2xl font-semibold" style={{ background: THEME.gradient.primary, color: "#000" }}>
              + {t.addCategory}
            </button>
          </div>

          <div className="flex gap-2 mb-4">
            {[
              { key: "expense", label: t.expense, icon: "↘", count: allCats.expense.length },
              { key: "income", label: t.incomeType, icon: "↗", count: allCats.income.length },
              { key: "debt", label: t.debtType, icon: "💳", count: allCats.debt.length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveType(tab.key);
                  cancelInlineEdit();
                }}
                className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                style={{
                  background: activeType === tab.key ? THEME.bg.card : "transparent",
                  color: activeType === tab.key ? THEME.text.primary : THEME.text.muted,
                  border: `1px solid ${activeType === tab.key ? "rgba(255,255,255,0.1)" : "transparent"}`,
                }}
              >
                <span>{tab.icon}</span>
                <span className="text-sm font-medium">{tab.label}</span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {list.length === 0 ? (
              <GlassCard className="p-6 text-center">
                <span className="text-5xl block mb-2">📁</span>
                <p style={{ color: THEME.text.muted }}>{t.noCategories}</p>
              </GlassCard>
            ) : (
              list.map((cat) => (
                <GlassCard key={cat.id} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ background: `${cat.color}30` }}>
                      {cat.emoji}
                    </div>

                    <div className="flex-1 min-w-0">
                      {editInlineId === cat.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="flex-1 p-3 rounded-xl"
                            style={{ background: THEME.bg.input, color: THEME.text.primary, border: "1px solid rgba(255,255,255,0.06)" }}
                            autoFocus
                          />
                          <button
                            onClick={() => saveInlineEdit(cat)}
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: "rgba(34,197,94,0.18)" }}
                            title="Save"
                          >
                            💾
                          </button>
                          <button
                            onClick={cancelInlineEdit}
                            className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: "rgba(239,68,68,0.18)" }}
                            title="Cancel"
                          >
                            ✖
                          </button>
                        </div>
                      ) : (
                        <>
                          <p className="font-medium truncate" style={{ color: THEME.text.primary }}>
                            {catLabel(cat)}
                          </p>
                          <p className="text-xs" style={{ color: THEME.text.muted }}>
                            {activeType === "expense" ? `${formatUZS(monthSpentByCategory(cat.id))} UZS (month)` : ""}
                          </p>
                        </>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => startInlineEdit(cat)}
                        className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{ background: "rgba(56, 189, 248, 0.18)" }}
                        title={t.edit}
                      >
                        <span style={{ color: THEME.accent.info }}>✏️</span>
                      </button>
                      <button
                        onClick={() => deleteCategory(activeType, cat.id)}
                        className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{ background: "rgba(239, 68, 68, 0.18)" }}
                        title={t.delete}
                      >
                        <span style={{ color: THEME.accent.danger }}>🗑️</span>
                      </button>
                    </div>
                  </div>
                </GlassCard>
              ))
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // ---------------------------
  // Limits screen
  // ---------------------------
  const LimitsScreen = () => (
    <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed inset-0 z-50 overflow-y-auto" style={{ background: THEME.bg.primary }}>
      <div className="p-5 pb-28">
        <div className="flex items-center gap-4 mb-6">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowLimitsScreen(false)} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: THEME.bg.card }}>
            ←
          </motion.button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold" style={{ color: THEME.text.primary }}>
              {t.limits}
            </h1>
            <p className="text-sm" style={{ color: THEME.text.muted }}>
              {limits.length}
            </p>
          </div>

          <button onClick={openAddLimit} className="px-4 py-3 rounded-2xl font-semibold" style={{ background: THEME.gradient.primary, color: "#000" }}>
            + {t.limits}
          </button>
        </div>

        <div className="space-y-3">
          {limits.length === 0 ? (
            <GlassCard className="p-6 text-center">
              <span className="text-5xl block mb-2">🎯</span>
              <p style={{ color: THEME.text.muted }}>{t.noLimits}</p>
            </GlassCard>
          ) : (
            limits.map((l) => {
              const c = getCat(l.categoryId);
              const spent = monthSpentByCategory(l.categoryId);
              const pct = l.amount ? Math.round((spent / l.amount) * 100) : 0;
              const isOver = pct >= 100;
              const isNear = pct >= 80;

              return (
                <GlassCard key={l.id} className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ background: `${c.color}30` }}>
                        {c.emoji}
                      </div>
                      <div>
                        <p className="font-semibold" style={{ color: THEME.text.primary }}>
                          {catLabel(c)}
                        </p>
                        <p className="text-sm" style={{ color: THEME.text.muted }}>
                          {formatUZS(spent)} / {formatUZS(l.amount)} UZS
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold" style={{ color: isOver ? THEME.accent.danger : isNear ? THEME.accent.warning : THEME.accent.success }}>
                        {clamp(pct, 0, 999)}%
                      </p>
                      <div className="flex gap-2 justify-end mt-1">
                        <button onClick={() => openEditLimit(l)} className="text-xs" style={{ color: THEME.accent.info }}>
                          {t.edit}
                        </button>
                        <button onClick={() => deleteLimit(l.id)} className="text-xs" style={{ color: THEME.accent.danger }}>
                          {t.delete}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: isOver
                          ? THEME.gradient.danger
                          : isNear
                          ? "linear-gradient(90deg, #FBBF24, #F59E0B)"
                          : `linear-gradient(90deg, ${c.color}, ${c.color}88)`,
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${clamp(pct, 0, 100)}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </GlassCard>
              );
            })
          )}
        </div>

        <div className="mt-6">
          <GlassCard className="p-5">
            <p className="font-semibold mb-3" style={{ color: THEME.text.primary }}>
              {limitForm.id ? t.edit : t.add}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs block mb-1" style={{ color: THEME.text.muted }}>
                  {t.category}
                </label>
                <select
                  value={limitForm.categoryId}
                  onChange={(e) => setLimitForm((p) => ({ ...p, categoryId: e.target.value }))}
                  className="w-full p-4 rounded-2xl"
                  style={{ background: THEME.bg.input, color: THEME.text.primary, border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  {allCats.expense.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.emoji} {catLabel(c)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="text-xs block mb-1" style={{ color: THEME.text.muted }}>
                  {t.amount} (UZS)
                </label>
                <input
                  value={limitForm.amount}
                  onChange={(e) => setLimitForm((p) => ({ ...p, amount: e.target.value }))}
                  type="number"
                  className="w-full p-4 rounded-2xl"
                  style={{ background: THEME.bg.input, color: THEME.text.primary, border: "1px solid rgba(255,255,255,0.06)" }}
                  placeholder="500000"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setLimitForm({ id: null, categoryId: allCats.expense[0]?.id || "food", amount: "" })}
                className="flex-1 py-3 rounded-2xl font-semibold"
                style={{ background: THEME.bg.card, color: THEME.text.secondary, border: "1px solid rgba(255,255,255,0.06)" }}
              >
                {t.cancel}
              </button>
              <button onClick={saveLimit} className="flex-1 py-3 rounded-2xl font-semibold" style={{ background: THEME.gradient.primary, color: "#000" }}>
                {t.save}
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );

  // ---------------------------
  // Transactions screen
  // ---------------------------
  const TransactionsScreen = () => {
    const [filter, setFilter] = useState("all"); // all|expense|income|debt|today|week|month

    const filtered = useMemo(() => {
      const base = [...transactions];
      if (filter === "all") return base;
      if (filter === "expense") return base.filter((x) => x.type === "expense");
      if (filter === "income") return base.filter((x) => x.type === "income");
      if (filter === "debt") return base.filter((x) => x.type === "debt");
      if (filter === "today") return base.filter((x) => x.date === today);
      if (filter === "week") return base.filter((x) => x.date >= weekStart);
      if (filter === "month") return base.filter((x) => x.date.startsWith(month));
      return base;
    }, [filter, transactions]);

    return (
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed inset-0 z-50 overflow-y-auto" style={{ background: THEME.bg.primary }}>
        <div className="p-5 pb-28">
          <div className="flex items-center gap-4 mb-6">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowTransactionsScreen(false)} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: THEME.bg.card }}>
              ←
            </motion.button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold" style={{ color: THEME.text.primary }}>
                {t.allTransactions}
              </h1>
              <p className="text-sm" style={{ color: THEME.text.muted }}>
                {filtered.length} / {transactions.length}
              </p>
            </div>
            <button onClick={() => openAddTx("expense")} className="px-4 py-3 rounded-2xl font-semibold" style={{ background: THEME.gradient.primary, color: "#000" }}>
              + {t.add}
            </button>
          </div>

          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {[
              { k: "all", label: t.all },
              { k: "expense", label: t.expense },
              { k: "income", label: t.incomeType },
              { k: "debt", label: t.debtType },
              { k: "today", label: t.today },
              { k: "week", label: t.week },
              { k: "month", label: t.month },
            ].map((x) => (
              <button
                key={x.k}
                onClick={() => setFilter(x.k)}
                className="px-4 py-2 rounded-xl whitespace-nowrap text-sm font-medium"
                style={{ background: filter === x.k ? THEME.accent.primary : THEME.bg.card, color: filter === x.k ? "#000" : THEME.text.secondary }}
              >
                {x.label}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filtered.length === 0 ? (
              <GlassCard className="p-6 text-center">
                <span className="text-5xl block mb-2">📝</span>
                <p style={{ color: THEME.text.muted }}>{t.empty}</p>
              </GlassCard>
            ) : (
              filtered.map((tx) => {
                const c = getCat(tx.categoryId);
                return (
                  <GlassCard key={tx.id} className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ background: `${c.color}30` }}>
                        {c.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate" style={{ color: THEME.text.primary }}>
                          {tx.description}
                        </p>
                        <p className="text-xs" style={{ color: THEME.text.muted }}>
                          {tx.date} • {catLabel(c)} • {tx.source || "app"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg" style={{ color: tx.amount > 0 ? THEME.accent.success : THEME.accent.danger }}>
                          {tx.amount > 0 ? "+" : ""}
                          {formatUZS(tx.amount)} UZS
                        </p>
                        <div className="flex gap-2 justify-end mt-1">
                          <button onClick={() => openEditTx(tx)} className="text-xs" style={{ color: THEME.accent.info }}>
                            {t.edit}
                          </button>
                          <button onClick={() => removeTx(tx)} className="text-xs" style={{ color: THEME.accent.danger }}>
                            {t.delete}
                          </button>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                );
              })
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // ---------------------------
  // Analytics screen
  // ---------------------------
  const AnalyticsScreen = () => (
    <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed inset-0 z-50 overflow-y-auto" style={{ background: THEME.bg.primary }}>
      <div className="p-5 pb-28">
        <div className="flex items-center gap-4 mb-6">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowAnalyticsScreen(false)} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: THEME.bg.card }}>
            ←
          </motion.button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold" style={{ color: THEME.text.primary }}>
              {t.analytics}
            </h1>
            <p className="text-sm" style={{ color: THEME.text.muted }}>
              {t.weekSpending}: {formatUZS(weekSpend)} • {t.monthSpending}: {formatUZS(monthSpend)}
            </p>
          </div>
        </div>

        <GlassCard className="p-5 mb-4">
          <h3 className="font-semibold mb-4" style={{ color: THEME.text.primary }}>
            {t.topCategories} ({month})
          </h3>
          <div className="space-y-3">
            {topCats.length === 0 ? (
              <p style={{ color: THEME.text.muted }}>{t.empty}</p>
            ) : (
              topCats.map((x, i) => (
                <div key={x.categoryId} className="flex items-center gap-3">
                  <span className="text-lg">{x.cat.emoji}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm" style={{ color: THEME.text.primary }}>
                        {catLabel(x.cat)}
                      </span>
                      <span className="text-sm font-semibold" style={{ color: x.cat.color }}>
                        {formatUZS(x.spent)} UZS
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: x.cat.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${clamp((x.spent / Math.max(1, monthSpend)) * 100, 2, 100)}%` }}
                        transition={{ delay: i * 0.06 }}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className="font-semibold mb-3" style={{ color: THEME.text.primary }}>
            {t.weekSpending} / {t.monthSpending}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl" style={{ background: "rgba(239,68,68,0.10)" }}>
              <p className="text-xs" style={{ color: THEME.text.muted }}>
                {t.weekSpending}
              </p>
              <p className="text-xl font-bold" style={{ color: THEME.accent.danger }}>
                -{formatUZS(weekSpend)} UZS
              </p>
            </div>
            <div className="p-4 rounded-2xl" style={{ background: "rgba(239,68,68,0.10)" }}>
              <p className="text-xs" style={{ color: THEME.text.muted }}>
                {t.monthSpending}
              </p>
              <p className="text-xl font-bold" style={{ color: THEME.accent.danger }}>
                -{formatUZS(monthSpend)} UZS
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );

  // ---------------------------
  // Debts screen
  // ---------------------------
  const DebtsScreen = () => {
    const debtTx = transactions.filter((x) => x.type === "debt");
    const owedByMe = debtTx.filter((x) => x.amount < 0).reduce((s, x) => s + Math.abs(x.amount), 0);
    const owedToMe = debtTx.filter((x) => x.amount > 0).reduce((s, x) => s + x.amount, 0);

    return (
      <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed inset-0 z-50 overflow-y-auto" style={{ background: THEME.bg.primary }}>
        <div className="p-5 pb-28">
          <div className="flex items-center gap-4 mb-6">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowDebtsScreen(false)} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: THEME.bg.card }}>
              ←
            </motion.button>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: THEME.text.primary }}>
                {t.debts}
              </h1>
              <p className="text-sm" style={{ color: THEME.text.muted }}>
                {debtTx.length}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <GlassCard className="p-4 text-center" gradient="linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)">
              <p className="text-xs mb-1" style={{ color: THEME.text.muted }}>
                Men qarzdorman
              </p>
              <p className="text-xl font-bold" style={{ color: THEME.accent.danger }}>
                {formatUZS(owedByMe)} UZS
              </p>
            </GlassCard>
            <GlassCard className="p-4 text-center" gradient="linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.05) 100%)">
              <p className="text-xs mb-1" style={{ color: THEME.text.muted }}>
                Menga qarzdor
              </p>
              <p className="text-xl font-bold" style={{ color: THEME.accent.success }}>
                {formatUZS(owedToMe)} UZS
              </p>
            </GlassCard>
          </div>

          <button onClick={() => openAddTx("debt")} className="w-full py-4 rounded-2xl font-semibold mb-6" style={{ background: THEME.gradient.primary, color: "#000" }}>
            + {t.addTransaction}
          </button>

          <div className="space-y-2">
            {debtTx.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">💳</span>
                <p style={{ color: THEME.text.muted }}>{t.empty}</p>
              </div>
            ) : (
              debtTx.map((tx) => {
                const c = getCat(tx.categoryId);
                return (
                  <GlassCard key={tx.id} className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: `${c.color}20` }}>
                        {c.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate" style={{ color: THEME.text.primary }}>
                          {tx.description}
                        </p>
                        <p className="text-xs" style={{ color: THEME.text.muted }}>
                          {tx.date} • {catLabel(c)}
                        </p>
                      </div>
                      <p className="font-bold" style={{ color: tx.amount > 0 ? THEME.accent.success : THEME.accent.danger }}>
                        {tx.amount > 0 ? "+" : ""}
                        {formatUZS(tx.amount)} UZS
                      </p>
                    </div>
                  </GlassCard>
                );
              })
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  // ---------------------------
  // Goals screen
  // ---------------------------
  const GoalsScreen = () => (
    <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed inset-0 z-50 overflow-y-auto" style={{ background: THEME.bg.primary }}>
      <div className="p-5 pb-28">
        <div className="flex items-center gap-4 mb-6">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowGoalsScreen(false)} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: THEME.bg.card }}>
            ←
          </motion.button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold" style={{ color: THEME.text.primary }}>
              {t.goals}
            </h1>
            <p className="text-sm" style={{ color: THEME.text.muted }}>
              {goals.length}
            </p>
          </div>
          <button onClick={openAddGoal} className="px-4 py-3 rounded-2xl font-semibold" style={{ background: THEME.gradient.primary, color: "#000" }}>
            + {t.add}
          </button>
        </div>

        <div className="space-y-3">
          {goals.length === 0 ? (
            <GlassCard className="p-6 text-center">
              <span className="text-5xl block mb-2">🎯</span>
              <p style={{ color: THEME.text.muted }}>{t.noGoals}</p>
            </GlassCard>
          ) : (
            goals.map((g) => {
              const pct = g.target ? Math.round((Number(g.current || 0) / Number(g.target || 1)) * 100) : 0;
              const done = pct >= 100;
              return (
                <GlassCard key={g.id} className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: "rgba(139,92,246,0.18)" }}>
                        {g.emoji || "🎯"}
                      </div>
                      <div>
                        <p className="font-semibold" style={{ color: THEME.text.primary }}>
                          {g.name}
                        </p>
                        <p className="text-sm" style={{ color: THEME.text.muted }}>
                          {formatUZS(g.current)} / {formatUZS(g.target)} UZS
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xl font-bold" style={{ color: done ? THEME.accent.success : THEME.accent.purple }}>
                        {clamp(pct, 0, 999)}%
                      </p>
                      <div className="flex gap-2 justify-end mt-1">
                        <button onClick={() => openEditGoal(g)} className="text-xs" style={{ color: THEME.accent.info }}>
                          {t.edit}
                        </button>
                        <button onClick={() => deleteGoal(g.id)} className="text-xs" style={{ color: THEME.accent.danger }}>
                          {t.delete}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: done ? THEME.gradient.success : THEME.gradient.purple }}
                      initial={{ width: 0 }}
                      animate={{ width: `${clamp(pct, 0, 100)}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        const v = prompt(`+ (UZS)`, "50000");
                        if (v === null) return;
                        depositToGoal(g.id, Math.abs(Number(v || 0)));
                      }}
                      className="py-3 rounded-2xl font-semibold"
                      style={{ background: "rgba(34,197,94,0.16)", color: THEME.accent.success, border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      + {I18N[lang]?.deposit || "Deposit"}
                    </button>
                    <button
                      onClick={() => {
                        const v = prompt(`- (UZS)`, "50000");
                        if (v === null) return;
                        depositToGoal(g.id, -Math.abs(Number(v || 0)));
                      }}
                      className="py-3 rounded-2xl font-semibold"
                      style={{ background: "rgba(239,68,68,0.14)", color: THEME.accent.danger, border: "1px solid rgba(255,255,255,0.06)" }}
                    >
                      − {I18N[lang]?.withdraw || "Withdraw"}
                    </button>
                  </div>
                </GlassCard>
              );
            })
          )}
        </div>

        <div className="mt-6">
          <GlassCard className="p-5">
            <p className="font-semibold mb-3" style={{ color: THEME.text.primary }}>
              {goalForm.id ? t.edit : t.add}
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-xs block mb-1" style={{ color: THEME.text.muted }}>
                  {t.description}
                </label>
                <input
                  value={goalForm.name}
                  onChange={(e) => setGoalForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full p-4 rounded-2xl"
                  style={{ background: THEME.bg.input, color: THEME.text.primary, border: "1px solid rgba(255,255,255,0.06)" }}
                  placeholder="Masalan: Telefon"
                />
              </div>

              <div>
                <label className="text-xs block mb-1" style={{ color: THEME.text.muted }}>
                  {t.amount} (UZS)
                </label>
                <input
                  value={goalForm.target}
                  onChange={(e) => setGoalForm((p) => ({ ...p, target: e.target.value }))}
                  type="number"
                  className="w-full p-4 rounded-2xl"
                  style={{ background: THEME.bg.input, color: THEME.text.primary, border: "1px solid rgba(255,255,255,0.06)" }}
                  placeholder="5000000"
                />
              </div>

              <div>
                <label className="text-xs block mb-1" style={{ color: THEME.text.muted }}>
                  Saved (UZS)
                </label>
                <input
                  value={goalForm.current}
                  onChange={(e) => setGoalForm((p) => ({ ...p, current: e.target.value }))}
                  type="number"
                  className="w-full p-4 rounded-2xl"
                  style={{ background: THEME.bg.input, color: THEME.text.primary, border: "1px solid rgba(255,255,255,0.06)" }}
                  placeholder="0"
                />
              </div>

              <div className="col-span-2">
                <label className="text-xs block mb-1" style={{ color: THEME.text.muted }}>
                  Emoji
                </label>
                <input
                  value={goalForm.emoji}
                  onChange={(e) => setGoalForm((p) => ({ ...p, emoji: e.target.value }))}
                  className="w-full p-4 rounded-2xl"
                  style={{ background: THEME.bg.input, color: THEME.text.primary, border: "1px solid rgba(255,255,255,0.06)" }}
                  placeholder="🎯"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setGoalForm({ id: null, name: "", target: "", current: "", emoji: "🎯" })}
                className="flex-1 py-3 rounded-2xl font-semibold"
                style={{ background: THEME.bg.card, color: THEME.text.secondary, border: "1px solid rgba(255,255,255,0.06)" }}
              >
                {t.cancel}
              </button>
              <button onClick={saveGoal} className="flex-1 py-3 rounded-2xl font-semibold" style={{ background: THEME.gradient.primary, color: "#000" }}>
                {t.save}
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );

  // ---------------------------
  // Settings screen
  // ---------------------------
  const SettingsScreen = () => (
    <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed inset-0 z-50 overflow-y-auto" style={{ background: THEME.bg.primary }}>
      <div className="p-5 pb-28">
        <div className="flex items-center gap-4 mb-6">
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowSettingsScreen(false)} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: THEME.bg.card }}>
            ←
          </motion.button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold" style={{ color: THEME.text.primary }}>
              {t.settings}
            </h1>
            <p className="text-sm" style={{ color: THEME.text.muted }}>
              {t.appName} • {tgUser?.id ? `ID: ${tgUser.id}` : "no user"}
            </p>
          </div>
        </div>

        <GlassCard className="p-5 mb-4">
          <p className="font-semibold mb-3" style={{ color: THEME.text.primary }}>
            {t.language}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {LANGS.map((l) => (
              <button
                key={l.key}
                onClick={() => setLang(l.key)}
                className="py-3 rounded-2xl font-semibold"
                style={{
                  background: lang === l.key ? "rgba(249,115,22,0.18)" : THEME.bg.card,
                  color: lang === l.key ? THEME.accent.primary : THEME.text.secondary,
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {l.flag} {l.label}
              </button>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5 mb-4">
          <p className="font-semibold mb-2" style={{ color: THEME.text.primary }}>
            {t.dataMode}
          </p>
          <p className="text-sm mb-4" style={{ color: THEME.text.muted }}>
            {sb.enabled() ? "Supabase env detected" : "No Supabase env (offline only)"}
          </p>

          <div className="grid grid-cols-3 gap-2">
            {[
              { k: "auto", label: "Auto" },
              { k: "local", label: "Local" },
              { k: "remote", label: "Supabase" },
            ].map((x) => (
              <button
                key={x.k}
                onClick={() => setDataMode(x.k)}
                className="py-3 rounded-2xl font-semibold"
                style={{
                  background: dataMode === x.k ? "rgba(56,189,248,0.16)" : THEME.bg.card,
                  color: dataMode === x.k ? THEME.accent.info : THEME.text.secondary,
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {x.label}
              </button>
            ))}
          </div>

          <div className="mt-4">
            <button
              onClick={syncFromRemote}
              className="w-full py-4 rounded-2xl font-semibold"
              style={{
                background: useRemote ? "rgba(34,197,94,0.16)" : "rgba(255,255,255,0.06)",
                color: useRemote ? THEME.accent.success : THEME.text.secondary,
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              🔄 {t.sync}
            </button>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <p className="font-semibold mb-2" style={{ color: THEME.text.primary }}>
            Data tools
          </p>
          <p className="text-sm mb-4" style={{ color: THEME.text.muted }}>
            Export/Import works offline. Useful to back up or move data.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                const payload = { v: 1, lang, balance, transactions, limits, goals, categories, exportedAt: new Date().toISOString() };
                const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `hamyon-backup-${todayISO()}.json`;
                a.click();
                URL.revokeObjectURL(url);
                showToast("✓ Export", true);
              }}
              className="py-4 rounded-2xl font-semibold"
              style={{ background: THEME.bg.card, color: THEME.text.secondary, border: "1px solid rgba(255,255,255,0.06)" }}
            >
              ⬇ Export
            </button>

            <button
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "application/json";
                input.onchange = async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const text = await file.text();
                  try {
                    const obj = JSON.parse(text);
                    setLang(obj.lang || "uz");
                    setBalance(Number(obj.balance || 0));
                    setTransactions(Array.isArray(obj.transactions) ? obj.transactions : []);
                    setLimits(Array.isArray(obj.limits) ? obj.limits : []);
                    setGoals(Array.isArray(obj.goals) ? obj.goals : []);
                    setCategories(obj.categories || DEFAULT_CATEGORIES);
                    showToast("✓ Import", true);
                  } catch {
                    showToast("Import failed", false);
                  }
                };
                input.click();
              }}
              className="py-4 rounded-2xl font-semibold"
              style={{ background: THEME.bg.card, color: THEME.text.secondary, border: "1px solid rgba(255,255,255,0.06)" }}
            >
              ⬆ Import
            </button>
          </div>

          <div className="mt-4">
            <button
              onClick={() => {
                if (!confirm("Reset all local data?")) return;
                setBalance(0);
                setTransactions([]);
                setLimits([]);
                setGoals([]);
                setCategories(DEFAULT_CATEGORIES);
                showToast("✓ Reset", true);
              }}
              className="w-full py-4 rounded-2xl font-semibold"
              style={{ background: "rgba(239,68,68,0.14)", color: THEME.accent.danger, border: "1px solid rgba(255,255,255,0.06)" }}
            >
              🗑 {t.resetLocal}
            </button>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );

  // ---------------------------
  // Bottom navigation
  // ---------------------------
  const BottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4" style={{ background: "linear-gradient(to top, rgba(15,15,20,0.95), rgba(15,15,20,0.0))" }}>
      <div className="mx-auto max-w-md rounded-3xl p-2 flex items-center justify-between" style={{ background: "rgba(28,28,38,0.9)", border: "1px solid rgba(255,255,255,0.06)" }}>
        {[
          { label: t.home, icon: "🏠", onClick: () => {} },
          { label: t.transactions, icon: "🧾", onClick: () => setShowTransactionsScreen(true) },
          { label: t.add, icon: "➕", onClick: () => openAddTx("expense"), primary: true },
          { label: t.debts, icon: "💳", onClick: () => setShowDebtsScreen(true) },
          { label: t.settings, icon: "⚙️", onClick: () => setShowSettingsScreen(true) },
        ].map((x, i) => (
          <button
            key={i}
            onClick={x.onClick}
            className="flex-1 py-3 rounded-2xl flex flex-col items-center justify-center gap-1"
            style={{ background: x.primary ? THEME.gradient.primary : "transparent", color: x.primary ? "#000" : THEME.text.secondary, margin: x.primary ? "0 6px" : 0 }}
          >
            <span className="text-xl">{x.icon}</span>
            <span className="text-[11px] font-semibold">{x.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // ---------------------------
  // Main render
  // ---------------------------
  return (
    <div className="min-h-screen" style={{ background: THEME.bg.primary }}>
      <HomeScreen />
      <BottomNav />

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="fixed bottom-24 left-0 right-0 z-50 flex justify-center px-4">
            <div
              className="px-4 py-3 rounded-2xl text-sm font-semibold"
              style={{
                background: toast.ok ? "rgba(34,197,94,0.18)" : "rgba(239,68,68,0.18)",
                color: toast.ok ? THEME.accent.success : THEME.accent.danger,
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {toast.msg}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddTx && addTxModalContent}
        {showCategories && <CategoriesScreen key="categories-screen" />}
        {showLimits && <LimitsScreen key="limits-screen" />}
        {showTransactions && <TransactionsScreen key="transactions-screen" />}
        {showAnalytics && <AnalyticsScreen key="analytics-screen" />}
        {showDebts && <DebtsScreen key="debts-screen" />}
        {showGoals && <GoalsScreen key="goals-screen" />}
        {showSettings && <SettingsScreen key="settings-screen" />}
      </AnimatePresence>
    </div>
  );
}
