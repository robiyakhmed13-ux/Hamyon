import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// HAMYON - COMPLETE WORKING APP
// 3 Languages: Uzbek, Russian, English
// All Features Interactive
// ============================================

// CONFIG - UPDATE THESE!
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const BOT_USERNAME = 'hamyonmoneybot';

// ============================================
// TRANSLATIONS
// ============================================
const TRANSLATIONS = {
  uz: {
    hello: 'Salom',
    assistant: 'Moliyaviy yordamchingiz',
    currentBalance: 'Joriy balans',
    todaySummary: 'Bugungi xulosa',
    expenses: 'Xarajatlar',
    income: 'Daromad',
    limits: 'Limitlar',
    categories: 'Kategoriyalar',
    transactions: 'Tranzaksiyalar',
    debts: 'Qarzlar',
    goals: 'Maqsadlar',
    settings: 'Sozlamalar',
    home: 'Bosh sahifa',
    statistics: 'Statistika',
    addTransaction: 'Tranzaksiya qo\'shish',
    recentTransactions: 'So\'nggi operatsiyalar',
    seeAll: 'Hammasi',
    noTransactions: 'Hali tranzaksiyalar yo\'q',
    sendToBot: 'Botga xabar yuboring!',
    goToBot: 'Botga o\'tish',
    refresh: 'Yangilash',
    loading: 'Yuklanmoqda...',
    error: 'Xatolik yuz berdi',
    retry: 'Qayta urinish',
    addLimit: 'Yangi limit qo\'shish',
    noLimits: 'Hali limitlar yo\'q',
    addGoal: 'Yangi maqsad qo\'shish',
    noGoals: 'Hali maqsadlar yo\'q',
    savingsGoal: 'Jamg\'arma maqsadi',
    category: 'Kategoriya',
    amount: 'Summa',
    save: 'Saqlash',
    cancel: 'Bekor',
    delete: 'O\'chirish',
    edit: 'Tahrirlash',
    goalName: 'Maqsad nomi',
    targetAmount: 'Maqsad summasi',
    comingSoon: 'Tez kunda...',
    voiceMessage: 'Ovozli xabar',
    textMessage: 'Matn xabari',
    receiptPhoto: 'Chek rasmi',
    language: 'Til',
    expense: 'Xarajat',
    debt: 'Qarz',
    left: 'qoldi',
    spent: 'sarflandi',
    of: 'dan',
    addCategory: 'Kategoriya qo\'shish',
    editCategory: 'Kategoriyani tahrirlash',
    categoryName: 'Kategoriya nomi',
    emoji: 'Emoji',
    color: 'Rang',
    borrowed: 'Qarz oldim',
    lent: 'Qarz berdim',
  },
  ru: {
    hello: 'Привет',
    assistant: 'Ваш финансовый помощник',
    currentBalance: 'Текущий баланс',
    todaySummary: 'Сводка за сегодня',
    expenses: 'Расходы',
    income: 'Доходы',
    limits: 'Лимиты',
    categories: 'Категории',
    transactions: 'Транзакции',
    debts: 'Долги',
    goals: 'Цели',
    settings: 'Настройки',
    home: 'Главная',
    statistics: 'Статистика',
    addTransaction: 'Добавить транзакцию',
    recentTransactions: 'Последние операции',
    seeAll: 'Все',
    noTransactions: 'Пока нет транзакций',
    sendToBot: 'Отправьте сообщение боту!',
    goToBot: 'Перейти к боту',
    refresh: 'Обновить',
    loading: 'Загрузка...',
    error: 'Произошла ошибка',
    retry: 'Повторить',
    addLimit: 'Добавить лимит',
    noLimits: 'Пока нет лимитов',
    addGoal: 'Добавить цель',
    noGoals: 'Пока нет целей',
    savingsGoal: 'Цель накопления',
    category: 'Категория',
    amount: 'Сумма',
    save: 'Сохранить',
    cancel: 'Отмена',
    delete: 'Удалить',
    edit: 'Редактировать',
    goalName: 'Название цели',
    targetAmount: 'Целевая сумма',
    comingSoon: 'Скоро...',
    voiceMessage: 'Голосовое сообщение',
    textMessage: 'Текстовое сообщение',
    receiptPhoto: 'Фото чека',
    language: 'Язык',
    expense: 'Расход',
    debt: 'Долг',
    left: 'осталось',
    spent: 'потрачено',
    of: 'из',
    addCategory: 'Добавить категорию',
    editCategory: 'Редактировать категорию',
    categoryName: 'Название категории',
    emoji: 'Эмодзи',
    color: 'Цвет',
    borrowed: 'Я взял в долг',
    lent: 'Я дал в долг',
  },
  en: {
    hello: 'Hello',
    assistant: 'Your financial assistant',
    currentBalance: 'Current balance',
    todaySummary: 'Today\'s summary',
    expenses: 'Expenses',
    income: 'Income',
    limits: 'Limits',
    categories: 'Categories',
    transactions: 'Transactions',
    debts: 'Debts',
    goals: 'Goals',
    settings: 'Settings',
    home: 'Home',
    statistics: 'Statistics',
    addTransaction: 'Add transaction',
    recentTransactions: 'Recent transactions',
    seeAll: 'See all',
    noTransactions: 'No transactions yet',
    sendToBot: 'Send a message to the bot!',
    goToBot: 'Go to bot',
    refresh: 'Refresh',
    loading: 'Loading...',
    error: 'An error occurred',
    retry: 'Retry',
    addLimit: 'Add new limit',
    noLimits: 'No limits yet',
    addGoal: 'Add new goal',
    noGoals: 'No goals yet',
    savingsGoal: 'Savings goal',
    category: 'Category',
    amount: 'Amount',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    goalName: 'Goal name',
    targetAmount: 'Target amount',
    comingSoon: 'Coming soon...',
    voiceMessage: 'Voice message',
    textMessage: 'Text message',
    receiptPhoto: 'Receipt photo',
    language: 'Language',
    expense: 'Expense',
    debt: 'Debt',
    left: 'left',
    spent: 'spent',
    of: 'of',
    addCategory: 'Add category',
    editCategory: 'Edit category',
    categoryName: 'Category name',
    emoji: 'Emoji',
    color: 'Color',
    borrowed: 'I borrowed',
    lent: 'I lent',
  }
};

// ============================================
// CATEGORIES (with translations)
// ============================================
const CATEGORY_NAMES = {
  // Expense
  food: { uz: 'Oziq-ovqat', ru: 'Продукты', en: 'Food' },
  restaurants: { uz: 'Restoranlar', ru: 'Рестораны', en: 'Restaurants' },
  coffee: { uz: 'Kofe', ru: 'Кофе', en: 'Coffee' },
  fastfood: { uz: 'Fast Food', ru: 'Фаст-фуд', en: 'Fast Food' },
  delivery: { uz: 'Yetkazish', ru: 'Доставка', en: 'Delivery' },
  taxi: { uz: 'Taksi', ru: 'Такси', en: 'Taxi' },
  fuel: { uz: 'Benzin', ru: 'Бензин', en: 'Fuel' },
  transport: { uz: 'Transport', ru: 'Транспорт', en: 'Transport' },
  clothing: { uz: 'Kiyim', ru: 'Одежда', en: 'Clothing' },
  electronics: { uz: 'Elektronika', ru: 'Электроника', en: 'Electronics' },
  beauty: { uz: 'Go\'zallik', ru: 'Красота', en: 'Beauty' },
  health: { uz: 'Salomatlik', ru: 'Здоровье', en: 'Health' },
  entertainment: { uz: 'Ko\'ngilochar', ru: 'Развлечения', en: 'Entertainment' },
  education: { uz: 'Ta\'lim', ru: 'Образование', en: 'Education' },
  bills: { uz: 'Kommunal', ru: 'Коммунальные', en: 'Bills' },
  rent: { uz: 'Ijara', ru: 'Аренда', en: 'Rent' },
  other: { uz: 'Boshqa', ru: 'Другое', en: 'Other' },
  // Income
  salary: { uz: 'Oylik', ru: 'Зарплата', en: 'Salary' },
  freelance: { uz: 'Frilanser', ru: 'Фриланс', en: 'Freelance' },
  business: { uz: 'Biznes', ru: 'Бизнес', en: 'Business' },
  bonus: { uz: 'Bonus', ru: 'Бонус', en: 'Bonus' },
  gift: { uz: 'Sovg\'a', ru: 'Подарок', en: 'Gift' },
  // Debt
  borrowed: { uz: 'Qarz oldim', ru: 'Взял в долг', en: 'Borrowed' },
  lent: { uz: 'Qarz berdim', ru: 'Дал в долг', en: 'Lent' },
};

const DEFAULT_CATEGORIES = {
  expense: [
    { id: 'food', emoji: '🍕', color: '#FF6B6B' },
    { id: 'restaurants', emoji: '🍽️', color: '#FF8787' },
    { id: 'coffee', emoji: '☕', color: '#D4A574' },
    { id: 'fastfood', emoji: '🍔', color: '#FFA94D' },
    { id: 'delivery', emoji: '🛵', color: '#FF922B' },
    { id: 'taxi', emoji: '🚕', color: '#FFD43B' },
    { id: 'fuel', emoji: '⛽', color: '#FAB005' },
    { id: 'transport', emoji: '🚌', color: '#F59F00' },
    { id: 'clothing', emoji: '👕', color: '#845EF7' },
    { id: 'electronics', emoji: '📱', color: '#7950F2' },
    { id: 'beauty', emoji: '💄', color: '#E64980' },
    { id: 'health', emoji: '💊', color: '#F06595' },
    { id: 'entertainment', emoji: '🎬', color: '#339AF0' },
    { id: 'education', emoji: '📚', color: '#4DABF7' },
    { id: 'bills', emoji: '💡', color: '#12B886' },
    { id: 'rent', emoji: '🏠', color: '#20C997' },
    { id: 'other', emoji: '📦', color: '#868E96' },
  ],
  income: [
    { id: 'salary', emoji: '💰', color: '#51CF66' },
    { id: 'freelance', emoji: '💻', color: '#40C057' },
    { id: 'business', emoji: '🏢', color: '#37B24D' },
    { id: 'bonus', emoji: '🎉', color: '#F59F00' },
    { id: 'gift', emoji: '🎁', color: '#FF6B6B' },
    { id: 'other', emoji: '💵', color: '#82C91E' },
  ],
  debt: [
    { id: 'borrowed', emoji: '🤝', color: '#FF6B6B' },
    { id: 'lent', emoji: '💸', color: '#51CF66' },
  ]
};

// ============================================
// SUPABASE CLIENT
// ============================================
const db = {
  async request(endpoint, options = {}) {
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.error('Supabase not configured');
      return null;
    }
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
        ...options,
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': options.method === 'POST' ? 'return=representation' : 
                    options.method === 'DELETE' ? 'return=minimal' : undefined,
          ...options.headers,
        },
      });
      if (options.method === 'DELETE') return { success: true };
      return res.json();
    } catch (err) {
      console.error('DB error:', err);
      return null;
    }
  },

  // Users
  async getUser(telegramId) {
    const data = await this.request(`users?telegram_id=eq.${telegramId}&select=*`);
    return data?.[0] || null;
  },
  async createUser(telegramId, name) {
    const data = await this.request('users', {
      method: 'POST',
      body: JSON.stringify({ telegram_id: telegramId, name, balance: 0 }),
    });
    return data?.[0] || null;
  },
  async updateUserBalance(telegramId, newBalance) {
    await this.request(`users?telegram_id=eq.${telegramId}`, {
      method: 'PATCH',
      body: JSON.stringify({ balance: newBalance }),
    });
  },

  // Transactions
  async getTransactions(telegramId) {
    return await this.request(`transactions?user_telegram_id=eq.${telegramId}&select=*&order=created_at.desc&limit=100`) || [];
  },

  // Limits
  async getLimits(telegramId) {
    return await this.request(`limits?user_telegram_id=eq.${telegramId}&select=*`) || [];
  },
  async addLimit(telegramId, categoryId, amount) {
    return await this.request('limits', {
      method: 'POST',
      body: JSON.stringify({ user_telegram_id: telegramId, category_id: categoryId, limit_amount: amount, is_active: true }),
    });
  },
  async deleteLimit(id) {
    return await this.request(`limits?id=eq.${id}`, { method: 'DELETE' });
  },
  async updateLimit(id, amount) {
    return await this.request(`limits?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ limit_amount: amount }),
    });
  },

  // Goals
  async getGoals(telegramId) {
    return await this.request(`goals?user_telegram_id=eq.${telegramId}&select=*`) || [];
  },
  async addGoal(telegramId, name, amount, emoji) {
    return await this.request('goals', {
      method: 'POST',
      body: JSON.stringify({ user_telegram_id: telegramId, name, target_amount: amount, current_amount: 0, emoji: emoji || '🎯' }),
    });
  },
  async deleteGoal(id) {
    return await this.request(`goals?id=eq.${id}`, { method: 'DELETE' });
  },
  async updateGoalAmount(id, amount) {
    return await this.request(`goals?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ current_amount: amount }),
    });
  },

  // Debts
  async getDebts(telegramId) {
    return await this.request(`debts?user_telegram_id=eq.${telegramId}&is_settled=eq.false&select=*`) || [];
  },
};

// ============================================
// HELPERS
// ============================================
const formatMoney = (amount) => {
  if (!amount && amount !== 0) return '0 UZS';
  const abs = Math.abs(amount);
  if (abs >= 1000000) {
    return (amount / 1000000).toFixed(1).replace('.0', '') + 'M UZS';
  }
  return new Intl.NumberFormat('en-US').format(amount).replace(/,/g, ' ') + ' UZS';
};

const THEME = {
  bg: { primary: '#0a0a0f', secondary: '#12121a', card: '#1a1a24', cardHover: '#22222e' },
  accent: { primary: '#f97316', secondary: '#fb923c', success: '#22c55e', warning: '#fbbf24', danger: '#ef4444', info: '#3b82f6' },
  text: { primary: '#fafafa', secondary: '#a1a1aa', muted: '#71717a' },
  gradient: 'linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fbbf24 100%)',
};

// ============================================
// MAIN APP
// ============================================
export default function HamyonApp() {
  // Core state
  const [lang, setLang] = useState(() => localStorage.getItem('hamyon_lang') || 'uz');
  const [loading, setLoading] = useState(true);
  const [telegramUser, setTelegramUser] = useState(null);
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [limits, setLimits] = useState([]);
  const [goals, setGoals] = useState([]);
  const [debts, setDebts] = useState([]);

  // UI state
  const [screen, setScreen] = useState('home');
  const [modal, setModal] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [categoryTab, setCategoryTab] = useState('expense');

  // Forms
  const [formData, setFormData] = useState({});

  const t = TRANSLATIONS[lang];

  // Get category info
  const getCategory = (id, type = 'expense') => {
    const cats = DEFAULT_CATEGORIES[type] || DEFAULT_CATEGORIES.expense;
    const cat = cats.find(c => c.id === id) || cats.find(c => c.id === 'other') || { emoji: '📦', color: '#868E96' };
    const names = CATEGORY_NAMES[id] || { uz: id, ru: id, en: id };
    return { ...cat, name: names[lang] || id };
  };

  // Save language
  useEffect(() => {
    localStorage.setItem('hamyon_lang', lang);
  }, [lang]);

  // Initialize app
  useEffect(() => {
    const init = async () => {
      try {
        let tgUser = null;
        if (window.Telegram?.WebApp) {
          const tg = window.Telegram.WebApp;
          tg.ready();
          tg.expand();
          tg.setHeaderColor('#0a0a0f');
          tg.setBackgroundColor('#0a0a0f');
          tgUser = tg.initDataUnsafe?.user;
        }
        if (!tgUser) tgUser = { id: Date.now(), first_name: 'Test' };
        setTelegramUser(tgUser);

        if (SUPABASE_URL && SUPABASE_KEY) {
          let dbUser = await db.getUser(tgUser.id);
          if (!dbUser) dbUser = await db.createUser(tgUser.id, tgUser.first_name);
          setUser(dbUser);

          const [txs, lims, gls, dbts] = await Promise.all([
            db.getTransactions(tgUser.id),
            db.getLimits(tgUser.id),
            db.getGoals(tgUser.id),
            db.getDebts(tgUser.id),
          ]);
          setTransactions(txs);
          setLimits(lims);
          setGoals(gls);
          setDebts(dbts);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    init();
  }, []);

  // Refresh data
  const refresh = async () => {
    if (!telegramUser || !SUPABASE_URL) return;
    setLoading(true);
    try {
      const [dbUser, txs, lims, gls, dbts] = await Promise.all([
        db.getUser(telegramUser.id),
        db.getTransactions(telegramUser.id),
        db.getLimits(telegramUser.id),
        db.getGoals(telegramUser.id),
        db.getDebts(telegramUser.id),
      ]);
      setUser(dbUser);
      setTransactions(txs);
      setLimits(lims);
      setGoals(gls);
      setDebts(dbts);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // Calculations
  const balance = user?.balance || 0;
  const todayTxs = transactions.filter(tx => tx.created_at?.startsWith(new Date().toISOString().split('T')[0]));
  const todayExpense = todayTxs.filter(tx => tx.amount < 0).reduce((s, tx) => s + Math.abs(tx.amount), 0);
  const todayIncome = todayTxs.filter(tx => tx.amount > 0).reduce((s, tx) => s + tx.amount, 0);

  const getSpent = (categoryId) => {
    const month = new Date().toISOString().slice(0, 7);
    return transactions
      .filter(tx => tx.category_id === categoryId && tx.amount < 0 && tx.created_at?.startsWith(month))
      .reduce((s, tx) => s + Math.abs(tx.amount), 0);
  };

  // Handlers
  const openBot = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink(`https://t.me/${BOT_USERNAME}`);
    } else {
      window.open(`https://t.me/${BOT_USERNAME}`, '_blank');
    }
  };

  const handleAddLimit = async () => {
    if (!formData.categoryId || !formData.amount || !telegramUser) return;
    await db.addLimit(telegramUser.id, formData.categoryId, parseInt(formData.amount));
    await refresh();
    setModal(null);
    setFormData({});
  };

  const handleDeleteLimit = async (id) => {
    await db.deleteLimit(id);
    await refresh();
  };

  const handleAddGoal = async () => {
    if (!formData.name || !formData.amount || !telegramUser) return;
    await db.addGoal(telegramUser.id, formData.name, parseInt(formData.amount), formData.emoji || '🎯');
    await refresh();
    setModal(null);
    setFormData({});
  };

  const handleDeleteGoal = async (id) => {
    await db.deleteGoal(id);
    await refresh();
  };

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: THEME.bg.primary }}>
        <div className="text-center">
          <motion.div 
            className="text-5xl mb-4"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            💰
          </motion.div>
          <p style={{ color: THEME.text.secondary }}>{t.loading}</p>
        </div>
      </div>
    );
  }

  // ============================================
  // SCREENS
  // ============================================

  const HomeScreen = () => (
    <div className="pb-40">
      {/* Header */}
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold" style={{ background: THEME.gradient }}>
            {(telegramUser?.first_name || 'U')[0]}
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: THEME.text.primary }}>
              {t.hello}, {telegramUser?.first_name}!
            </h1>
            <p className="text-sm" style={{ color: THEME.text.muted }}>{t.assistant}</p>
          </div>
        </div>
        <div className="text-2xl font-black" style={{ background: THEME.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Hamyon
        </div>
      </div>

      {/* Balance */}
      <div className="px-5 mb-4">
        <div className="p-5 rounded-3xl" style={{ background: THEME.bg.card }}>
          <p className="text-sm mb-1" style={{ color: THEME.text.muted }}>{t.currentBalance}</p>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: THEME.accent.success }} />
            <h2 className="text-3xl font-bold" style={{ color: THEME.text.primary }}>{formatMoney(balance)}</h2>
          </div>
          <div className="p-4 rounded-2xl" style={{ background: THEME.bg.secondary }}>
            <p className="text-sm mb-3 text-center" style={{ color: THEME.text.muted }}>{t.todaySummary}</p>
            <div className="flex">
              <div className="flex-1 text-center">
                <p className="text-lg font-bold" style={{ color: THEME.accent.danger }}>{formatMoney(todayExpense)}</p>
                <p className="text-xs" style={{ color: THEME.text.muted }}>↘ {t.expenses}</p>
              </div>
              <div className="w-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
              <div className="flex-1 text-center">
                <p className="text-lg font-bold" style={{ color: THEME.accent.success }}>{formatMoney(todayIncome)}</p>
                <p className="text-xs" style={{ color: THEME.text.muted }}>↗ {t.income}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-5 grid grid-cols-2 gap-3 mb-4">
        {[
          { icon: '🎯', label: t.limits, scr: 'limits' },
          { icon: '📊', label: t.categories, scr: 'categories' },
          { icon: '📜', label: t.transactions, scr: 'transactions' },
          { icon: '🎯', label: t.goals, scr: 'goals' },
        ].map((item, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.95 }}
            onClick={() => setScreen(item.scr)}
            className="p-4 rounded-2xl flex flex-col items-center gap-2"
            style={{ background: THEME.bg.card }}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-sm" style={{ color: THEME.text.primary }}>{item.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="px-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold" style={{ color: THEME.text.primary }}>{t.recentTransactions}</h3>
          <button onClick={() => setScreen('transactions')} style={{ color: THEME.accent.primary }} className="text-sm">{t.seeAll}</button>
        </div>
        {transactions.length === 0 ? (
          <div className="p-8 rounded-2xl text-center" style={{ background: THEME.bg.card }}>
            <span className="text-4xl block mb-2">📝</span>
            <p style={{ color: THEME.text.muted }}>{t.noTransactions}</p>
            <p className="text-sm" style={{ color: THEME.text.muted }}>{t.sendToBot}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.slice(0, 5).map(tx => {
              const cat = getCategory(tx.category_id, tx.amount > 0 ? 'income' : 'expense');
              return (
                <div key={tx.id} className="p-4 rounded-2xl flex items-center gap-3" style={{ background: THEME.bg.card }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${cat.color}30` }}>
                    {cat.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate" style={{ color: THEME.text.primary }}>{tx.description}</p>
                    <p className="text-xs" style={{ color: THEME.text.muted }}>{cat.name}</p>
                  </div>
                  <p className="font-bold" style={{ color: tx.amount > 0 ? THEME.accent.success : THEME.accent.danger }}>
                    {tx.amount > 0 ? '+' : ''}{formatMoney(tx.amount)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Refresh */}
      <div className="px-5 mt-4">
        <button onClick={refresh} className="w-full py-3 rounded-xl text-sm" style={{ background: THEME.bg.card, color: THEME.text.secondary }}>
          🔄 {t.refresh}
        </button>
      </div>
    </div>
  );

  const CategoriesScreen = () => (
    <div className="pb-40">
      <div className="p-5 flex items-center gap-4">
        <button onClick={() => setScreen('home')} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: THEME.bg.card }}>←</button>
        <h1 className="text-2xl font-bold" style={{ color: THEME.text.primary }}>{t.categories}</h1>
      </div>

      <div className="px-5 flex gap-2 mb-4">
        {['expense', 'income', 'debt'].map(tab => (
          <button
            key={tab}
            onClick={() => setCategoryTab(tab)}
            className="flex-1 py-3 rounded-xl text-sm font-medium"
            style={{ background: categoryTab === tab ? THEME.accent.primary : THEME.bg.card, color: categoryTab === tab ? '#000' : THEME.text.secondary }}
          >
            {tab === 'expense' ? t.expense : tab === 'income' ? t.income : t.debt} ({DEFAULT_CATEGORIES[tab]?.length})
          </button>
        ))}
      </div>

      <div className="px-5 space-y-2">
        {DEFAULT_CATEGORIES[categoryTab]?.map(cat => {
          const name = CATEGORY_NAMES[cat.id]?.[lang] || cat.id;
          return (
            <motion.div
              key={cat.id}
              whileTap={{ scale: 0.98 }}
              className="p-4 rounded-2xl flex items-center gap-3"
              style={{ background: THEME.bg.card }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ background: `${cat.color}30` }}>
                {cat.emoji}
              </div>
              <div className="flex-1">
                <p className="font-medium" style={{ color: THEME.text.primary }}>{name}</p>
                <p className="text-xs" style={{ color: THEME.text.muted }}>ID: {cat.id}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  const LimitsScreen = () => (
    <div className="pb-40">
      <div className="p-5 flex items-center gap-4">
        <button onClick={() => setScreen('home')} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: THEME.bg.card }}>←</button>
        <h1 className="text-2xl font-bold" style={{ color: THEME.text.primary }}>{t.limits}</h1>
      </div>

      <div className="px-5 mb-4">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => { setFormData({ categoryId: 'food', amount: '' }); setModal('addLimit'); }}
          className="w-full py-4 rounded-2xl font-semibold"
          style={{ background: THEME.gradient, color: '#000' }}
        >
          + {t.addLimit}
        </motion.button>
      </div>

      <div className="px-5 space-y-3">
        {limits.length === 0 ? (
          <div className="p-8 rounded-2xl text-center" style={{ background: THEME.bg.card }}>
            <span className="text-4xl block mb-2">🎯</span>
            <p style={{ color: THEME.text.muted }}>{t.noLimits}</p>
          </div>
        ) : (
          limits.map(lim => {
            const cat = getCategory(lim.category_id);
            const spent = getSpent(lim.category_id);
            const pct = Math.min(100, Math.round((spent / lim.limit_amount) * 100));
            const isOver = pct >= 100;
            const isNear = pct >= 80;
            return (
              <div key={lim.id} className="p-5 rounded-2xl" style={{ background: THEME.bg.card }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cat.emoji}</span>
                    <div>
                      <p className="font-semibold" style={{ color: THEME.text.primary }}>{cat.name}</p>
                      <p className="text-sm" style={{ color: THEME.text.muted }}>
                        {formatMoney(spent)} / {formatMoney(lim.limit_amount)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold" style={{ color: isOver ? THEME.accent.danger : isNear ? THEME.accent.warning : THEME.accent.success }}>
                      {pct}%
                    </span>
                    <button onClick={() => handleDeleteLimit(lim.id)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.2)' }}>
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: isOver ? THEME.accent.danger : isNear ? THEME.accent.warning : cat.color }} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  const TransactionsScreen = () => (
    <div className="pb-40">
      <div className="p-5 flex items-center gap-4">
        <button onClick={() => setScreen('home')} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: THEME.bg.card }}>←</button>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: THEME.text.primary }}>{t.transactions}</h1>
          <p className="text-sm" style={{ color: THEME.text.muted }}>{transactions.length} ta</p>
        </div>
      </div>

      <div className="px-5 space-y-2">
        {transactions.length === 0 ? (
          <div className="p-8 rounded-2xl text-center" style={{ background: THEME.bg.card }}>
            <span className="text-4xl block mb-2">📝</span>
            <p style={{ color: THEME.text.muted }}>{t.noTransactions}</p>
            <button onClick={openBot} className="mt-4 px-6 py-2 rounded-xl font-medium" style={{ background: THEME.accent.primary, color: '#000' }}>
              {t.goToBot}
            </button>
          </div>
        ) : (
          transactions.map(tx => {
            const cat = getCategory(tx.category_id, tx.amount > 0 ? 'income' : 'expense');
            return (
              <div key={tx.id} className="p-4 rounded-2xl flex items-center gap-3" style={{ background: THEME.bg.card }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ background: `${cat.color}30` }}>
                  {cat.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate" style={{ color: THEME.text.primary }}>{tx.description}</p>
                  <div className="flex items-center gap-2 text-xs" style={{ color: THEME.text.muted }}>
                    <span>{new Date(tx.created_at).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{tx.source === 'voice' ? '🎤' : tx.source === 'receipt' ? '📷' : '💬'}</span>
                  </div>
                </div>
                <p className="font-bold" style={{ color: tx.amount > 0 ? THEME.accent.success : THEME.accent.danger }}>
                  {tx.amount > 0 ? '+' : ''}{formatMoney(tx.amount)}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  const GoalsScreen = () => (
    <div className="pb-40">
      <div className="p-5 flex items-center gap-4">
        <button onClick={() => setScreen('home')} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: THEME.bg.card }}>←</button>
        <h1 className="text-2xl font-bold" style={{ color: THEME.text.primary }}>{t.goals}</h1>
      </div>

      <div className="px-5 mb-4">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => { setFormData({ name: '', amount: '', emoji: '🎯' }); setModal('addGoal'); }}
          className="w-full py-4 rounded-2xl font-semibold"
          style={{ background: THEME.gradient, color: '#000' }}
        >
          + {t.addGoal}
        </motion.button>
      </div>

      <div className="px-5 space-y-3">
        {goals.length === 0 ? (
          <div className="p-8 rounded-2xl text-center" style={{ background: THEME.bg.card }}>
            <span className="text-4xl block mb-2">🎯</span>
            <p style={{ color: THEME.text.muted }}>{t.noGoals}</p>
          </div>
        ) : (
          goals.map(goal => {
            const pct = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100));
            return (
              <div key={goal.id} className="p-5 rounded-2xl" style={{ background: THEME.bg.card }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{goal.emoji}</span>
                    <div>
                      <p className="font-semibold" style={{ color: THEME.text.primary }}>{goal.name}</p>
                      <p className="text-sm" style={{ color: THEME.text.muted }}>
                        {formatMoney(goal.current_amount)} / {formatMoney(goal.target_amount)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold" style={{ color: THEME.accent.success }}>{pct}%</span>
                    <button onClick={() => handleDeleteGoal(goal.id)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.2)' }}>
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #22c55e, #4ade80)' }} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  const SettingsScreen = () => (
    <div className="pb-40">
      <div className="p-5 flex items-center gap-4">
        <button onClick={() => setScreen('home')} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: THEME.bg.card }}>←</button>
        <h1 className="text-2xl font-bold" style={{ color: THEME.text.primary }}>{t.settings}</h1>
      </div>

      <div className="px-5">
        <div className="p-5 rounded-2xl mb-4" style={{ background: THEME.bg.card }}>
          <p className="font-semibold mb-3" style={{ color: THEME.text.primary }}>🌐 {t.language}</p>
          <div className="flex gap-2">
            {[
              { code: 'uz', flag: '🇺🇿', name: "O'zbekcha" },
              { code: 'ru', flag: '🇷🇺', name: 'Русский' },
              { code: 'en', flag: '🇬🇧', name: 'English' },
            ].map(l => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className="flex-1 py-3 rounded-xl text-center"
                style={{ background: lang === l.code ? THEME.accent.primary : THEME.bg.secondary, color: lang === l.code ? '#000' : THEME.text.secondary }}
              >
                <span className="text-xl block">{l.flag}</span>
                <span className="text-xs">{l.name}</span>
              </button>
            ))}
          </div>
        </div>

        <button onClick={openBot} className="w-full p-5 rounded-2xl flex items-center gap-4" style={{ background: THEME.bg.card }}>
          <span className="text-2xl">🤖</span>
          <div className="text-left">
            <p className="font-semibold" style={{ color: THEME.text.primary }}>{t.goToBot}</p>
            <p className="text-sm" style={{ color: THEME.text.muted }}>@{BOT_USERNAME}</p>
          </div>
        </button>
      </div>
    </div>
  );

  // ============================================
  // MODALS
  // ============================================
  const AddLimitModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }} onClick={() => setModal(null)}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm p-6 rounded-3xl"
        style={{ background: THEME.bg.secondary }}
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: THEME.text.primary }}>{t.addLimit}</h2>

        <div className="mb-4">
          <label className="text-sm mb-2 block" style={{ color: THEME.text.muted }}>{t.category}</label>
          <select
            value={formData.categoryId || 'food'}
            onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
            className="w-full p-4 rounded-xl appearance-none"
            style={{ background: THEME.bg.card, color: THEME.text.primary, border: 'none' }}
          >
            {DEFAULT_CATEGORIES.expense.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.emoji} {CATEGORY_NAMES[cat.id]?.[lang] || cat.id}</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="text-sm mb-2 block" style={{ color: THEME.text.muted }}>{t.amount} (UZS)</label>
          <input
            type="number"
            value={formData.amount || ''}
            onChange={e => setFormData({ ...formData, amount: e.target.value })}
            placeholder="500000"
            className="w-full p-4 rounded-xl"
            style={{ background: THEME.bg.card, color: THEME.text.primary, border: 'none' }}
          />
        </div>

        <div className="flex gap-3">
          <button onClick={() => setModal(null)} className="flex-1 py-4 rounded-xl font-medium" style={{ background: THEME.bg.card, color: THEME.text.secondary }}>
            {t.cancel}
          </button>
          <button onClick={handleAddLimit} className="flex-1 py-4 rounded-xl font-semibold" style={{ background: THEME.accent.primary, color: '#000' }}>
            {t.save}
          </button>
        </div>
      </motion.div>
    </div>
  );

  const AddGoalModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)' }} onClick={() => setModal(null)}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm p-6 rounded-3xl"
        style={{ background: THEME.bg.secondary }}
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4" style={{ color: THEME.text.primary }}>{t.addGoal}</h2>

        <div className="mb-4">
          <label className="text-sm mb-2 block" style={{ color: THEME.text.muted }}>{t.goalName}</label>
          <input
            type="text"
            value={formData.name || ''}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            placeholder="iPhone 16 Pro"
            className="w-full p-4 rounded-xl"
            style={{ background: THEME.bg.card, color: THEME.text.primary, border: 'none' }}
          />
        </div>

        <div className="mb-4">
          <label className="text-sm mb-2 block" style={{ color: THEME.text.muted }}>{t.targetAmount} (UZS)</label>
          <input
            type="number"
            value={formData.amount || ''}
            onChange={e => setFormData({ ...formData, amount: e.target.value })}
            placeholder="15000000"
            className="w-full p-4 rounded-xl"
            style={{ background: THEME.bg.card, color: THEME.text.primary, border: 'none' }}
          />
        </div>

        <div className="mb-6">
          <label className="text-sm mb-2 block" style={{ color: THEME.text.muted }}>{t.emoji}</label>
          <div className="flex gap-2 flex-wrap">
            {['🎯', '💻', '📱', '🚗', '🏠', '✈️', '💍', '🎓', '👟', '🎮'].map(e => (
              <button
                key={e}
                onClick={() => setFormData({ ...formData, emoji: e })}
                className="w-11 h-11 rounded-xl text-xl"
                style={{ background: formData.emoji === e ? THEME.accent.primary : THEME.bg.card }}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => setModal(null)} className="flex-1 py-4 rounded-xl font-medium" style={{ background: THEME.bg.card, color: THEME.text.secondary }}>
            {t.cancel}
          </button>
          <button onClick={handleAddGoal} className="flex-1 py-4 rounded-xl font-semibold" style={{ background: THEME.accent.primary, color: '#000' }}>
            {t.save}
          </button>
        </div>
      </motion.div>
    </div>
  );

  const AddTransactionModal = () => (
    <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.8)' }} onClick={() => setModal(null)}>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        className="w-full p-6 rounded-t-3xl"
        style={{ background: THEME.bg.secondary }}
        onClick={e => e.stopPropagation()}
      >
        <div className="w-12 h-1 rounded-full mx-auto mb-6" style={{ background: 'rgba(255,255,255,0.2)' }} />
        <h2 className="text-xl font-bold mb-2" style={{ color: THEME.text.primary }}>{t.addTransaction}</h2>
        <p className="text-sm mb-6" style={{ color: THEME.text.muted }}>{t.sendToBot}</p>

        <div className="space-y-3 mb-6">
          {[
            { icon: '🎤', title: t.voiceMessage, desc: '"Kofe 15 ming"' },
            { icon: '💬', title: t.textMessage, desc: '"Taksi 30000"' },
            { icon: '📷', title: t.receiptPhoto, desc: 'Chek rasmi' },
          ].map((m, i) => (
            <div key={i} className="p-4 rounded-xl flex items-center gap-4" style={{ background: THEME.bg.card }}>
              <span className="text-2xl">{m.icon}</span>
              <div>
                <p className="font-medium" style={{ color: THEME.text.primary }}>{m.title}</p>
                <p className="text-sm" style={{ color: THEME.text.muted }}>{m.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button onClick={openBot} className="w-full py-4 rounded-2xl font-semibold" style={{ background: THEME.gradient, color: '#000' }}>
          {t.goToBot}
        </button>
      </motion.div>
    </div>
  );

  // ============================================
  // BOTTOM NAV
  // ============================================
  const BottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 z-40" style={{ background: THEME.bg.primary }}>
      <div className="px-4 -mt-5">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setModal('addTransaction')}
          className="w-full py-4 rounded-2xl font-bold shadow-lg"
          style={{ background: THEME.gradient, color: '#000', boxShadow: '0 8px 30px rgba(249,115,22,0.4)' }}
        >
          {t.addTransaction}
        </motion.button>
      </div>
      <div className="flex justify-around py-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
        {[
          { icon: '🏠', label: t.home, scr: 'home' },
          { icon: '📊', label: t.statistics, scr: 'transactions' },
          { icon: '📁', label: t.categories, scr: 'categories' },
          { icon: '⚙️', label: t.settings, scr: 'settings' },
        ].map((nav, i) => (
          <button key={i} onClick={() => setScreen(nav.scr)} className="flex flex-col items-center gap-1 p-2">
            <span className="text-xl">{nav.icon}</span>
            <span className="text-xs" style={{ color: screen === nav.scr ? THEME.accent.primary : THEME.text.muted }}>{nav.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="min-h-screen" style={{ background: THEME.bg.primary, color: THEME.text.primary }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Inter', sans-serif; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { display: none; }
        input, select { outline: none; }
      `}</style>

      {screen === 'home' && <HomeScreen />}
      {screen === 'categories' && <CategoriesScreen />}
      {screen === 'limits' && <LimitsScreen />}
      {screen === 'transactions' && <TransactionsScreen />}
      {screen === 'goals' && <GoalsScreen />}
      {screen === 'settings' && <SettingsScreen />}

      <BottomNav />

      <AnimatePresence>
        {modal === 'addLimit' && <AddLimitModal />}
        {modal === 'addGoal' && <AddGoalModal />}
        {modal === 'addTransaction' && <AddTransactionModal />}
      </AnimatePresence>
    </div>
  );
}
