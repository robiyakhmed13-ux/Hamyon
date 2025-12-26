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
    add: "Qo'shish",
    transactions: "Tranzaksiyalar",
    categories: "Kategoriyalar",
    limits: "Limitlar",
    goals: "Maqsadlar",
    debts: "Qarzlar",
    settings: "Sozlamalar",
    openBot: "Botni ochish",
    addTransaction: "Tranzaksiya qo'shish",
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
    delete: "O'chirish",
    edit: "Tahrirlash",
    empty: "Hozircha hech narsa yo'q",
    allTransactions: "Barcha tranzaksiyalar",
    filters: "Filtrlar",
    all: "Hammasi",
    today: "Bugun",
    week: "Bu hafta",
    month: "Bu oy",
    addCategory: "Kategoriya qo'shish",
    editCategory: "Kategoriyani tahrirlash",
    language: "Til",
    dataMode: "Ma'lumotlar rejimi",
    localMode: "Local (offline)",
    remoteMode: "Supabase (online)",
    sync: "Yangilash / Sync",
    syncOk: "Synclandi",
    syncFail: "Sync bo'lmadi (offline ishlayapti)",
    confirmDelete: "O'chirishni tasdiqlaysizmi?",
    quickAdd: "Tez qo'shish",
    addExpense: "Xarajat qo'shish",
    addIncome: "Daromad qo'shish",
    analytics: "Analitika",
    weekSpending: "Haftalik xarajat",
    monthSpending: "Oylik xarajat",
    topCategories: "Top kategoriyalar",
    noLimits: "Limitlar yo'q",
    noGoals: "Maqsadlar yo'q",
    noCategories: "Kategoriyalar yo'q",
    botHint: "Bot orqali ham qo'shishingiz mumkin, lekin mini-app mustaqil ishlaydi.",
    tgOpen: "Telegramda ochish",
    resetLocal: "Local ma'lumotlarni tozalash",
    deposit: "Qo'shish",
    withdraw: "Olmoq"
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
    deposit: "Пополнить",
    withdraw: "Снять"
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
    deposit: "Deposit",
    withdraw: "Withdraw"
  },
};

const LANGS = [
  { key: "uz", label: "O'zbek", flag: "🇺🇿" },
  { key: "ru", label: "Русский", flag: "🇷🇺" },
  { key: "en", label: "English", flag: "🇬🇧" },
];

// ---------------------------
// Elegant Modern Theme
// ---------------------------
const THEME = {
  bg: {
    primary: "#0F172A",
    secondary: "#1E293B",
    card: "rgba(30, 41, 59, 0.7)",
    cardHover: "rgba(30, 41, 59, 0.9)",
    input: "rgba(15, 23, 42, 0.5)",
    modal: "rgba(15, 23, 42, 0.95)",
  },
  accent: {
    primary: "#3B82F6",
    secondary: "#8B5CF6",
    tertiary: "#06B6D4",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#0EA5E9",
    purple: "#8B5CF6",
  },
  text: {
    primary: "#F1F5F9",
    secondary: "#CBD5E1",
    muted: "#94A3B8",
    light: "#E2E8F0",
  },
  gradient: {
    primary: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
    secondary: "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
    success: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
    danger: "linear-gradient(135deg, #EF4444 0%, #DC2626 100%)",
    premium: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
    teal: "linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)",
    dark: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
    glass: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
  },
  shadow: {
    card: "0 20px 50px rgba(0, 0, 0, 0.25), 0 4px 20px rgba(0, 0, 0, 0.15)",
    button: "0 10px 30px rgba(59, 130, 246, 0.25), 0 4px 15px rgba(59, 130, 246, 0.15)",
    modal: "0 30px 60px rgba(0, 0, 0, 0.5), 0 10px 40px rgba(0, 0, 0, 0.3)",
    glow: "0 0 40px rgba(59, 130, 246, 0.2)",
  }
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
    initial={false}
    onClick={onClick}
    className={`relative overflow-hidden rounded-3xl ${onClick ? "cursor-pointer" : ""} ${className}`}
    style={{ 
      background: gradient || THEME.bg.card,
      backdropFilter: "blur(10px)",
      boxShadow: THEME.shadow.card,
      border: "1px solid rgba(255, 255, 255, 0.1)",
      ...style 
    }}
  >
    {children}
  </motion.div>
);

const ModalShell = ({ children, onClose, mode = "bottom" }) => {
  const backdrop = { background: "rgba(0,0,0,0.85)", backdropFilter: "blur(5px)" };

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
          className="w-full max-w-md rounded-3xl p-6"
          style={{ 
            background: THEME.bg.modal,
            backdropFilter: "blur(20px)",
            boxShadow: THEME.shadow.modal,
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
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
        style={{ 
          background: THEME.bg.modal,
          backdropFilter: "blur(20px)",
          boxShadow: THEME.shadow.modal,
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-1.5 rounded-full mx-auto mb-6" style={{ background: "rgba(255,255,255,0.2)" }} />
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
  const [dataMode, setDataMode] = useState(() => safeJSON.get("hamyon_dataMode", "auto"));

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

  // Forms - FIX: Use refs to prevent re-rendering issues
  const txFormRef = useRef({
    type: "expense",
    amount: "",
    description: "",
    categoryId: "food",
    date: todayISO(),
  });

  const [txForm, setTxForm] = useState(txFormRef.current);

  const limitFormRef = useRef({ id: null, categoryId: "food", amount: "" });
  const [limitForm, setLimitForm] = useState(limitFormRef.current);

  const goalFormRef = useRef({ id: null, name: "", target: "", current: "", emoji: "🎯" });
  const [goalForm, setGoalForm] = useState(goalFormRef.current);

  // FIX: Use stable handlers that don't cause re-renders
  const handleTxFormChange = useMemo(() => (field, value) => {
    txFormRef.current = { ...txFormRef.current, [field]: value };
    setTxForm(txFormRef.current);
  }, []);

  const handleLimitFormChange = useMemo(() => (field, value) => {
    limitFormRef.current = { ...limitFormRef.current, [field]: value };
    setLimitForm(limitFormRef.current);
  }, []);

  const handleGoalFormChange = useMemo(() => (field, value) => {
    goalFormRef.current = { ...goalFormRef.current, [field]: value };
    setGoalForm(goalFormRef.current);
  }, []);

  // ---------------------------
  // Telegram Keyboard Fix
  // ---------------------------
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      tg.setHeaderColor(THEME.bg.primary);
      tg.setBackgroundColor(THEME.bg.primary);
      
      if (tg.disableVerticalSwipes) tg.disableVerticalSwipes();
      if (tg.disableHorizontalSwipes) tg.disableHorizontalSwipes();
    }
    
    const style = document.createElement('style');
    style.textContent = `
      input, textarea {
        font-size: 16px !important;
        background: ${THEME.bg.input} !important;
        color: ${THEME.text.light} !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        border-radius: 16px !important;
        padding: 16px !important;
      }
      input:focus, textarea:focus {
        outline: none !important;
        border-color: ${THEME.accent.primary} !important;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
      }
      * {
        -webkit-tap-highlight-color: transparent;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // ---------------------------
  // Toast
  // ---------------------------
  const showToast = (msg, ok = true) => {
    setToast({ msg, ok });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
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
    txFormRef.current = {
      type,
      amount: "",
      description: "",
      categoryId: defaultCat,
      date: todayISO(),
    };
    setTxForm(txFormRef.current);
    setShowAddTx(true);
  };

  const openEditTx = (tx) => {
    setEditTxId(tx.id);
    txFormRef.current = {
      type: tx.type,
      amount: String(Math.abs(tx.amount)),
      description: tx.description || "",
      categoryId: tx.categoryId,
      date: tx.date || todayISO(),
    };
    setTxForm(txFormRef.current);
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
    setTransactions((prev) => prev.filter((x) => x.id !== tx.id));
    setBalance((b) => b - tx.amount);
    showToast("✓", true);
    await deleteTxRemote(tx);
  };

  // ---------------------------
  // CRUD: Limits
  // ---------------------------
  const openAddLimit = () => {
    limitFormRef.current = { id: null, categoryId: allCats.expense[0]?.id || "food", amount: "" };
    setLimitForm(limitFormRef.current);
  };

  const openEditLimit = (lim) => {
    limitFormRef.current = { id: lim.id, categoryId: lim.categoryId, amount: String(lim.amount) };
    setLimitForm(limitFormRef.current);
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
    limitFormRef.current = { id: null, categoryId: allCats.expense[0]?.id || "food", amount: "" };
    setLimitForm(limitFormRef.current);
  };

  const deleteLimit = (id) => {
    setLimits((prev) => prev.filter((x) => x.id !== id));
    showToast("✓", true);
  };

  // ---------------------------
  // CRUD: Goals
  // ---------------------------
  const openAddGoal = () => {
    goalFormRef.current = { id: null, name: "", target: "", current: "0", emoji: "🎯" };
    setGoalForm(goalFormRef.current);
  };
  
  const openEditGoal = (g) => {
    goalFormRef.current = { id: g.id, name: g.name, target: String(g.target), current: String(g.current), emoji: g.emoji || "🎯" };
    setGoalForm(goalFormRef.current);
  };

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
    goalFormRef.current = { id: null, name: "", target: "", current: "", emoji: "🎯" };
    setGoalForm(goalFormRef.current);
  };

  const deleteGoal = (id) => {
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
    const BOT_USERNAME = "hamyonmoneybot";
    if (window.Telegram?.WebApp?.openTelegramLink) {
      window.Telegram.WebApp.openTelegramLink(`https://t.me/${BOT_USERNAME}`);
    } else {
      window.open(`https://t.me/${BOT_USERNAME}`, "_blank");
    }
  };

  // ---------------------------
  // UI Components
  // ---------------------------
  const Header = () => (
    <header className="px-6 pt-8 pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div 
            className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold relative"
            style={{ 
              background: THEME.gradient.primary,
              boxShadow: THEME.shadow.glow
            }}
          >
            {(tgUser?.first_name || "U").charAt(0)}
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-[#0F172A]"></div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              {t.hello}, {tgUser?.first_name || "User"}!
            </h1>
            <p className="text-sm flex items-center gap-2" style={{ color: THEME.text.secondary }}>
              <span className="text-yellow-400">★</span> {t.assistant}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <button
            className="text-3xl font-black tracking-tight"
            style={{ 
              background: THEME.gradient.premium,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            onClick={() => setShowSettingsScreen(true)}
            title={t.settings}
          >
            {t.appName}
          </button>
          <span className="text-xs px-2 py-1 rounded-full mt-1" 
            style={{ 
              background: "rgba(59, 130, 246, 0.2)",
              color: THEME.accent.primary
            }}>
            PREMIUM
          </span>
        </div>
      </div>
    </header>
  );

  const BalanceCard = () => (
    <div className="px-6 mb-6">
      <GlassCard className="p-6" gradient={THEME.gradient.dark}>
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <p className="text-sm mb-3 flex items-center gap-3" style={{ color: THEME.text.muted }}>
              <span className="w-3 h-3 rounded-full animate-pulse" style={{ background: THEME.accent.primary }} />
              {t.balance}
            </p>
            <div className="flex items-baseline gap-3">
              <h2 className="text-5xl font-black bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
                {formatUZS(balance)}
              </h2>
              <span className="text-sm font-semibold px-3 py-1.5 rounded-full" 
                style={{ 
                  background: "rgba(59, 130, 246, 0.2)",
                  color: THEME.accent.primary,
                  border: "1px solid rgba(59, 130, 246, 0.3)"
                }}>
                UZS
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={syncFromRemote}
              className="px-5 py-4 rounded-2xl font-semibold flex items-center gap-3 transition-all hover:scale-105 active:scale-95"
              style={{
                background: useRemote ? THEME.gradient.success : THEME.gradient.secondary,
                color: "white",
                boxShadow: useRemote ? THEME.shadow.button : THEME.shadow.card,
              }}
            >
              <span className="text-xl animate-spin-slow">⚡</span>
              <div className="text-left">
                <div className="font-bold">{t.sync}</div>
                <div className="text-xs opacity-80">{useRemote ? "Online" : "Offline"}</div>
              </div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl" style={{ 
            background: "rgba(239, 68, 68, 0.15)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
          }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" 
                style={{ background: "rgba(239, 68, 68, 0.3)" }}>
                <span className="text-xl" style={{ color: "#FCA5A5" }}>↓</span>
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#FCA5A5" }}>
                  {t.expenses}
                </p>
                <p className="text-lg font-bold" style={{ color: "#FCA5A5" }}>
                  {todayExp ? `-${formatUZS(todayExp)}` : "0"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl" style={{ 
            background: "rgba(16, 185, 129, 0.15)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(16, 185, 129, 0.2)",
          }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" 
                style={{ background: "rgba(16, 185, 129, 0.3)" }}>
                <span className="text-xl" style={{ color: "#6EE7B7" }}>↑</span>
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#6EE7B7" }}>
                  {t.income}
                </p>
                <p className="text-lg font-bold" style={{ color: "#6EE7B7" }}>
                  {todayInc ? `+${formatUZS(todayInc)}` : "0"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );

  const QuickActions = () => (
    <div className="px-6 mb-6">
      <div className="grid grid-cols-4 gap-3">
        {[
          { icon: "💸", label: t.addExpense, action: () => openAddTx("expense"), grad: THEME.gradient.danger },
          { icon: "💰", label: t.addIncome, action: () => openAddTx("income"), grad: THEME.gradient.success },
          { icon: "📊", label: t.categories, action: () => setShowCategories(true), grad: THEME.gradient.secondary },
          { icon: "🎯", label: t.limits, action: () => setShowLimitsScreen(true), grad: THEME.gradient.premium },
        ].map((x, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            initial={false}
            onClick={x.action}
            className="p-4 rounded-2xl flex flex-col items-center gap-3 relative overflow-hidden group"
            style={{ 
              background: x.grad,
              boxShadow: THEME.shadow.card
            }}
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="text-2xl">{x.icon}</div>
            <span className="text-xs font-semibold text-center" style={{ color: "white" }}>
              {x.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );

  const AnalyticsCard = () => (
    <div className="px-6 mb-6">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={false}
        onClick={() => setShowAnalyticsScreen(true)}
        className="w-full p-5 rounded-3xl flex items-center justify-between group relative overflow-hidden"
        style={{ 
          background: THEME.gradient.glass,
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: THEME.shadow.card
        }}
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: THEME.gradient.teal }}>
            <span className="text-2xl">📈</span>
          </div>
          <div className="text-left">
            <p className="font-bold text-lg" style={{ color: THEME.text.primary }}>
              {t.analytics}
            </p>
            <p className="text-sm" style={{ color: THEME.text.secondary }}>
              {t.weekSpending}: {formatUZS(weekSpend)} • {t.monthSpending}: {formatUZS(monthSpend)}
            </p>
          </div>
        </div>
        <span className="text-2xl opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all">→</span>
      </motion.button>
    </div>
  );

  const RecentTx = () => (
    <div className="px-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg" style={{ color: THEME.text.primary }}>
          {t.allTransactions}
        </h3>
        <button 
          onClick={() => setShowTransactionsScreen(true)} 
          className="text-sm font-semibold px-4 py-2 rounded-full"
          style={{ 
            background: "rgba(59, 130, 246, 0.15)",
            color: THEME.accent.primary,
            border: "1px solid rgba(59, 130, 246, 0.2)"
          }}
        >
          {t.all}
        </button>
      </div>

      <div className="space-y-3">
        {transactions.slice(0, 5).length === 0 ? (
          <GlassCard className="p-8 text-center" gradient="rgba(30, 41, 59, 0.5)">
            <span className="text-6xl block mb-4">💳</span>
            <p className="text-lg mb-4" style={{ color: THEME.text.secondary }}>{t.empty}</p>
            <div className="mt-6">
              <button
                onClick={() => openAddTx("expense")}
                className="px-6 py-4 rounded-2xl font-bold text-lg"
                style={{ 
                  background: THEME.gradient.primary, 
                  color: "white",
                  boxShadow: THEME.shadow.button
                }}
              >
                {t.addTransaction}
              </button>
            </div>
          </GlassCard>
        ) : (
          transactions.slice(0, 5).map((tx) => {
            const c = getCat(tx.categoryId);
            return (
              <GlassCard key={tx.id} className="p-4 hover:scale-[1.01] transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl relative" style={{ 
                    background: `${c.color}20`,
                    boxShadow: `0 4px 20px ${c.color}30`
                  }}>
                    {c.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate" style={{ color: THEME.text.primary }}>
                      {tx.description}
                    </p>
                    <p className="text-xs" style={{ color: THEME.text.muted }}>
                      {tx.date} • {catLabel(c)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-lg" style={{ color: tx.amount > 0 ? "#6EE7B7" : "#FCA5A5" }}>
                      {tx.amount > 0 ? "+" : ""}
                      {formatUZS(tx.amount)}
                    </p>
                    <div className="flex gap-2 justify-end mt-2">
                      <button onClick={() => openEditTx(tx)} className="text-xs font-medium px-3 py-1.5 rounded-lg"
                        style={{ 
                          color: THEME.accent.info,
                          background: "rgba(59, 130, 246, 0.15)",
                          border: "1px solid rgba(59, 130, 246, 0.2)"
                        }}>
                        {t.edit}
                      </button>
                      <button onClick={() => removeTx(tx)} className="text-xs font-medium px-3 py-1.5 rounded-lg"
                        style={{ 
                          color: THEME.accent.danger,
                          background: "rgba(239, 68, 68, 0.15)",
                          border: "1px solid rgba(239, 68, 68, 0.2)"
                        }}>
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

      <div className="mt-6">
        <GlassCard className="p-5" gradient="rgba(30, 41, 59, 0.5)">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ 
                background: "rgba(249, 115, 22, 0.2)",
                border: "1px solid rgba(249, 115, 22, 0.3)"
              }}>
                🤖
              </div>
              <div>
                <p className="font-semibold" style={{ color: THEME.text.primary }}>
                  Telegram Bot
                </p>
                <p className="text-sm" style={{ color: THEME.text.secondary }}>
                  {t.botHint}
                </p>
              </div>
            </div>
            <button
              onClick={openBot}
              className="px-5 py-3 rounded-2xl font-semibold whitespace-nowrap"
              style={{
                background: "rgba(249, 115, 22, 0.2)",
                color: "#FB923C",
                border: "1px solid rgba(249, 115, 22, 0.3)",
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
    <div className="pb-32">
      <Header />
      <BalanceCard />
      <QuickActions />
      <AnalyticsCard />
      <RecentTx />
    </div>
  );

  // ---------------------------
  // Add/Edit Transaction Modal
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
    handleTxFormChange('type', newType);
    handleTxFormChange('categoryId', defaultCat);
  };

  const addTxModalContent = (
    <ModalShell key="add-tx-modal" onClose={() => setShowAddTx(false)} mode="bottom">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold" style={{ color: THEME.text.primary }}>
          {editTxId ? t.editTransaction : t.addTransaction}
        </h2>
        <button 
          onClick={() => setShowAddTx(false)} 
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ 
            background: "rgba(255, 255, 255, 0.1)",
            color: THEME.text.muted 
          }}
        >
          ✕
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        {[
          { k: "expense", label: t.expense, icon: "💸", color: "#EF4444" },
          { k: "income", label: t.incomeType, icon: "💰", color: "#10B981" },
          { k: "debt", label: t.debtType, icon: "💳", color: "#8B5CF6" },
        ].map((x) => (
          <button
            key={x.k}
            onClick={() => setTxType(x.k)}
            className="flex-1 py-4 rounded-2xl flex flex-col items-center gap-2 transition-all"
            style={{
              background: txModalType === x.k ? `rgba(${txModalType === "expense" ? "239, 68, 68" : txModalType === "income" ? "16, 185, 129" : "139, 92, 246"}, 0.2)` : "rgba(255, 255, 255, 0.05)",
              color: txModalType === x.k ? THEME.text.primary : THEME.text.muted,
              border: `2px solid ${txModalType === x.k ? x.color : "transparent"}`,
            }}
          >
            <span className="text-2xl">{x.icon}</span>
            <span className="text-sm font-semibold">{x.label}</span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold block mb-3" style={{ color: THEME.text.secondary }}>
            {t.amount} (UZS)
          </label>
          <input
            value={txForm.amount}
            onChange={(e) => {
              const val = e.target.value.replace(/[^\d]/g, '');
              handleTxFormChange('amount', val);
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            className="w-full p-5 rounded-2xl text-xl font-bold"
            style={{ 
              background: THEME.bg.input,
              color: THEME.text.primary,
              border: "2px solid rgba(255, 255, 255, 0.1)",
            }}
            placeholder="15000"
            autoFocus
          />
        </div>

        <div>
          <label className="text-sm font-semibold block mb-3" style={{ color: THEME.text.secondary }}>
            {t.description}
          </label>
          <input
            value={txForm.description}
            onChange={(e) => handleTxFormChange('description', e.target.value)}
            type="text"
            className="w-full p-5 rounded-2xl"
            style={{ 
              background: THEME.bg.input,
              color: THEME.text.primary,
              border: "2px solid rgba(255, 255, 255, 0.1)",
            }}
            placeholder={catLabel(getCat(txForm.categoryId))}
          />
        </div>

        <div>
          <label className="text-sm font-semibold block mb-3" style={{ color: THEME.text.secondary }}>
            {t.date}
          </label>
          <input
            value={txForm.date}
            onChange={(e) => handleTxFormChange('date', e.target.value)}
            type="date"
            className="w-full p-5 rounded-2xl"
            style={{ 
              background: THEME.bg.input,
              color: THEME.text.primary,
              border: "2px solid rgba(255, 255, 255, 0.1)",
            }}
          />
        </div>

        <div>
          <label className="text-sm font-semibold block mb-3" style={{ color: THEME.text.secondary }}>
            {t.category}
          </label>
          <div className="grid grid-cols-4 gap-3">
            {txModalCats.map((c) => (
              <button
                key={c.id}
                onClick={() => handleTxFormChange('categoryId', c.id)}
                className="p-4 rounded-2xl flex flex-col items-center gap-2 transition-all"
                style={{
                  background: txForm.categoryId === c.id ? `${c.color}30` : "rgba(255, 255, 255, 0.05)",
                  border: txForm.categoryId === c.id ? `2px solid ${c.color}` : "2px solid transparent",
                  transform: txForm.categoryId === c.id ? "scale(1.05)" : "scale(1)",
                }}
              >
                <span className="text-2xl">{c.emoji}</span>
                <span className="text-xs w-full truncate text-center" style={{ color: THEME.text.secondary }}>
                  {catLabel(c)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <button
            onClick={() => setShowAddTx(false)}
            className="flex-1 py-5 rounded-2xl font-bold text-lg"
            style={{ 
              background: "rgba(255, 255, 255, 0.05)", 
              color: THEME.text.secondary, 
              border: "2px solid rgba(255, 255, 255, 0.1)" 
            }}
          >
            {t.cancel}
          </button>
          <button 
            onClick={saveTx} 
            className="flex-1 py-5 rounded-2xl font-bold text-lg"
            style={{ 
              background: THEME.gradient.primary, 
              color: "white",
              boxShadow: THEME.shadow.button
            }}
          >
            {t.save}
          </button>
        </div>
      </div>
    </ModalShell>
  );

  // ---------------------------
  // Categories Screen
  // ---------------------------
  const CategoriesScreen = () => {
    const [activeType, setActiveType] = useState("expense");
    const list = allCats[activeType] || [];

    const [editInlineId, setEditInlineId] = useState(null);
    const [editName, setEditName] = useState("");

    const [showAddCat, setShowAddCat] = useState(false);
    const [newCatName, setNewCatName] = useState("");
    const [newCatEmoji, setNewCatEmoji] = useState("📦");
    const [newCatColor, setNewCatColor] = useState("#90A4AE");

    const [pendingDeleteId, setPendingDeleteId] = useState(null);

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

    const openAddCategory = () => {
      setNewCatName("");
      setNewCatEmoji("📦");
      setNewCatColor("#90A4AE");
      setShowAddCat(true);
    };

    const saveNewCategory = () => {
      const nm = String(newCatName || "").trim();
      if (!nm) return;

      const newId = uid().slice(0, 8);
      const safeEmoji = String(newCatEmoji || "📦").trim() || "📦";
      const safeColor = String(newCatColor || "#90A4AE").trim() || "#90A4AE";

      const newCat = {
        id: newId,
        uz: nm,
        ru: nm,
        en: nm,
        emoji: safeEmoji,
        color: safeColor,
        custom: true,
      };

      setCategories((prev) => {
        const copy = { ...prev, [activeType]: [...(prev[activeType] || [])] };
        copy[activeType].unshift(newCat);
        return copy;
      });

      setShowAddCat(false);
      showToast("✓", true);
    };

    const requestDeleteCategory = (catId) => {
      setPendingDeleteId(catId);
    };

    const confirmDeleteCategory = () => {
      const catId = pendingDeleteId;
      if (!catId) return;

      const usedTx = transactions.some((x) => x.categoryId === catId);
      const usedLim = limits.some((x) => x.categoryId === catId);
      if (usedTx || usedLim) {
        setPendingDeleteId(null);
        showToast("⚠️ Foydalanilgan", false);
        return;
      }

      setCategories((prev) => {
        const copy = { ...prev, [activeType]: [...(prev[activeType] || [])] };
        copy[activeType] = copy[activeType].filter((c) => c.id !== catId);
        return copy;
      });

      setPendingDeleteId(null);
      showToast("✓", true);
    };

    const cancelDeleteCategory = () => setPendingDeleteId(null);

    return (
      <motion.div
        initial={false}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        className="fixed inset-0 z-50 overflow-y-auto"
        style={{ background: THEME.bg.primary }}
      >
        <div className="p-6 pb-32">
          <div className="flex items-center gap-4 mb-8">
            <motion.button
              whileTap={{ scale: 0.9 }}
              initial={false}
              onClick={() => setShowCategories(false)}
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ 
                background: THEME.bg.card,
                backdropFilter: "blur(10px)",
                boxShadow: THEME.shadow.card,
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              ←
            </motion.button>

            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                {t.categories}
              </h1>
              <p className="text-sm" style={{ color: THEME.text.muted }}>
                {list.length} {t.categories.toLowerCase()}
              </p>
            </div>

            <button
              onClick={openAddCategory}
              className="px-6 py-4 rounded-2xl font-bold"
              style={{ 
                background: THEME.gradient.primary, 
                color: "white",
                boxShadow: THEME.shadow.button
              }}
            >
              + {t.addCategory}
            </button>
          </div>

          <div className="flex gap-3 mb-6">
            {[
              { key: "expense", label: t.expense, icon: "💸", count: allCats.expense.length },
              { key: "income", label: t.incomeType, icon: "💰", count: allCats.income.length },
              { key: "debt", label: t.debtType, icon: "💳", count: allCats.debt.length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveType(tab.key);
                  cancelInlineEdit();
                }}
                className="flex-1 py-4 rounded-2xl flex items-center justify-center gap-3 transition-all"
                style={{
                  background: activeType === tab.key ? THEME.bg.card : "transparent",
                  color: activeType === tab.key ? THEME.text.primary : THEME.text.muted,
                  border: `2px solid ${activeType === tab.key ? THEME.accent.primary : "transparent"}`,
                  backdropFilter: "blur(10px)",
                }}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="font-semibold">{tab.label}</span>
                <span className="text-xs px-3 py-1 rounded-full" style={{ 
                  background: activeType === tab.key ? "rgba(59, 130, 246, 0.3)" : "rgba(255, 255, 255, 0.1)" 
                }}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {list.length === 0 ? (
              <GlassCard className="p-8 text-center">
                <span className="text-6xl block mb-4">📁</span>
                <p className="text-lg" style={{ color: THEME.text.muted }}>{t.noCategories}</p>
              </GlassCard>
            ) : (
              list.map((cat) => (
                <GlassCard key={cat.id} className="p-5 hover:scale-[1.01] transition-transform">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                      style={{ 
                        background: `${cat.color}30`,
                        boxShadow: `0 8px 32px ${cat.color}30`,
                        border: `2px solid ${cat.color}50`
                      }}
                    >
                      {cat.emoji}
                    </div>

                    <div className="flex-1 min-w-0">
                      {editInlineId === cat.id ? (
                        <div className="flex items-center gap-3">
                          <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="flex-1 p-4 rounded-2xl"
                            style={{
                              background: THEME.bg.input,
                              color: THEME.text.primary,
                              border: "2px solid rgba(255, 255, 255, 0.1)",
                            }}
                            autoFocus
                          />
                          <button
                            onClick={() => saveInlineEdit(cat)}
                            className="w-12 h-12 rounded-2xl flex items-center justify-center"
                            style={{ background: "rgba(34,197,94,0.3)", border: "2px solid rgba(34, 197, 94, 0.5)" }}
                            title="Save"
                          >
                            💾
                          </button>
                          <button
                            onClick={cancelInlineEdit}
                            className="w-12 h-12 rounded-2xl flex items-center justify-center"
                            style={{ background: "rgba(239,68,68,0.3)", border: "2px solid rgba(239, 68, 68, 0.5)" }}
                            title="Cancel"
                          >
                            ✖
                          </button>
                        </div>
                      ) : (
                        <>
                          <p className="font-semibold text-lg truncate" style={{ color: THEME.text.primary }}>
                            {catLabel(cat)}
                          </p>
                          <p className="text-sm" style={{ color: THEME.text.muted }}>
                            {activeType === "expense" ? `${formatUZS(monthSpentByCategory(cat.id))} UZS (oylik)` : ""}
                          </p>
                        </>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => startInlineEdit(cat)}
                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ 
                          background: "rgba(56, 189, 248, 0.2)",
                          border: "2px solid rgba(56, 189, 248, 0.3)"
                        }}
                        title={t.edit}
                      >
                        <span style={{ color: THEME.accent.info }}>✏️</span>
                      </button>

                      <button
                        onClick={() => requestDeleteCategory(cat.id)}
                        className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ 
                          background: "rgba(239, 68, 68, 0.2)",
                          border: "2px solid rgba(239, 68, 68, 0.3)"
                        }}
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

        {/* Add Category Modal */}
        {showAddCat && (
          <div
            className="fixed inset-0 z-[60] flex items-end justify-center p-4"
            style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(5px)" }}
          >
            <div className="w-full max-w-md rounded-3xl p-6" style={{ 
              background: THEME.bg.modal,
              backdropFilter: "blur(20px)",
              boxShadow: THEME.shadow.modal,
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: THEME.text.primary }}>
                {t.addCategory}
              </h3>

              <input
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder={t.description}
                className="w-full p-4 rounded-2xl mb-3"
                style={{
                  background: THEME.bg.input,
                  color: THEME.text.primary,
                  border: "2px solid rgba(255, 255, 255, 0.1)",
                }}
                autoFocus
              />

              <div className="flex gap-3">
                <input
                  value={newCatEmoji}
                  onChange={(e) => setNewCatEmoji(e.target.value)}
                  className="w-32 p-4 rounded-2xl"
                  style={{
                    background: THEME.bg.input,
                    color: THEME.text.primary,
                    border: "2px solid rgba(255, 255, 255, 0.1)",
                  }}
                  placeholder="📦"
                />
                <input
                  value={newCatColor}
                  onChange={(e) => setNewCatColor(e.target.value)}
                  className="flex-1 p-4 rounded-2xl"
                  style={{
                    background: THEME.bg.input,
                    color: THEME.text.primary,
                    border: "2px solid rgba(255, 255, 255, 0.1)",
                  }}
                  placeholder="#90A4AE"
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddCat(false)}
                  className="flex-1 py-4 rounded-2xl font-bold"
                  style={{ 
                    background: "rgba(255, 255, 255, 0.05)", 
                    color: THEME.text.primary,
                    border: "2px solid rgba(255, 255, 255, 0.1)"
                  }}
                >
                  {t.cancel}
                </button>
                <button
                  onClick={saveNewCategory}
                  className="flex-1 py-4 rounded-2xl font-bold"
                  style={{ 
                    background: THEME.gradient.primary, 
                    color: "white",
                    boxShadow: THEME.shadow.button
                  }}
                >
                  {t.save}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirm Modal */}
        {pendingDeleteId && (
          <div
            className="fixed inset-0 z-[60] flex items-end justify-center p-4"
            style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(5px)" }}
          >
            <div className="w-full max-w-md rounded-3xl p-6" style={{ 
              background: THEME.bg.modal,
              backdropFilter: "blur(20px)",
              boxShadow: THEME.shadow.modal,
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}>
              <h3 className="text-xl font-bold mb-3" style={{ color: THEME.text.primary }}>
                {t.confirmDelete}
              </h3>
              <p className="text-sm mb-6" style={{ color: THEME.text.muted }}>
                {t.delete}?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={cancelDeleteCategory}
                  className="flex-1 py-4 rounded-2xl font-bold"
                  style={{ 
                    background: "rgba(255, 255, 255, 0.05)", 
                    color: THEME.text.primary,
                    border: "2px solid rgba(255, 255, 255, 0.1)"
                  }}
                >
                  {t.cancel}
                </button>
                <button
                  onClick={confirmDeleteCategory}
                  className="flex-1 py-4 rounded-2xl font-bold"
                  style={{ 
                    background: "rgba(239,68,68,0.3)",
                    color: THEME.accent.danger,
                    border: "2px solid rgba(239,68,68,0.5)"
                  }}
                >
                  {t.delete}
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  // ---------------------------
  // Limits Screen
  // ---------------------------
  const LimitsScreen = () => {
    // FIX: Use stable handlers
    const handleLimitInputChange = (field, value) => {
      if (field === 'amount') {
        const val = value.replace(/[^\d]/g, "");
        handleLimitFormChange(field, val);
      } else {
        handleLimitFormChange(field, value);
      }
    };

    return (
      <motion.div
        initial={false}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        className="fixed inset-0 z-50 overflow-y-auto"
        style={{ background: THEME.bg.primary }}
      >
        <div className="p-6 pb-32">
          <div className="flex items-center gap-4 mb-8">
            <motion.button
              whileTap={{ scale: 0.9 }}
              initial={false}
              onClick={() => setShowLimitsScreen(false)}
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ 
                background: THEME.bg.card,
                backdropFilter: "blur(10px)",
                boxShadow: THEME.shadow.card,
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              ←
            </motion.button>

            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-300 bg-clip-text text-transparent">
                {t.limits}
              </h1>
              <p className="text-sm" style={{ color: THEME.text.muted }}>
                {limits.length} {t.limits.toLowerCase()}
              </p>
            </div>

            <button
              onClick={openAddLimit}
              className="px-6 py-4 rounded-2xl font-bold"
              style={{ 
                background: THEME.gradient.premium, 
                color: "white",
                boxShadow: THEME.shadow.button
              }}
            >
              + {t.limits}
            </button>
          </div>

          <div className="space-y-4">
            {limits.length === 0 ? (
              <GlassCard className="p-8 text-center">
                <span className="text-6xl block mb-4">🎯</span>
                <p className="text-lg" style={{ color: THEME.text.muted }}>{t.noLimits}</p>
              </GlassCard>
            ) : (
              limits.map((l) => {
                const c = getCat(l.categoryId);
                const spent = monthSpentByCategory(l.categoryId);
                const pct = l.amount ? Math.round((spent / l.amount) * 100) : 0;
                const isOver = pct >= 100;
                const isNear = pct >= 80;

                return (
                  <GlassCard key={l.id} className="p-6 hover:scale-[1.01] transition-transform">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                          style={{ 
                            background: `${c.color}30`,
                            boxShadow: `0 8px 32px ${c.color}30`,
                            border: `2px solid ${c.color}50`
                          }}
                        >
                          {c.emoji}
                        </div>
                        <div>
                          <p className="font-semibold text-lg" style={{ color: THEME.text.primary }}>
                            {catLabel(c)}
                          </p>
                          <p className="text-sm" style={{ color: THEME.text.muted }}>
                            {formatUZS(spent)} / {formatUZS(l.amount)} UZS
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className="text-2xl font-bold"
                          style={{
                            color: isOver ? THEME.accent.danger : isNear ? THEME.accent.warning : THEME.accent.success,
                          }}
                        >
                          {clamp(pct, 0, 999)}%
                        </p>
                        <div className="flex gap-3 justify-end mt-3">
                          <button onClick={() => openEditLimit(l)} className="text-sm font-semibold px-4 py-2 rounded-lg"
                            style={{ 
                              color: THEME.accent.info,
                              background: "rgba(59, 130, 246, 0.15)",
                              border: "1px solid rgba(59, 130, 246, 0.2)"
                            }}>
                            {t.edit}
                          </button>
                          <button onClick={() => deleteLimit(l.id)} className="text-sm font-semibold px-4 py-2 rounded-lg"
                            style={{ 
                              color: THEME.accent.danger,
                              background: "rgba(239, 68, 68, 0.15)",
                              border: "1px solid rgba(239, 68, 68, 0.2)"
                            }}>
                            {t.delete}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(255, 255, 255, 0.1)" }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: isOver
                            ? THEME.gradient.danger
                            : isNear
                            ? THEME.gradient.premium
                            : `linear-gradient(90deg, ${c.color}, ${c.color}88)`,
                        }}
                        initial={false}
                        animate={{ width: `${clamp(pct, 0, 100)}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                  </GlassCard>
                );
              })
            )}
          </div>

          <div className="mt-8">
            <GlassCard className="p-6">
              <p className="font-bold text-lg mb-4" style={{ color: THEME.text.primary }}>
                {limitForm.id ? t.edit : t.add}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-semibold block mb-3" style={{ color: THEME.text.muted }}>
                    {t.category}
                  </label>
                  <select
                    value={limitForm.categoryId}
                    onChange={(e) => handleLimitInputChange('categoryId', e.target.value)}
                    className="w-full p-4 rounded-2xl"
                    style={{
                      background: THEME.bg.input,
                      color: THEME.text.primary,
                      border: "2px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    {allCats.expense.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.emoji} {catLabel(c)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-semibold block mb-3" style={{ color: THEME.text.muted }}>
                    {t.amount} (UZS)
                  </label>
                  <input
                    value={limitForm.amount}
                    onChange={(e) => handleLimitInputChange('amount', e.target.value)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="w-full p-4 rounded-2xl"
                    style={{
                      background: THEME.bg.input,
                      color: THEME.text.primary,
                      border: "2px solid rgba(255, 255, 255, 0.1)",
                    }}
                    placeholder="500000"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => {
                    limitFormRef.current = { id: null, categoryId: allCats.expense[0]?.id || "food", amount: "" };
                    setLimitForm(limitFormRef.current);
                  }}
                  className="flex-1 py-4 rounded-2xl font-bold"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    color: THEME.text.secondary,
                    border: "2px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  {t.cancel}
                </button>
                <button
                  onClick={saveLimit}
                  className="flex-1 py-4 rounded-2xl font-bold"
                  style={{ 
                    background: THEME.gradient.primary, 
                    color: "white",
                    boxShadow: THEME.shadow.button
                  }}
                >
                  {t.save}
                </button>
              </div>
            </GlassCard>
          </div>
        </div>
      </motion.div>
    );
  };

  // ---------------------------
  // Transactions Screen
  // ---------------------------
  const TransactionsScreen = () => {
    const [filter, setFilter] = useState("all");

    const filtered = useMemo(() => {
      const base = [...transactions];
      if (filter === "all") return base;
      if (filter === "expense") return base.filter((x) => x.type === "expense");
      if (filter === "income") return base.filter((x) => x.type === "income");
      if (filter === "debt") return base.filter((x) => x.type === "debt");
      if (filter === "today") return base.filter((x) => x.date === today);
      if (filter === "week") return base.filter((x) => x.date >= weekStart);
      if (filter === "month") return base.filter((x) => String(x.date || "").startsWith(month));
      return base;
    }, [filter, transactions, today, weekStart, month]);

    const [pendingDeleteId, setPendingDeleteId] = useState(null);

    const requestDelete = (txId) => setPendingDeleteId(txId);

    const confirmDelete = () => {
      const txId = pendingDeleteId;
      if (!txId) return;

      const tx = transactions.find((x) => x.id === txId);
      if (tx) removeTx(tx);

      setPendingDeleteId(null);
    };
    
    const cancelDelete = () => setPendingDeleteId(null);

    return (
      <motion.div
        initial={false}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        className="fixed inset-0 z-50 overflow-y-auto"
        style={{ background: THEME.bg.primary }}
      >
        <div className="p-6 pb-32">
          <div className="flex items-center gap-4 mb-8">
            <motion.button
              whileTap={{ scale: 0.9 }}
              initial={false}
              onClick={() => setShowTransactionsScreen(false)}
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ 
                background: THEME.bg.card,
                backdropFilter: "blur(10px)",
                boxShadow: THEME.shadow.card,
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              ←
            </motion.button>

            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
                {t.allTransactions}
              </h1>
              <p className="text-sm" style={{ color: THEME.text.muted }}>
                {filtered.length} / {transactions.length}
              </p>
            </div>

            <button
              onClick={() => openAddTx("expense")}
              className="px-6 py-4 rounded-2xl font-bold"
              style={{ 
                background: THEME.gradient.primary, 
                color: "white",
                boxShadow: THEME.shadow.button
              }}
            >
              + {t.add}
            </button>
          </div>

          <div className="flex gap-3 mb-6 overflow-x-auto pb-4">
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
                className="px-5 py-3 rounded-2xl whitespace-nowrap font-semibold transition-all"
                style={{
                  background: filter === x.k ? THEME.gradient.primary : "rgba(255, 255, 255, 0.05)",
                  color: filter === x.k ? "white" : THEME.text.secondary,
                  border: `2px solid ${filter === x.k ? THEME.accent.primary : "transparent"}`,
                  boxShadow: filter === x.k ? THEME.shadow.button : "none",
                }}
              >
                {x.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filtered.length === 0 ? (
              <GlassCard className="p-8 text-center">
                <span className="text-6xl block mb-4">📝</span>
                <p className="text-lg" style={{ color: THEME.text.muted }}>{t.empty}</p>
              </GlassCard>
            ) : (
              filtered.map((tx) => {
                const c = getCat(tx.categoryId);
                return (
                  <GlassCard key={tx.id} className="p-5 hover:scale-[1.01] transition-transform">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
                        style={{ 
                          background: `${c.color}30`,
                          boxShadow: `0 8px 32px ${c.color}30`,
                          border: `2px solid ${c.color}50`
                        }}
                      >
                        {c.emoji}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-lg truncate" style={{ color: THEME.text.primary }}>
                          {tx.description}
                        </p>
                        <p className="text-sm" style={{ color: THEME.text.muted }}>
                          {tx.date} • {catLabel(c)} • {tx.source || "app"}
                        </p>
                      </div>

                      <div className="text-right">
                        <p
                          className="font-bold text-xl"
                          style={{ color: tx.amount > 0 ? "#6EE7B7" : "#FCA5A5" }}
                        >
                          {tx.amount > 0 ? "+" : ""}
                          {formatUZS(tx.amount)}
                        </p>

                        <div className="flex gap-3 justify-end mt-3">
                          <button onClick={() => openEditTx(tx)} className="text-sm font-semibold px-4 py-2 rounded-lg"
                            style={{ 
                              color: THEME.accent.info,
                              background: "rgba(59, 130, 246, 0.15)",
                              border: "1px solid rgba(59, 130, 246, 0.2)"
                            }}>
                            {t.edit}
                          </button>
                          <button
                            onClick={() => requestDelete(tx.id)}
                            className="text-sm font-semibold px-4 py-2 rounded-lg"
                            style={{ 
                              color: THEME.accent.danger,
                              background: "rgba(239, 68, 68, 0.15)",
                              border: "1px solid rgba(239, 68, 68, 0.2)"
                            }}
                          >
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

        {/* Delete Modal */}
        {pendingDeleteId && (
          <div className="fixed inset-0 z-[60] flex items-end justify-center p-4" style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(5px)" }}>
            <div className="w-full max-w-md rounded-3xl p-6" style={{ 
              background: THEME.bg.modal,
              backdropFilter: "blur(20px)",
              boxShadow: THEME.shadow.modal,
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: THEME.text.primary }}>
                {t.confirmDelete}
              </h3>
              <div className="flex gap-4">
                <button
                  onClick={cancelDelete}
                  className="flex-1 py-4 rounded-2xl font-bold"
                  style={{ 
                    background: "rgba(255, 255, 255, 0.05)", 
                    color: THEME.text.primary,
                    border: "2px solid rgba(255, 255, 255, 0.1)"
                  }}
                >
                  {t.cancel}
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-4 rounded-2xl font-bold"
                  style={{ 
                    background: "rgba(239,68,68,0.3)",
                    color: THEME.accent.danger,
                    border: "2px solid rgba(239,68,68,0.5)"
                  }}
                >
                  {t.delete}
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  // ---------------------------
  // Analytics Screen
  // ---------------------------
  const AnalyticsScreen = () => (
    <motion.div
      initial={false}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ background: THEME.bg.primary }}
    >
      <div className="p-6 pb-32">
        <div className="flex items-center gap-4 mb-8">
          <motion.button
            whileTap={{ scale: 0.9 }}
            initial={false}
            onClick={() => setShowAnalyticsScreen(false)}
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ 
              background: THEME.bg.card,
              backdropFilter: "blur(10px)",
              boxShadow: THEME.shadow.card,
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            ←
          </motion.button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
              {t.analytics}
            </h1>
            <p className="text-sm" style={{ color: THEME.text.muted }}>
              {t.weekSpending}: {formatUZS(weekSpend)} • {t.monthSpending}: {formatUZS(monthSpend)}
            </p>
          </div>
        </div>

        <GlassCard className="p-6 mb-6">
          <h3 className="font-bold text-lg mb-6" style={{ color: THEME.text.primary }}>
            {t.topCategories} ({month})
          </h3>
          <div className="space-y-5">
            {topCats.length === 0 ? (
              <p className="text-center py-8" style={{ color: THEME.text.muted }}>{t.empty}</p>
            ) : (
              topCats.map((x, i) => (
                <div key={x.categoryId} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl"
                    style={{ background: `${x.cat.color}20`, border: `2px solid ${x.cat.color}30` }}>
                    {x.cat.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold" style={{ color: THEME.text.primary }}>
                        {catLabel(x.cat)}
                      </span>
                      <span className="font-bold" style={{ color: x.cat.color }}>
                        {formatUZS(x.spent)} UZS
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(255, 255, 255, 0.1)" }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: x.cat.color }}
                        initial={false}
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

        <div className="grid grid-cols-2 gap-4">
          <GlassCard className="p-5">
            <p className="text-sm font-semibold mb-2" style={{ color: THEME.text.muted }}>
              {t.weekSpending}
            </p>
            <p className="text-2xl font-bold" style={{ color: THEME.accent.danger }}>
              -{formatUZS(weekSpend)} UZS
            </p>
          </GlassCard>
          <GlassCard className="p-5">
            <p className="text-sm font-semibold mb-2" style={{ color: THEME.text.muted }}>
              {t.monthSpending}
            </p>
            <p className="text-2xl font-bold" style={{ color: THEME.accent.danger }}>
              -{formatUZS(monthSpend)} UZS
            </p>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );

  // ---------------------------
  // Debts Screen
  // ---------------------------
  const DebtsScreen = () => {
    const debtTx = transactions.filter((x) => x.type === "debt");
    const owedByMe = debtTx.filter((x) => x.amount < 0).reduce((s, x) => s + Math.abs(x.amount), 0);
    const owedToMe = debtTx.filter((x) => x.amount > 0).reduce((s, x) => s + x.amount, 0);

    return (
      <motion.div
        initial={false}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        className="fixed inset-0 z-50 overflow-y-auto"
        style={{ background: THEME.bg.primary }}
      >
        <div className="p-6 pb-32">
          <div className="flex items-center gap-4 mb-8">
            <motion.button
              whileTap={{ scale: 0.9 }}
              initial={false}
              onClick={() => setShowDebtsScreen(false)}
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ 
                background: THEME.bg.card,
                backdropFilter: "blur(10px)",
                boxShadow: THEME.shadow.card,
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              ←
            </motion.button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
                {t.debts}
              </h1>
              <p className="text-sm" style={{ color: THEME.text.muted }}>
                {debtTx.length} {t.debts.toLowerCase()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <GlassCard className="p-5 text-center">
              <p className="text-sm mb-2" style={{ color: THEME.text.muted }}>
                Men qarzdorman
              </p>
              <p className="text-2xl font-bold" style={{ color: THEME.accent.danger }}>
                {formatUZS(owedByMe)} UZS
              </p>
            </GlassCard>

            <GlassCard className="p-5 text-center">
              <p className="text-sm mb-2" style={{ color: THEME.text.muted }}>
                Menga qarzdor
              </p>
              <p className="text-2xl font-bold" style={{ color: THEME.accent.success }}>
                {formatUZS(owedToMe)} UZS
              </p>
            </GlassCard>
          </div>

          <button
            onClick={() => openAddTx("debt")}
            className="w-full py-5 rounded-2xl font-bold text-lg mb-8"
            style={{ 
              background: THEME.gradient.secondary, 
              color: "white",
              boxShadow: THEME.shadow.button
            }}
          >
            + {t.addTransaction}
          </button>

          <div className="space-y-4">
            {debtTx.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-7xl mb-6 block">💳</span>
                <p className="text-lg" style={{ color: THEME.text.muted }}>{t.empty}</p>
              </div>
            ) : (
              debtTx.map((tx) => {
                const c = getCat(tx.categoryId);
                return (
                  <GlassCard key={tx.id} className="p-5 hover:scale-[1.01] transition-transform">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ 
                        background: `${c.color}20`,
                        border: `2px solid ${c.color}30`
                      }}>
                        {c.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-lg truncate" style={{ color: THEME.text.primary }}>
                          {tx.description}
                        </p>
                        <p className="text-sm" style={{ color: THEME.text.muted }}>
                          {tx.date} • {catLabel(c)}
                        </p>
                      </div>
                      <p className="font-bold text-xl" style={{ color: tx.amount > 0 ? "#6EE7B7" : "#FCA5A5" }}>
                        {tx.amount > 0 ? "+" : ""}
                        {formatUZS(tx.amount)}
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
  // Goals Screen
  // ---------------------------
  const GoalsScreen = () => {
    const [pendingDeleteGoalId, setPendingDeleteGoalId] = useState(null);

    const [adjustOpen, setAdjustOpen] = useState(false);
    const [adjustGoalId, setAdjustGoalId] = useState(null);
    const [adjustSign, setAdjustSign] = useState(+1);
    const [adjustValue, setAdjustValue] = useState("50000");

    const openAdjust = (goalId, sign) => {
      setAdjustGoalId(goalId);
      setAdjustSign(sign);
      setAdjustValue("50000");
      setAdjustOpen(true);
    };

    const applyAdjust = () => {
      const v = Math.abs(Number(String(adjustValue || "0").replace(/[^\d]/g, ""))) || 0;
      if (!adjustGoalId || v <= 0) {
        setAdjustOpen(false);
        return;
      }
      depositToGoal(adjustGoalId, adjustSign * v);
      setAdjustOpen(false);
    };

    const filteredGoals = goals || [];

    return (
      <motion.div
        initial={false}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        className="fixed inset-0 z-50 overflow-y-auto"
        style={{ background: THEME.bg.primary }}
      >
        <div className="p-6 pb-32">
          <div className="flex items-center gap-4 mb-8">
            <motion.button
              whileTap={{ scale: 0.9 }}
              initial={false}
              onClick={() => setShowGoalsScreen(false)}
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ 
                background: THEME.bg.card,
                backdropFilter: "blur(10px)",
                boxShadow: THEME.shadow.card,
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              ←
            </motion.button>

            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-300 bg-clip-text text-transparent">
                {t.goals}
              </h1>
              <p className="text-sm" style={{ color: THEME.text.muted }}>
                {filteredGoals.length} {t.goals.toLowerCase()}
              </p>
            </div>

            <button
              onClick={openAddGoal}
              className="px-6 py-4 rounded-2xl font-bold"
              style={{ 
                background: THEME.gradient.secondary, 
                color: "white",
                boxShadow: THEME.shadow.button
              }}
            >
              + {t.add}
            </button>
          </div>

          <div className="space-y-4">
            {filteredGoals.length === 0 ? (
              <GlassCard className="p-8 text-center">
                <span className="text-6xl block mb-4">🎯</span>
                <p className="text-lg" style={{ color: THEME.text.muted }}>{t.noGoals}</p>
              </GlassCard>
            ) : (
              filteredGoals.map((g) => {
                const pct = g.target ? Math.round((Number(g.current || 0) / Number(g.target || 1)) * 100) : 0;
                const done = pct >= 100;

                return (
                  <GlassCard key={g.id} className="p-6 hover:scale-[1.01] transition-transform">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-start gap-4">
                        <div
                          className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
                          style={{ 
                            background: "rgba(139,92,246,0.2)",
                            boxShadow: "0 8px 32px rgba(139, 92, 246, 0.2)",
                            border: "2px solid rgba(139, 92, 246, 0.3)"
                          }}
                        >
                          {g.emoji || "🎯"}
                        </div>
                        <div>
                          <p className="font-semibold text-lg" style={{ color: THEME.text.primary }}>
                            {g.name}
                          </p>
                          <p className="text-sm" style={{ color: THEME.text.muted }}>
                            {formatUZS(g.current)} / {formatUZS(g.target)} UZS
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold" style={{ color: done ? THEME.accent.success : THEME.accent.purple }}>
                          {clamp(pct, 0, 999)}%
                        </p>
                        <div className="flex gap-3 justify-end mt-3">
                          <button onClick={() => openEditGoal(g)} className="text-sm font-semibold px-4 py-2 rounded-lg"
                            style={{ 
                              color: THEME.accent.info,
                              background: "rgba(59, 130, 246, 0.15)",
                              border: "1px solid rgba(59, 130, 246, 0.2)"
                            }}>
                            {t.edit}
                          </button>
                          <button
                            onClick={() => setPendingDeleteGoalId(g.id)}
                            className="text-sm font-semibold px-4 py-2 rounded-lg"
                            style={{ 
                              color: THEME.accent.danger,
                              background: "rgba(239, 68, 68, 0.15)",
                              border: "1px solid rgba(239, 68, 68, 0.2)"
                            }}
                          >
                            {t.delete}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="h-3 rounded-full overflow-hidden" style={{ background: "rgba(255, 255, 255, 0.1)" }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: done ? THEME.gradient.success : THEME.gradient.secondary }}
                        initial={false}
                        animate={{ width: `${clamp(pct, 0, 100)}%` }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                      <button
                        onClick={() => openAdjust(g.id, +1)}
                        className="py-4 rounded-2xl font-semibold"
                        style={{
                          background: "rgba(34,197,94,0.15)",
                          color: THEME.accent.success,
                          border: "2px solid rgba(34, 197, 94, 0.2)",
                        }}
                      >
                        + {I18N[lang]?.deposit || "Deposit"}
                      </button>

                      <button
                        onClick={() => openAdjust(g.id, -1)}
                        className="py-4 rounded-2xl font-semibold"
                        style={{
                          background: "rgba(239,68,68,0.15)",
                          color: THEME.accent.danger,
                          border: "2px solid rgba(239, 68, 68, 0.2)",
                        }}
                      >
                        − {I18N[lang]?.withdraw || "Withdraw"}
                      </button>
                    </div>
                  </GlassCard>
                );
              })
            )}
          </div>

          <div className="mt-8">
            <GlassCard className="p-6">
              <p className="font-bold text-lg mb-6" style={{ color: THEME.text.primary }}>
                {goalForm.id ? t.edit : t.add}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-semibold block mb-3" style={{ color: THEME.text.muted }}>
                    {t.description}
                  </label>
                  <input
                    value={goalForm.name}
                    onChange={(e) => handleGoalFormChange('name', e.target.value)}
                    className="w-full p-4 rounded-2xl"
                    style={{ 
                      background: THEME.bg.input, 
                      color: THEME.text.primary, 
                      border: "2px solid rgba(255, 255, 255, 0.1)" 
                    }}
                    placeholder="Masalan: Telefon"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold block mb-3" style={{ color: THEME.text.muted }}>
                    {t.amount} (UZS)
                  </label>
                  <input
                    value={goalForm.target}
                    onChange={(e) => {
                      const v = e.target.value.replace(/[^\d]/g, "");
                      handleGoalFormChange('target', v);
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="w-full p-4 rounded-2xl"
                    style={{ 
                      background: THEME.bg.input, 
                      color: THEME.text.primary, 
                      border: "2px solid rgba(255, 255, 255, 0.1)" 
                    }}
                    placeholder="5000000"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold block mb-3" style={{ color: THEME.text.muted }}>
                    Saved (UZS)
                  </label>
                  <input
                    value={goalForm.current}
                    onChange={(e) => {
                      const v = e.target.value.replace(/[^\d]/g, "");
                      handleGoalFormChange('current', v);
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="w-full p-4 rounded-2xl"
                    style={{ 
                      background: THEME.bg.input, 
                      color: THEME.text.primary, 
                      border: "2px solid rgba(255, 255, 255, 0.1)" 
                    }}
                    placeholder="0"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-semibold block mb-3" style={{ color: THEME.text.muted }}>
                    Emoji
                  </label>
                  <input
                    value={goalForm.emoji}
                    onChange={(e) => handleGoalFormChange('emoji', e.target.value)}
                    className="w-full p-4 rounded-2xl"
                    style={{ 
                      background: THEME.bg.input, 
                      color: THEME.text.primary, 
                      border: "2px solid rgba(255, 255, 255, 0.1)" 
                    }}
                    placeholder="🎯"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => {
                    goalFormRef.current = { id: null, name: "", target: "", current: "", emoji: "🎯" };
                    setGoalForm(goalFormRef.current);
                  }}
                  className="flex-1 py-4 rounded-2xl font-bold"
                  style={{ 
                    background: "rgba(255, 255, 255, 0.05)", 
                    color: THEME.text.secondary, 
                    border: "2px solid rgba(255, 255, 255, 0.1)" 
                  }}
                >
                  {t.cancel}
                </button>
                <button onClick={saveGoal} className="flex-1 py-4 rounded-2xl font-bold" style={{ 
                  background: THEME.gradient.primary, 
                  color: "white",
                  boxShadow: THEME.shadow.button
                }}>
                  {t.save}
                </button>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Adjust Modal */}
        {adjustOpen && (
          <div className="fixed inset-0 z-[60] flex items-end justify-center p-4" style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(5px)" }}>
            <div className="w-full max-w-md rounded-3xl p-6" style={{ 
              background: THEME.bg.modal,
              backdropFilter: "blur(20px)",
              boxShadow: THEME.shadow.modal,
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: THEME.text.primary }}>
                {adjustSign > 0 ? (I18N[lang]?.deposit || "Deposit") : (I18N[lang]?.withdraw || "Withdraw")} (UZS)
              </h3>

              <input
                value={adjustValue}
                onChange={(e) => setAdjustValue(e.target.value.replace(/[^\d]/g, ""))}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-full p-5 rounded-2xl mb-6"
                style={{ 
                  background: THEME.bg.input, 
                  color: THEME.text.primary, 
                  border: "2px solid rgba(255, 255, 255, 0.1)" 
                }}
                placeholder="50000"
                autoFocus
              />

              <div className="flex gap-4">
                <button
                  onClick={() => setAdjustOpen(false)}
                  className="flex-1 py-4 rounded-2xl font-bold"
                  style={{ 
                    background: "rgba(255, 255, 255, 0.05)", 
                    color: THEME.text.primary,
                    border: "2px solid rgba(255, 255, 255, 0.1)"
                  }}
                >
                  {t.cancel}
                </button>
                <button
                  onClick={applyAdjust}
                  className="flex-1 py-4 rounded-2xl font-bold"
                  style={{ 
                    background: THEME.gradient.primary, 
                    color: "white",
                    boxShadow: THEME.shadow.button
                  }}
                >
                  {t.save}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirm Modal */}
        {pendingDeleteGoalId && (
          <div className="fixed inset-0 z-[60] flex items-end justify-center p-4" style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(5px)" }}>
            <div className="w-full max-w-md rounded-3xl p-6" style={{ 
              background: THEME.bg.modal,
              backdropFilter: "blur(20px)",
              boxShadow: THEME.shadow.modal,
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}>
              <h3 className="text-xl font-bold mb-4" style={{ color: THEME.text.primary }}>
                {t.confirmDelete}
              </h3>

              <div className="flex gap-4">
                <button
                  onClick={() => setPendingDeleteGoalId(null)}
                  className="flex-1 py-4 rounded-2xl font-bold"
                  style={{ 
                    background: "rgba(255, 255, 255, 0.05)", 
                    color: THEME.text.primary,
                    border: "2px solid rgba(255, 255, 255, 0.1)"
                  }}
                >
                  {t.cancel}
                </button>
                <button
                  onClick={() => {
                    deleteGoal(pendingDeleteGoalId);
                    setPendingDeleteGoalId(null);
                  }}
                  className="flex-1 py-4 rounded-2xl font-bold"
                  style={{ 
                    background: "rgba(239,68,68,0.3)",
                    color: THEME.accent.danger,
                    border: "2px solid rgba(239,68,68,0.5)"
                  }}
                >
                  {t.delete}
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  // ---------------------------
  // Settings Screen
  // ---------------------------
  const SettingsScreen = () => {
    const [resetOpen, setResetOpen] = useState(false);

    const doReset = () => {
      setBalance(0);
      setTransactions([]);
      setLimits([]);
      setGoals([]);
      setCategories(DEFAULT_CATEGORIES);
      showToast("✓ Reset", true);
      setResetOpen(false);
    };

    return (
      <motion.div
        initial={false}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        className="fixed inset-0 z-50 overflow-y-auto"
        style={{ background: THEME.bg.primary }}
      >
        <div className="p-6 pb-32">
          <div className="flex items-center gap-4 mb-8">
            <motion.button
              whileTap={{ scale: 0.9 }}
              initial={false}
              onClick={() => setShowSettingsScreen(false)}
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ 
                background: THEME.bg.card,
                backdropFilter: "blur(10px)",
                boxShadow: THEME.shadow.card,
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              ←
            </motion.button>

            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                {t.settings}
              </h1>
              <p className="text-sm" style={{ color: THEME.text.muted }}>
                {t.appName} • {tgUser?.id ? `ID: ${tgUser.id}` : "no user"}
              </p>
            </div>
          </div>

          <GlassCard className="p-6 mb-6">
            <p className="font-bold text-lg mb-4" style={{ color: THEME.text.primary }}>
              {t.language}
            </p>
            <div className="grid grid-cols-3 gap-3">
              {LANGS.map((l) => (
                <button
                  key={l.key}
                  onClick={() => setLang(l.key)}
                  className="py-4 rounded-2xl font-bold transition-all"
                  style={{
                    background: lang === l.key ? "rgba(59, 130, 246, 0.3)" : "rgba(255, 255, 255, 0.05)",
                    color: lang === l.key ? "white" : THEME.text.secondary,
                    border: `2px solid ${lang === l.key ? THEME.accent.primary : "transparent"}`,
                    transform: lang === l.key ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  {l.flag} {l.label}
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6 mb-6">
            <p className="font-bold text-lg mb-3" style={{ color: THEME.text.primary }}>
              {t.dataMode}
            </p>
            <p className="text-sm mb-6" style={{ color: THEME.text.muted }}>
              {sb.enabled() ? "✅ Supabase available" : "⚠️ No Supabase env (offline only)"}
            </p>

            <div className="flex rounded-2xl p-1 mb-6" style={{ background: "rgba(255, 255, 255, 0.05)" }}>
              {[
                { k: "auto", label: "Auto", icon: "🤖" },
                { k: "local", label: "Local", icon: "📱" },
                { k: "remote", label: "Cloud", icon: "☁️" },
              ].map((x) => (
                <button
                  key={x.k}
                  onClick={() => setDataMode(x.k)}
                  className="flex-1 py-4 rounded-xl font-bold flex flex-col items-center gap-2 transition-all"
                  style={{
                    background: dataMode === x.k ? THEME.gradient.primary : "transparent",
                    color: dataMode === x.k ? "white" : THEME.text.secondary,
                    transform: dataMode === x.k ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  <span className="text-xl">{x.icon}</span>
                  <span>{x.label}</span>
                </button>
              ))}
            </div>

            <div>
              <button
                onClick={syncFromRemote}
                className="w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-3"
                style={{
                  background: useRemote ? THEME.gradient.success : THEME.gradient.secondary,
                  color: "white",
                  boxShadow: THEME.shadow.button,
                }}
              >
                <span className="text-xl animate-spin-slow">⚡</span>
                <span>{t.sync}</span>
              </button>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <p className="font-bold text-lg mb-4" style={{ color: THEME.text.primary }}>
              Data Management
            </p>
            <p className="text-sm mb-6" style={{ color: THEME.text.muted }}>
              Export/Import works offline. Useful to back up or move data.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
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
                className="py-5 rounded-2xl font-bold flex items-center justify-center gap-2"
                style={{ 
                  background: "rgba(59, 130, 246, 0.15)", 
                  color: THEME.accent.primary,
                  border: "2px solid rgba(59, 130, 246, 0.2)"
                }}
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
                className="py-5 rounded-2xl font-bold flex items-center justify-center gap-2"
                style={{ 
                  background: "rgba(16, 185, 129, 0.15)", 
                  color: THEME.accent.success,
                  border: "2px solid rgba(16, 185, 129, 0.2)"
                }}
              >
                ⬆ Import
              </button>
            </div>

            <div>
              <button
                onClick={() => setResetOpen(true)}
                className="w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-3"
                style={{ 
                  background: "rgba(239,68,68,0.15)", 
                  color: THEME.accent.danger, 
                  border: "2px solid rgba(239,68,68,0.2)"
                }}
              >
                🗑 {t.resetLocal}
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Reset Modal */}
        {resetOpen && (
          <div className="fixed inset-0 z-[60] flex items-end justify-center p-4" style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(5px)" }}>
            <div className="w-full max-w-md rounded-3xl p-6" style={{ 
              background: THEME.bg.modal,
              backdropFilter: "blur(20px)",
              boxShadow: THEME.shadow.modal,
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}>
              <h3 className="text-xl font-bold mb-3" style={{ color: THEME.text.primary }}>
                Reset all local data?
              </h3>
              <p className="text-sm mb-6" style={{ color: THEME.text.muted }}>
                This will delete balance, transactions, limits, goals and custom categories on this device.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setResetOpen(false)}
                  className="flex-1 py-4 rounded-2xl font-bold"
                  style={{ 
                    background: "rgba(255, 255, 255, 0.05)", 
                    color: THEME.text.primary,
                    border: "2px solid rgba(255, 255, 255, 0.1)"
                  }}
                >
                  {t.cancel}
                </button>
                <button
                  onClick={doReset}
                  className="flex-1 py-4 rounded-2xl font-bold"
                  style={{ 
                    background: "rgba(239,68,68,0.3)",
                    color: THEME.accent.danger,
                    border: "2px solid rgba(239,68,68,0.5)"
                  }}
                >
                  {t.delete}
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  // ---------------------------
  // Bottom Navigation
  // ---------------------------
  const BottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-6 pb-6">
      <div className="mx-auto max-w-md rounded-3xl p-4 flex items-center justify-between backdrop-blur-2xl"
        style={{ 
          background: "rgba(15, 23, 42, 0.9)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 -20px 50px rgba(0, 0, 0, 0.5)"
        }}
      >
        {[
          { label: t.home, icon: "🏠", onClick: () => {}, active: true },
          { label: t.transactions, icon: "📊", onClick: () => setShowTransactionsScreen(true) },
          { 
            label: t.add, 
            icon: "➕", 
            onClick: () => openAddTx("expense"), 
            primary: true,
            style: { 
              background: THEME.gradient.primary,
              boxShadow: THEME.shadow.glow,
            }
          },
          { label: t.goals, icon: "🎯", onClick: () => setShowGoalsScreen(true) },
          { label: t.settings, icon: "⚙️", onClick: () => setShowSettingsScreen(true) },
        ].map((x, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.95 }}
            initial={false}
            onClick={x.onClick}
            className={`relative ${x.primary ? "flex flex-col items-center -mt-8" : "flex-1 py-3 flex flex-col items-center gap-1"}`}
            style={{
              transform: x.primary ? "scale(1.2)" : "none",
              zIndex: x.primary ? 10 : 1,
            }}
          >
            <div className={`${x.primary ? "w-20 h-20" : "w-14 h-14"} rounded-2xl flex items-center justify-center transition-all`}
              style={x.primary ? {
                background: x.style?.background,
                boxShadow: x.style?.boxShadow,
              } : {
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}>
              <span className={`${x.primary ? "text-3xl" : "text-2xl"}`}>{x.icon}</span>
            </div>
            {!x.primary && (
              <span className="text-xs font-semibold mt-1" style={{ color: THEME.text.secondary }}>
                {x.label}
              </span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );

  // ---------------------------
  // Main render
  // ---------------------------
  return (
    <div 
      className="min-h-screen fixed inset-0 overflow-y-auto" 
      style={{ 
        background: THEME.bg.primary,
        color: THEME.text.primary,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        WebkitOverflowScrolling: 'touch',
        overscrollBehaviorY: 'contain'
      }}
    >
      <HomeScreen />
      <BottomNav />

      {/* Toast */}
      <AnimatePresence initial={false}>
        {toast && (
          <motion.div
            initial={false}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="fixed top-8 left-0 right-0 z-50 flex justify-center px-6"
          >
            <div
              className="px-8 py-5 rounded-2xl font-bold flex items-center gap-3 backdrop-blur-2xl"
              style={{
                background: toast.ok ? THEME.gradient.success : THEME.gradient.danger,
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                boxShadow: THEME.shadow.modal,
              }}
            >
              <span className="text-xl">{toast.ok ? "✅" : "⚠️"}</span>
              <span>{toast.msg}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screens */}
      <AnimatePresence initial={false} mode="wait">
        {showAddTx && addTxModalContent}

        {showCategories && <CategoriesScreen />}
        {showLimits && <LimitsScreen />}
        {showTransactions && <TransactionsScreen />}
        {showAnalytics && <AnalyticsScreen />}
        {showDebts && <DebtsScreen />}
        {showGoals && <GoalsScreen />}
        {showSettings && <SettingsScreen />}
      </AnimatePresence>
    </div>
  );
}
