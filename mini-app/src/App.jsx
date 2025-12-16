import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// HAMYON - WORKING Mini App with Real Data
// ============================================

// IMPORTANT: Update these with your Supabase credentials
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_KEY';
const BOT_USERNAME = 'hamyonmoneybot'; // YOUR BOT USERNAME (without @)

// Simple Supabase client
const supabase = {
  async fetch(endpoint, options = {}) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${endpoint}`, {
      ...options,
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': options.method === 'POST' ? 'return=representation' : undefined,
        ...options.headers,
      },
    });
    return res.json();
  },
  
  async getUser(telegramId) {
    const data = await this.fetch(`users?telegram_id=eq.${telegramId}&select=*`);
    return data?.[0] || null;
  },
  
  async createUser(telegramId, name) {
    const data = await this.fetch('users', {
      method: 'POST',
      body: JSON.stringify({
        telegram_id: telegramId,
        name: name,
        balance: 0,
        created_at: new Date().toISOString(),
      }),
    });
    return data?.[0] || null;
  },
  
  async getTransactions(telegramId, limit = 50) {
    const data = await this.fetch(
      `transactions?user_telegram_id=eq.${telegramId}&select=*&order=created_at.desc&limit=${limit}`
    );
    return data || [];
  },
  
  async getLimits(telegramId) {
    const data = await this.fetch(`limits?user_telegram_id=eq.${telegramId}&select=*`);
    return data || [];
  },
  
  async addLimit(telegramId, categoryId, limitAmount) {
    const data = await this.fetch('limits', {
      method: 'POST',
      body: JSON.stringify({
        user_telegram_id: telegramId,
        category_id: categoryId,
        limit_amount: limitAmount,
        is_active: true,
        created_at: new Date().toISOString(),
      }),
    });
    return data?.[0] || null;
  },
  
  async getGoals(telegramId) {
    const data = await this.fetch(`goals?user_telegram_id=eq.${telegramId}&select=*`);
    return data || [];
  },
  
  async addGoal(telegramId, name, targetAmount, emoji) {
    const data = await this.fetch('goals', {
      method: 'POST',
      body: JSON.stringify({
        user_telegram_id: telegramId,
        name: name,
        target_amount: targetAmount,
        current_amount: 0,
        emoji: emoji || '🎯',
        is_completed: false,
        created_at: new Date().toISOString(),
      }),
    });
    return data?.[0] || null;
  },
  
  async getDebts(telegramId) {
    const data = await this.fetch(`debts?user_telegram_id=eq.${telegramId}&is_settled=eq.false&select=*`);
    return data || [];
  },
};

// ============================================
// FORMAT HELPERS
// ============================================
const formatUZS = (amount) => {
  if (amount === null || amount === undefined) return '0 UZS';
  const absAmount = Math.abs(amount);
  if (absAmount >= 1000000) {
    return (amount / 1000000).toFixed(1).replace('.0', '') + 'M UZS';
  }
  return new Intl.NumberFormat('uz-UZ').format(amount) + ' UZS';
};

// ============================================
// 45+ CATEGORIES
// ============================================
const ALL_CATEGORIES = {
  expense: [
    { id: 'food', name: 'Oziq-ovqat', emoji: '🍕', color: '#FF6B6B' },
    { id: 'restaurants', name: 'Restoranlar', emoji: '🍽️', color: '#FF8787' },
    { id: 'coffee', name: 'Kofe', emoji: '☕', color: '#D4A574' },
    { id: 'fastfood', name: 'Fast Food', emoji: '🍔', color: '#FFA94D' },
    { id: 'delivery', name: 'Yetkazib berish', emoji: '🛵', color: '#FF922B' },
    { id: 'taxi', name: 'Taksi', emoji: '🚕', color: '#FFD43B' },
    { id: 'fuel', name: 'Benzin', emoji: '⛽', color: '#FAB005' },
    { id: 'publicTransport', name: 'Jamoat transporti', emoji: '🚌', color: '#F59F00' },
    { id: 'parking', name: 'Parkovka', emoji: '🅿️', color: '#F08C00' },
    { id: 'carMaintenance', name: 'Avto xizmat', emoji: '🔧', color: '#E67700' },
    { id: 'clothing', name: 'Kiyim-kechak', emoji: '👕', color: '#845EF7' },
    { id: 'electronics', name: 'Elektronika', emoji: '📱', color: '#7950F2' },
    { id: 'accessories', name: 'Aksessuarlar', emoji: '👜', color: '#7048E8' },
    { id: 'gifts', name: 'Sovg\'alar', emoji: '🎁', color: '#6741D9' },
    { id: 'beauty', name: 'Go\'zallik', emoji: '💄', color: '#AE3EC9' },
    { id: 'rent', name: 'Ijara', emoji: '🏠', color: '#20C997' },
    { id: 'utilities', name: 'Kommunal', emoji: '💡', color: '#12B886' },
    { id: 'internet', name: 'Internet', emoji: '📶', color: '#0CA678' },
    { id: 'furniture', name: 'Mebel', emoji: '🛋️', color: '#099268' },
    { id: 'repairs', name: 'Ta\'mirlash', emoji: '🔨', color: '#087F5B' },
    { id: 'movies', name: 'Kino', emoji: '🎬', color: '#339AF0' },
    { id: 'games', name: 'O\'yinlar', emoji: '🎮', color: '#228BE6' },
    { id: 'subscriptions', name: 'Obunalar', emoji: '📺', color: '#1C7ED6' },
    { id: 'concerts', name: 'Konsertlar', emoji: '🎵', color: '#1971C2' },
    { id: 'hobbies', name: 'Sevimli mashg\'ulot', emoji: '🎨', color: '#1864AB' },
    { id: 'pharmacy', name: 'Dorixona', emoji: '💊', color: '#F06595' },
    { id: 'doctor', name: 'Shifokor', emoji: '🏥', color: '#E64980' },
    { id: 'gym', name: 'Sport zal', emoji: '💪', color: '#D6336C' },
    { id: 'sports', name: 'Sport', emoji: '⚽', color: '#C2255C' },
    { id: 'wellness', name: 'Sog\'lom turmush', emoji: '🧘', color: '#A61E4D' },
    { id: 'courses', name: 'Kurslar', emoji: '📚', color: '#4DABF7' },
    { id: 'books', name: 'Kitoblar', emoji: '📖', color: '#3BC9DB' },
    { id: 'tuition', name: 'O\'qish to\'lovi', emoji: '🎓', color: '#22B8CF' },
    { id: 'supplies', name: 'O\'quv anjomlari', emoji: '✏️', color: '#15AABF' },
    { id: 'flights', name: 'Parvozlar', emoji: '✈️', color: '#748FFC' },
    { id: 'hotels', name: 'Mehmonxona', emoji: '🏨', color: '#5C7CFA' },
    { id: 'vacation', name: 'Dam olish', emoji: '🏖️', color: '#4C6EF5' },
    { id: 'businessTravel', name: 'Xizmat safari', emoji: '💼', color: '#4263EB' },
    { id: 'pets', name: 'Uy hayvonlari', emoji: '🐕', color: '#FF8A65' },
    { id: 'charity', name: 'Xayriya', emoji: '❤️', color: '#EF5350' },
    { id: 'insurance', name: 'Sug\'urta', emoji: '🛡️', color: '#78909C' },
    { id: 'taxes', name: 'Soliqlar', emoji: '📋', color: '#607D8B' },
    { id: 'childcare', name: 'Bolalar uchun', emoji: '👶', color: '#FFAB91' },
    { id: 'other', name: 'Boshqa', emoji: '📦', color: '#90A4AE' },
  ],
  income: [
    { id: 'salary', name: 'Oylik maosh', emoji: '💰', color: '#51CF66' },
    { id: 'freelance', name: 'Frilanser', emoji: '💻', color: '#40C057' },
    { id: 'business', name: 'Biznes daromad', emoji: '🏢', color: '#37B24D' },
    { id: 'investments', name: 'Investitsiyalar', emoji: '📈', color: '#2F9E44' },
    { id: 'rental', name: 'Ijara daromadi', emoji: '🏘️', color: '#2B8A3E' },
    { id: 'gifts_income', name: 'Sovg\'a olindi', emoji: '🎀', color: '#FFD43B' },
    { id: 'refunds', name: 'Qaytarilgan pul', emoji: '↩️', color: '#FCC419' },
    { id: 'bonus', name: 'Bonus', emoji: '🎉', color: '#F59F00' },
    { id: 'cashback', name: 'Keshbek', emoji: '💳', color: '#94D82D' },
    { id: 'other_income', name: 'Boshqa daromad', emoji: '💵', color: '#82C91E' },
  ],
  debt: [
    { id: 'borrowed', name: 'Qarz oldim', emoji: '🤝', color: '#FF6B6B' },
    { id: 'lent', name: 'Qarz berdim', emoji: '💸', color: '#51CF66' },
    { id: 'credit', name: 'Kredit karta', emoji: '💳', color: '#845EF7' },
    { id: 'loan_payment', name: 'Qarz to\'lovi', emoji: '🏦', color: '#339AF0' },
  ]
};

const getCategoryById = (id) => {
  const allCats = [...ALL_CATEGORIES.expense, ...ALL_CATEGORIES.income, ...ALL_CATEGORIES.debt];
  return allCats.find(c => c.id === id) || { name: 'Boshqa', emoji: '📦', color: '#888' };
};

// ============================================
// THEME
// ============================================
const THEME = {
  bg: { primary: '#0F0F14', secondary: '#16161D', card: '#1C1C26' },
  accent: { primary: '#F97316', success: '#22C55E', warning: '#FBBF24', danger: '#EF4444' },
  text: { primary: '#FAFAFA', secondary: '#A1A1AA', muted: '#71717A' },
  gradient: { primary: 'linear-gradient(135deg, #F97316 0%, #FB923C 50%, #FBBF24 100%)' }
};

// ============================================
// MAIN APP
// ============================================
export default function HamyonApp() {
  // State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [telegramUser, setTelegramUser] = useState(null);
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [limits, setLimits] = useState([]);
  const [goals, setGoals] = useState([]);
  const [debts, setDebts] = useState([]);
  
  // Screens
  const [activeScreen, setActiveScreen] = useState('home');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddLimitModal, setShowAddLimitModal] = useState(false);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  
  // Form state
  const [newLimit, setNewLimit] = useState({ categoryId: 'food', amount: '' });
  const [newGoal, setNewGoal] = useState({ name: '', amount: '', emoji: '🎯' });

  // ============================================
  // LOAD DATA FROM SUPABASE
  // ============================================
  useEffect(() => {
    const initApp = async () => {
      try {
        // Get Telegram user
        let tgUser = null;
        if (window.Telegram?.WebApp) {
          const tg = window.Telegram.WebApp;
          tg.ready();
          tg.expand();
          tg.setHeaderColor('#0F0F14');
          tg.setBackgroundColor('#0F0F14');
          tgUser = tg.initDataUnsafe?.user;
        }
        
        // For testing without Telegram
        if (!tgUser) {
          tgUser = { id: 123456789, first_name: 'Test', last_name: 'User' };
        }
        
        setTelegramUser(tgUser);
        
        // Get or create user in Supabase
        let dbUser = await supabase.getUser(tgUser.id);
        if (!dbUser) {
          dbUser = await supabase.createUser(tgUser.id, `${tgUser.first_name} ${tgUser.last_name || ''}`);
        }
        setUser(dbUser);
        
        // Load all data
        const [txs, lims, gls, dbts] = await Promise.all([
          supabase.getTransactions(tgUser.id),
          supabase.getLimits(tgUser.id),
          supabase.getGoals(tgUser.id),
          supabase.getDebts(tgUser.id),
        ]);
        
        setTransactions(txs);
        setLimits(lims);
        setGoals(gls);
        setDebts(dbts);
        setLoading(false);
        
      } catch (err) {
        console.error('Init error:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    initApp();
  }, []);

  // ============================================
  // CALCULATED VALUES
  // ============================================
  const balance = user?.balance || 0;
  
  const todayTransactions = transactions.filter(tx => {
    const today = new Date().toISOString().split('T')[0];
    return tx.created_at?.startsWith(today);
  });
  
  const todayExpenses = todayTransactions
    .filter(tx => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    
  const todayIncome = todayTransactions
    .filter(tx => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Calculate spent per category for limits
  const getSpentForCategory = (categoryId) => {
    const thisMonth = new Date().toISOString().slice(0, 7); // "2025-01"
    return transactions
      .filter(tx => tx.category_id === categoryId && tx.amount < 0 && tx.created_at?.startsWith(thisMonth))
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  };

  // ============================================
  // HANDLERS
  // ============================================
  const openBot = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink(`https://t.me/${BOT_USERNAME}`);
    } else {
      window.open(`https://t.me/${BOT_USERNAME}`, '_blank');
    }
  };

  const refreshData = async () => {
    if (!telegramUser) return;
    setLoading(true);
    try {
      const [dbUser, txs, lims, gls, dbts] = await Promise.all([
        supabase.getUser(telegramUser.id),
        supabase.getTransactions(telegramUser.id),
        supabase.getLimits(telegramUser.id),
        supabase.getGoals(telegramUser.id),
        supabase.getDebts(telegramUser.id),
      ]);
      setUser(dbUser);
      setTransactions(txs);
      setLimits(lims);
      setGoals(gls);
      setDebts(dbts);
    } catch (err) {
      console.error('Refresh error:', err);
    }
    setLoading(false);
  };

  const handleAddLimit = async () => {
    if (!newLimit.amount || !telegramUser) return;
    try {
      await supabase.addLimit(telegramUser.id, newLimit.categoryId, parseInt(newLimit.amount));
      await refreshData();
      setShowAddLimitModal(false);
      setNewLimit({ categoryId: 'food', amount: '' });
    } catch (err) {
      console.error('Add limit error:', err);
    }
  };

  const handleAddGoal = async () => {
    if (!newGoal.name || !newGoal.amount || !telegramUser) return;
    try {
      await supabase.addGoal(telegramUser.id, newGoal.name, parseInt(newGoal.amount), newGoal.emoji);
      await refreshData();
      setShowAddGoalModal(false);
      setNewGoal({ name: '', amount: '', emoji: '🎯' });
    } catch (err) {
      console.error('Add goal error:', err);
    }
  };

  // ============================================
  // LOADING / ERROR SCREENS
  // ============================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: THEME.bg.primary }}>
        <div className="text-center">
          <div className="text-4xl mb-4 animate-bounce">💰</div>
          <p style={{ color: THEME.text.secondary }}>Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: THEME.bg.primary }}>
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p style={{ color: THEME.accent.danger }} className="mb-2">Xatolik yuz berdi</p>
          <p style={{ color: THEME.text.muted }} className="text-sm mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg"
            style={{ background: THEME.accent.primary }}
          >
            Qayta urinish
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // HOME SCREEN
  // ============================================
  const HomeScreen = () => (
    <div className="pb-32">
      {/* Header */}
      <header className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold"
              style={{ background: THEME.gradient.primary }}
            >
              {(telegramUser?.first_name || 'U').charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: THEME.text.primary }}>
                Salom, {telegramUser?.first_name || 'Foydalanuvchi'}!
              </h1>
              <p className="text-sm" style={{ color: THEME.text.muted }}>Moliyaviy yordamchingiz</p>
            </div>
          </div>
          <div 
            className="text-2xl font-black"
            style={{ background: THEME.gradient.primary, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            Hamyon
          </div>
        </div>
      </header>

      {/* Balance Card */}
      <div className="px-5 mb-4">
        <div className="p-5 rounded-2xl" style={{ background: THEME.bg.card, border: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-sm mb-1" style={{ color: THEME.text.muted }}>Joriy balans</p>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: THEME.accent.success }} />
            <h2 className="text-3xl font-bold" style={{ color: THEME.text.primary }}>
              {formatUZS(balance)}
            </h2>
          </div>
          
          {/* Today Summary */}
          <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <p className="text-sm mb-3 text-center" style={{ color: THEME.text.muted }}>Bugungi xulosa</p>
            <div className="flex justify-around">
              <div className="text-center">
                <p className="text-xl font-bold" style={{ color: THEME.accent.danger }}>
                  {todayExpenses > 0 ? formatUZS(todayExpenses) : '0'}
                </p>
                <p className="text-xs" style={{ color: THEME.text.muted }}>↘ Xarajatlar</p>
              </div>
              <div className="w-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
              <div className="text-center">
                <p className="text-xl font-bold" style={{ color: THEME.accent.success }}>
                  {todayIncome > 0 ? formatUZS(todayIncome) : '0'}
                </p>
                <p className="text-xs" style={{ color: THEME.text.muted }}>↗ Daromad</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-5 mb-4">
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: '🎯', label: 'Limitlar', screen: 'limits' },
            { icon: '📊', label: 'Kategoriyalar', screen: 'categories' },
            { icon: '📜', label: 'Tranzaksiyalar', screen: 'transactions' },
            { icon: '💳', label: 'Qarzlar', screen: 'debts' },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => setActiveScreen(item.screen)}
              className="p-4 rounded-2xl flex flex-col items-center gap-2 active:scale-95 transition-transform"
              style={{ background: THEME.bg.card, border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-sm font-medium" style={{ color: THEME.text.primary }}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Goals */}
      {goals.length > 0 && (
        <div className="px-5 mb-4">
          <div 
            className="p-5 rounded-2xl"
            style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(16, 185, 129, 0.08) 100%)', border: '1px solid rgba(34, 197, 94, 0.2)' }}
            onClick={() => setActiveScreen('goals')}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{goals[0].emoji || '🎯'}</span>
                <div>
                  <p className="font-semibold" style={{ color: THEME.text.primary }}>{goals[0].name}</p>
                  <p className="text-xs" style={{ color: THEME.text.muted }}>Jamg'arma maqsadi</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold" style={{ color: THEME.accent.success }}>
                  {Math.round((goals[0].current_amount / goals[0].target_amount) * 100)}%
                </p>
              </div>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div 
                className="h-full rounded-full transition-all"
                style={{ 
                  background: 'linear-gradient(90deg, #22C55E, #4ADE80)', 
                  width: `${Math.min(100, (goals[0].current_amount / goals[0].target_amount) * 100)}%` 
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="px-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold" style={{ color: THEME.text.primary }}>So'nggi operatsiyalar</h3>
          <button onClick={() => setActiveScreen('transactions')} style={{ color: THEME.accent.primary }} className="text-sm">
            Hammasi
          </button>
        </div>
        
        {transactions.length === 0 ? (
          <div className="p-8 rounded-2xl text-center" style={{ background: THEME.bg.card }}>
            <span className="text-4xl mb-2 block">📝</span>
            <p style={{ color: THEME.text.muted }}>Hali tranzaksiyalar yo'q</p>
            <p className="text-sm mt-1" style={{ color: THEME.text.muted }}>Botga xabar yuboring!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.slice(0, 5).map((tx) => {
              const category = getCategoryById(tx.category_id);
              return (
                <div key={tx.id} className="p-4 rounded-2xl" style={{ background: THEME.bg.card }}>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                      style={{ background: `${category.color}20` }}
                    >
                      {category.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate" style={{ color: THEME.text.primary }}>{tx.description}</p>
                      <p className="text-xs" style={{ color: THEME.text.muted }}>
                        {new Date(tx.created_at).toLocaleDateString('uz-UZ')}
                      </p>
                    </div>
                    <p className="font-bold" style={{ color: tx.amount > 0 ? THEME.accent.success : THEME.accent.danger }}>
                      {tx.amount > 0 ? '+' : ''}{formatUZS(tx.amount)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Refresh Button */}
      <div className="px-5 mb-4">
        <button
          onClick={refreshData}
          className="w-full py-3 rounded-xl text-sm font-medium"
          style={{ background: THEME.bg.card, color: THEME.text.secondary, border: '1px solid rgba(255,255,255,0.1)' }}
        >
          🔄 Yangilash
        </button>
      </div>
    </div>
  );

  // ============================================
  // CATEGORIES SCREEN
  // ============================================
  const CategoriesScreen = () => {
    const [activeType, setActiveType] = useState('expense');
    const categories = ALL_CATEGORIES[activeType] || [];
    
    return (
      <div className="pb-32">
        <header className="px-5 pt-6 pb-4 flex items-center gap-4">
          <button onClick={() => setActiveScreen('home')} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: THEME.bg.card }}>
            ←
          </button>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: THEME.text.primary }}>Kategoriyalar</h1>
            <p className="text-sm" style={{ color: THEME.text.muted }}>{categories.length} ta kategoriya</p>
          </div>
        </header>

        <div className="px-5 flex gap-2 mb-4">
          {[
            { key: 'expense', label: 'Xarajat', count: ALL_CATEGORIES.expense.length },
            { key: 'income', label: 'Daromad', count: ALL_CATEGORIES.income.length },
            { key: 'debt', label: 'Qarz', count: ALL_CATEGORIES.debt.length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveType(tab.key)}
              className="flex-1 py-3 rounded-xl text-sm font-medium transition-all"
              style={{ 
                background: activeType === tab.key ? THEME.accent.primary : THEME.bg.card,
                color: activeType === tab.key ? '#000' : THEME.text.secondary,
              }}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <div className="px-5 space-y-2">
          {categories.map((cat) => (
            <div key={cat.id} className="p-4 rounded-2xl" style={{ background: THEME.bg.card }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ background: `${cat.color}30` }}>
                  {cat.emoji}
                </div>
                <div className="flex-1">
                  <p className="font-medium" style={{ color: THEME.text.primary }}>{cat.name}</p>
                  <p className="text-xs" style={{ color: THEME.text.muted }}>ID: {cat.id}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ============================================
  // LIMITS SCREEN
  // ============================================
  const LimitsScreen = () => (
    <div className="pb-32">
      <header className="px-5 pt-6 pb-4 flex items-center gap-4">
        <button onClick={() => setActiveScreen('home')} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: THEME.bg.card }}>
          ←
        </button>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: THEME.text.primary }}>Limitlar</h1>
          <p className="text-sm" style={{ color: THEME.text.muted }}>{limits.length} ta limit</p>
        </div>
      </header>

      <div className="px-5 mb-4">
        <button
          onClick={() => setShowAddLimitModal(true)}
          className="w-full py-4 rounded-2xl font-semibold"
          style={{ background: THEME.gradient.primary, color: '#000' }}
        >
          + Yangi limit qo'shish
        </button>
      </div>

      <div className="px-5 space-y-3">
        {limits.length === 0 ? (
          <div className="p-8 rounded-2xl text-center" style={{ background: THEME.bg.card }}>
            <span className="text-4xl mb-2 block">🎯</span>
            <p style={{ color: THEME.text.muted }}>Hali limitlar yo'q</p>
          </div>
        ) : (
          limits.map((limit) => {
            const category = getCategoryById(limit.category_id);
            const spent = getSpentForCategory(limit.category_id);
            const percentage = Math.round((spent / limit.limit_amount) * 100);
            const isOver = percentage >= 100;
            const isNear = percentage >= 90;
            
            return (
              <div key={limit.id} className="p-5 rounded-2xl" style={{ background: THEME.bg.card }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.emoji}</span>
                    <div>
                      <p className="font-semibold" style={{ color: THEME.text.primary }}>{category.name}</p>
                      <p className="text-sm" style={{ color: THEME.text.muted }}>
                        {formatUZS(spent)} / {formatUZS(limit.limit_amount)}
                      </p>
                    </div>
                  </div>
                  <span 
                    className="text-xl font-bold"
                    style={{ color: isOver ? THEME.accent.danger : isNear ? THEME.accent.warning : THEME.accent.success }}
                  >
                    {percentage}%
                  </span>
                </div>
                <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{ 
                      background: isOver ? THEME.accent.danger : isNear ? THEME.accent.warning : category.color,
                      width: `${Math.min(100, percentage)}%` 
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  // ============================================
  // TRANSACTIONS SCREEN
  // ============================================
  const TransactionsScreen = () => (
    <div className="pb-32">
      <header className="px-5 pt-6 pb-4 flex items-center gap-4">
        <button onClick={() => setActiveScreen('home')} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: THEME.bg.card }}>
          ←
        </button>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: THEME.text.primary }}>Tranzaksiyalar</h1>
          <p className="text-sm" style={{ color: THEME.text.muted }}>{transactions.length} ta</p>
        </div>
      </header>

      <div className="px-5 space-y-2">
        {transactions.length === 0 ? (
          <div className="p-8 rounded-2xl text-center" style={{ background: THEME.bg.card }}>
            <span className="text-4xl mb-2 block">📝</span>
            <p style={{ color: THEME.text.muted }}>Hali tranzaksiyalar yo'q</p>
            <button onClick={openBot} className="mt-4 px-4 py-2 rounded-lg" style={{ background: THEME.accent.primary, color: '#000' }}>
              Botga o'tish
            </button>
          </div>
        ) : (
          transactions.map((tx) => {
            const category = getCategoryById(tx.category_id);
            return (
              <div key={tx.id} className="p-4 rounded-2xl" style={{ background: THEME.bg.card }}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ background: `${category.color}30` }}>
                    {category.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate" style={{ color: THEME.text.primary }}>{tx.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs" style={{ color: THEME.text.muted }}>
                        {new Date(tx.created_at).toLocaleDateString('uz-UZ')}
                      </span>
                      <span className="text-xs" style={{ color: THEME.text.muted }}>•</span>
                      <span className="text-xs" style={{ color: THEME.accent.primary }}>
                        {tx.source === 'voice' ? '🎤' : tx.source === 'receipt' ? '📷' : '💬'}
                      </span>
                    </div>
                  </div>
                  <p className="font-bold text-lg" style={{ color: tx.amount > 0 ? THEME.accent.success : THEME.accent.danger }}>
                    {tx.amount > 0 ? '+' : ''}{formatUZS(tx.amount)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  // ============================================
  // DEBTS SCREEN
  // ============================================
  const DebtsScreen = () => (
    <div className="pb-32">
      <header className="px-5 pt-6 pb-4 flex items-center gap-4">
        <button onClick={() => setActiveScreen('home')} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: THEME.bg.card }}>
          ←
        </button>
        <h1 className="text-2xl font-bold" style={{ color: THEME.text.primary }}>Qarzlar</h1>
      </header>

      <div className="px-5">
        <div className="p-8 rounded-2xl text-center" style={{ background: THEME.bg.card }}>
          <span className="text-4xl mb-2 block">💳</span>
          <p style={{ color: THEME.text.muted }}>Tez kunda...</p>
        </div>
      </div>
    </div>
  );

  // ============================================
  // GOALS SCREEN
  // ============================================
  const GoalsScreen = () => (
    <div className="pb-32">
      <header className="px-5 pt-6 pb-4 flex items-center gap-4">
        <button onClick={() => setActiveScreen('home')} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: THEME.bg.card }}>
          ←
        </button>
        <h1 className="text-2xl font-bold" style={{ color: THEME.text.primary }}>Maqsadlar</h1>
      </header>

      <div className="px-5 mb-4">
        <button
          onClick={() => setShowAddGoalModal(true)}
          className="w-full py-4 rounded-2xl font-semibold"
          style={{ background: THEME.gradient.primary, color: '#000' }}
        >
          + Yangi maqsad qo'shish
        </button>
      </div>

      <div className="px-5 space-y-3">
        {goals.length === 0 ? (
          <div className="p-8 rounded-2xl text-center" style={{ background: THEME.bg.card }}>
            <span className="text-4xl mb-2 block">🎯</span>
            <p style={{ color: THEME.text.muted }}>Hali maqsadlar yo'q</p>
          </div>
        ) : (
          goals.map((goal) => {
            const percentage = Math.round((goal.current_amount / goal.target_amount) * 100);
            return (
              <div key={goal.id} className="p-5 rounded-2xl" style={{ background: THEME.bg.card }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{goal.emoji || '🎯'}</span>
                    <div>
                      <p className="font-semibold" style={{ color: THEME.text.primary }}>{goal.name}</p>
                      <p className="text-sm" style={{ color: THEME.text.muted }}>
                        {formatUZS(goal.current_amount)} / {formatUZS(goal.target_amount)}
                      </p>
                    </div>
                  </div>
                  <span className="text-xl font-bold" style={{ color: THEME.accent.success }}>{percentage}%</span>
                </div>
                <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div 
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #22C55E, #4ADE80)', width: `${Math.min(100, percentage)}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  // ============================================
  // ADD TRANSACTION MODAL
  // ============================================
  const AddModal = () => (
    <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={() => setShowAddModal(false)}>
      <div className="w-full rounded-t-3xl p-6" style={{ background: THEME.bg.secondary }} onClick={e => e.stopPropagation()}>
        <div className="w-12 h-1 rounded-full mx-auto mb-6" style={{ background: 'rgba(255,255,255,0.2)' }} />
        <h2 className="text-xl font-bold mb-2" style={{ color: THEME.text.primary }}>Tranzaksiya qo'shish</h2>
        <p className="text-sm mb-6" style={{ color: THEME.text.muted }}>Botga xabar yuboring:</p>

        <div className="space-y-3 mb-6">
          <div className="p-4 rounded-xl" style={{ background: THEME.bg.card }}>
            <p className="font-medium mb-1" style={{ color: THEME.text.primary }}>🎤 Ovozli xabar</p>
            <p className="text-sm" style={{ color: THEME.text.muted }}>"Kofe 15 ming" yoki "Taksi 30k"</p>
          </div>
          <div className="p-4 rounded-xl" style={{ background: THEME.bg.card }}>
            <p className="font-medium mb-1" style={{ color: THEME.text.primary }}>💬 Matn xabari</p>
            <p className="text-sm" style={{ color: THEME.text.muted }}>"Tushlik 45000"</p>
          </div>
          <div className="p-4 rounded-xl" style={{ background: THEME.bg.card }}>
            <p className="font-medium mb-1" style={{ color: THEME.text.primary }}>📷 Chek rasmi</p>
            <p className="text-sm" style={{ color: THEME.text.muted }}>Chek rasmini yuboring</p>
          </div>
        </div>

        <button onClick={openBot} className="w-full py-4 rounded-2xl font-semibold text-lg" style={{ background: THEME.gradient.primary, color: '#000' }}>
          Botga o'tish
        </button>
      </div>
    </div>
  );

  // ============================================
  // ADD LIMIT MODAL
  // ============================================
  const AddLimitModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={() => setShowAddLimitModal(false)}>
      <div className="w-full max-w-sm rounded-2xl p-6" style={{ background: THEME.bg.secondary }} onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4" style={{ color: THEME.text.primary }}>Yangi limit</h2>
        
        <div className="mb-4">
          <label className="text-sm mb-2 block" style={{ color: THEME.text.muted }}>Kategoriya</label>
          <select
            value={newLimit.categoryId}
            onChange={e => setNewLimit({ ...newLimit, categoryId: e.target.value })}
            className="w-full p-3 rounded-xl"
            style={{ background: THEME.bg.card, color: THEME.text.primary, border: 'none' }}
          >
            {ALL_CATEGORIES.expense.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.emoji} {cat.name}</option>
            ))}
          </select>
        </div>
        
        <div className="mb-6">
          <label className="text-sm mb-2 block" style={{ color: THEME.text.muted }}>Limit summasi (UZS)</label>
          <input
            type="number"
            value={newLimit.amount}
            onChange={e => setNewLimit({ ...newLimit, amount: e.target.value })}
            placeholder="500000"
            className="w-full p-3 rounded-xl"
            style={{ background: THEME.bg.card, color: THEME.text.primary, border: 'none' }}
          />
        </div>
        
        <div className="flex gap-3">
          <button onClick={() => setShowAddLimitModal(false)} className="flex-1 py-3 rounded-xl" style={{ background: THEME.bg.card, color: THEME.text.secondary }}>
            Bekor
          </button>
          <button onClick={handleAddLimit} className="flex-1 py-3 rounded-xl font-semibold" style={{ background: THEME.accent.primary, color: '#000' }}>
            Saqlash
          </button>
        </div>
      </div>
    </div>
  );

  // ============================================
  // ADD GOAL MODAL
  // ============================================
  const AddGoalModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={() => setShowAddGoalModal(false)}>
      <div className="w-full max-w-sm rounded-2xl p-6" style={{ background: THEME.bg.secondary }} onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4" style={{ color: THEME.text.primary }}>Yangi maqsad</h2>
        
        <div className="mb-4">
          <label className="text-sm mb-2 block" style={{ color: THEME.text.muted }}>Maqsad nomi</label>
          <input
            type="text"
            value={newGoal.name}
            onChange={e => setNewGoal({ ...newGoal, name: e.target.value })}
            placeholder="Yangi iPhone"
            className="w-full p-3 rounded-xl"
            style={{ background: THEME.bg.card, color: THEME.text.primary, border: 'none' }}
          />
        </div>
        
        <div className="mb-4">
          <label className="text-sm mb-2 block" style={{ color: THEME.text.muted }}>Maqsad summasi (UZS)</label>
          <input
            type="number"
            value={newGoal.amount}
            onChange={e => setNewGoal({ ...newGoal, amount: e.target.value })}
            placeholder="15000000"
            className="w-full p-3 rounded-xl"
            style={{ background: THEME.bg.card, color: THEME.text.primary, border: 'none' }}
          />
        </div>
        
        <div className="mb-6">
          <label className="text-sm mb-2 block" style={{ color: THEME.text.muted }}>Emoji</label>
          <div className="flex gap-2 flex-wrap">
            {['🎯', '💻', '📱', '🚗', '🏠', '✈️', '💍', '🎓'].map(emoji => (
              <button
                key={emoji}
                onClick={() => setNewGoal({ ...newGoal, emoji })}
                className="w-10 h-10 rounded-lg text-xl"
                style={{ background: newGoal.emoji === emoji ? THEME.accent.primary : THEME.bg.card }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex gap-3">
          <button onClick={() => setShowAddGoalModal(false)} className="flex-1 py-3 rounded-xl" style={{ background: THEME.bg.card, color: THEME.text.secondary }}>
            Bekor
          </button>
          <button onClick={handleAddGoal} className="flex-1 py-3 rounded-xl font-semibold" style={{ background: THEME.accent.primary, color: '#000' }}>
            Saqlash
          </button>
        </div>
      </div>
    </div>
  );

  // ============================================
  // BOTTOM NAVIGATION
  // ============================================
  const BottomNav = () => (
    <nav className="fixed bottom-0 left-0 right-0 z-40 pb-safe" style={{ background: THEME.bg.primary, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
      {/* Add Transaction Button */}
      <div className="px-4 -mt-6">
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full py-4 rounded-2xl font-semibold shadow-lg"
          style={{ background: THEME.gradient.primary, color: '#000', boxShadow: '0 8px 32px rgba(249, 115, 22, 0.4)' }}
        >
          Tranzaksiya qo'shish
        </button>
      </div>
      
      <div className="flex items-center justify-around py-3 px-4">
        {[
          { icon: '🏠', label: 'Bosh sahifa', screen: 'home' },
          { icon: '📊', label: 'Statistika', screen: 'transactions' },
          { icon: '📁', label: 'Kategoriya', screen: 'categories' },
          { icon: '⚙️', label: 'Sozlamalar', screen: 'settings' },
        ].map((item, i) => (
          <button
            key={i}
            onClick={() => setActiveScreen(item.screen)}
            className="flex flex-col items-center gap-1 p-2"
          >
            <span className="text-xl">{item.icon}</span>
            <span className="text-xs" style={{ color: activeScreen === item.screen ? THEME.accent.primary : THEME.text.muted }}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="min-h-screen" style={{ background: THEME.bg.primary, color: THEME.text.primary }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
        .pb-safe { padding-bottom: env(safe-area-inset-bottom, 0); }
      `}</style>

      {activeScreen === 'home' && <HomeScreen />}
      {activeScreen === 'categories' && <CategoriesScreen />}
      {activeScreen === 'limits' && <LimitsScreen />}
      {activeScreen === 'transactions' && <TransactionsScreen />}
      {activeScreen === 'debts' && <DebtsScreen />}
      {activeScreen === 'goals' && <GoalsScreen />}
      {activeScreen === 'settings' && (
        <div className="pb-32 px-5 pt-6">
          <h1 className="text-2xl font-bold mb-4" style={{ color: THEME.text.primary }}>Sozlamalar</h1>
          <p style={{ color: THEME.text.muted }}>Tez kunda...</p>
        </div>
      )}

      <BottomNav />

      <AnimatePresence>
        {showAddModal && <AddModal />}
        {showAddLimitModal && <AddLimitModal />}
        {showAddGoalModal && <AddGoalModal />}
      </AnimatePresence>
    </div>
  );
}
