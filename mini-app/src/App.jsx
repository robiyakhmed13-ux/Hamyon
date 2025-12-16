import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// HAMYON - Smart Finance Tracker
// Telegram Mini App - All Features FREE
// ============================================

// Uzbek Som formatter
const formatUZS = (amount) => {
  const absAmount = Math.abs(amount);
  if (absAmount >= 1000000) {
    return (amount / 1000000).toFixed(1) + 'M UZS';
  }
  return new Intl.NumberFormat('uz-UZ').format(amount) + ' UZS';
};

const formatFullUZS = (amount) => {
  return new Intl.NumberFormat('uz-UZ').format(amount) + ' UZS';
};

// ============================================
// 45+ CATEGORIES DATA
// ============================================
const ALL_CATEGORIES = {
  expense: [
    // Food & Dining (5)
    { id: 'food', name: 'Oziq-ovqat', nameEn: 'Food & Groceries', emoji: '🍕', color: '#FF6B6B' },
    { id: 'restaurants', name: 'Restoranlar', nameEn: 'Restaurants', emoji: '🍽️', color: '#FF8787' },
    { id: 'coffee', name: 'Kofe & Ichimliklar', nameEn: 'Coffee & Drinks', emoji: '☕', color: '#D4A574' },
    { id: 'fastfood', name: 'Fast Food', nameEn: 'Fast Food', emoji: '🍔', color: '#FFA94D' },
    { id: 'delivery', name: 'Yetkazib berish', nameEn: 'Food Delivery', emoji: '🛵', color: '#FF922B' },
    
    // Transportation (5)
    { id: 'taxi', name: 'Taksi', nameEn: 'Taxi & Rides', emoji: '🚕', color: '#FFD43B' },
    { id: 'fuel', name: 'Benzin', nameEn: 'Fuel & Gas', emoji: '⛽', color: '#FAB005' },
    { id: 'publicTransport', name: 'Jamoat transporti', nameEn: 'Public Transport', emoji: '🚌', color: '#F59F00' },
    { id: 'parking', name: 'Parkovka', nameEn: 'Parking', emoji: '🅿️', color: '#F08C00' },
    { id: 'carMaintenance', name: 'Avto xizmat', nameEn: 'Car Maintenance', emoji: '🔧', color: '#E67700' },
    
    // Shopping (5)
    { id: 'clothing', name: 'Kiyim-kechak', nameEn: 'Clothing & Fashion', emoji: '👕', color: '#845EF7' },
    { id: 'electronics', name: 'Elektronika', nameEn: 'Electronics', emoji: '📱', color: '#7950F2' },
    { id: 'accessories', name: 'Aksessuarlar', nameEn: 'Accessories', emoji: '👜', color: '#7048E8' },
    { id: 'gifts', name: 'Sovg\'alar', nameEn: 'Gifts', emoji: '🎁', color: '#6741D9' },
    { id: 'beauty', name: 'Go\'zallik', nameEn: 'Beauty & Cosmetics', emoji: '💄', color: '#AE3EC9' },
    
    // Home & Utilities (5)
    { id: 'rent', name: 'Ijara', nameEn: 'Rent', emoji: '🏠', color: '#20C997' },
    { id: 'utilities', name: 'Kommunal', nameEn: 'Utilities', emoji: '💡', color: '#12B886' },
    { id: 'internet', name: 'Internet & Telefon', nameEn: 'Internet & Phone', emoji: '📶', color: '#0CA678' },
    { id: 'furniture', name: 'Mebel', nameEn: 'Furniture', emoji: '🛋️', color: '#099268' },
    { id: 'repairs', name: 'Ta\'mirlash', nameEn: 'Home Repairs', emoji: '🔨', color: '#087F5B' },
    
    // Entertainment (5)
    { id: 'movies', name: 'Kino', nameEn: 'Movies & Cinema', emoji: '🎬', color: '#339AF0' },
    { id: 'games', name: 'O\'yinlar', nameEn: 'Games', emoji: '🎮', color: '#228BE6' },
    { id: 'subscriptions', name: 'Obunalar', nameEn: 'Subscriptions', emoji: '📺', color: '#1C7ED6' },
    { id: 'concerts', name: 'Konsertlar', nameEn: 'Concerts & Events', emoji: '🎵', color: '#1971C2' },
    { id: 'hobbies', name: 'Sevimli mashg\'ulot', nameEn: 'Hobbies', emoji: '🎨', color: '#1864AB' },
    
    // Health & Wellness (5)
    { id: 'pharmacy', name: 'Dorixona', nameEn: 'Pharmacy', emoji: '💊', color: '#F06595' },
    { id: 'doctor', name: 'Shifokor', nameEn: 'Doctor & Medical', emoji: '🏥', color: '#E64980' },
    { id: 'gym', name: 'Sport zal', nameEn: 'Gym & Fitness', emoji: '💪', color: '#D6336C' },
    { id: 'sports', name: 'Sport', nameEn: 'Sports', emoji: '⚽', color: '#C2255C' },
    { id: 'wellness', name: 'Sog\'lom turmush', nameEn: 'Spa & Wellness', emoji: '🧘', color: '#A61E4D' },
    
    // Education (4)
    { id: 'courses', name: 'Kurslar', nameEn: 'Courses', emoji: '📚', color: '#4DABF7' },
    { id: 'books', name: 'Kitoblar', nameEn: 'Books', emoji: '📖', color: '#3BC9DB' },
    { id: 'tuition', name: 'O\'qish to\'lovi', nameEn: 'Tuition', emoji: '🎓', color: '#22B8CF' },
    { id: 'supplies', name: 'O\'quv anjomlari', nameEn: 'School Supplies', emoji: '✏️', color: '#15AABF' },
    
    // Travel (4)
    { id: 'flights', name: 'Parvozlar', nameEn: 'Flights', emoji: '✈️', color: '#748FFC' },
    { id: 'hotels', name: 'Mehmonxona', nameEn: 'Hotels', emoji: '🏨', color: '#5C7CFA' },
    { id: 'vacation', name: 'Dam olish', nameEn: 'Vacation', emoji: '🏖️', color: '#4C6EF5' },
    { id: 'businessTravel', name: 'Xizmat safari', nameEn: 'Business Travel', emoji: '💼', color: '#4263EB' },
    
    // Other (6)
    { id: 'pets', name: 'Uy hayvonlari', nameEn: 'Pets', emoji: '🐕', color: '#FF8A65' },
    { id: 'charity', name: 'Xayriya', nameEn: 'Charity & Donations', emoji: '❤️', color: '#EF5350' },
    { id: 'insurance', name: 'Sug\'urta', nameEn: 'Insurance', emoji: '🛡️', color: '#78909C' },
    { id: 'taxes', name: 'Soliqlar', nameEn: 'Taxes', emoji: '📋', color: '#607D8B' },
    { id: 'childcare', name: 'Bolalar uchun', nameEn: 'Childcare', emoji: '👶', color: '#FFAB91' },
    { id: 'other', name: 'Boshqa xarajatlar', nameEn: 'Other Expenses', emoji: '📦', color: '#90A4AE' },
  ],
  income: [
    { id: 'salary', name: 'Oylik maosh', nameEn: 'Salary', emoji: '💰', color: '#51CF66' },
    { id: 'freelance', name: 'Frilanser', nameEn: 'Freelance', emoji: '💻', color: '#40C057' },
    { id: 'business', name: 'Biznes daromad', nameEn: 'Business Income', emoji: '🏢', color: '#37B24D' },
    { id: 'investments', name: 'Investitsiyalar', nameEn: 'Investments', emoji: '📈', color: '#2F9E44' },
    { id: 'rental', name: 'Ijara daromadi', nameEn: 'Rental Income', emoji: '🏘️', color: '#2B8A3E' },
    { id: 'gifts_income', name: 'Sovg\'a olindi', nameEn: 'Gifts Received', emoji: '🎀', color: '#FFD43B' },
    { id: 'refunds', name: 'Qaytarilgan pul', nameEn: 'Refunds', emoji: '↩️', color: '#FCC419' },
    { id: 'bonus', name: 'Bonus', nameEn: 'Bonus', emoji: '🎉', color: '#F59F00' },
    { id: 'cashback', name: 'Keshbek', nameEn: 'Cashback', emoji: '💳', color: '#94D82D' },
    { id: 'other_income', name: 'Boshqa daromad', nameEn: 'Other Income', emoji: '💵', color: '#82C91E' },
  ],
  debt: [
    { id: 'borrowed', name: 'Qarz oldim', nameEn: 'Money Borrowed', emoji: '🤝', color: '#FF6B6B' },
    { id: 'lent', name: 'Qarz berdim', nameEn: 'Money Lent', emoji: '💸', color: '#51CF66' },
    { id: 'credit', name: 'Kredit karta', nameEn: 'Credit Card', emoji: '💳', color: '#845EF7' },
    { id: 'loan_payment', name: 'Qarz to\'lovi', nameEn: 'Loan Payment', emoji: '🏦', color: '#339AF0' },
  ]
};

// ============================================
// INITIAL APP STATE
// ============================================
const initialState = {
  user: {
    name: 'Foydalanuvchi',
    phone: '',
  },
  balance: 2450000,
  todayExpenses: 125000,
  todayIncome: 0,
  weeklySpent: 875000,
  weeklyAvg: 125000,
  financialScore: 78,
  savingsGoal: {
    name: 'Yangi MacBook',
    target: 15000000,
    current: 8400000,
    emoji: '💻',
  },
  limits: [
    { categoryId: 'food', limit: 500000, spent: 380000 },
    { categoryId: 'taxi', limit: 300000, spent: 285000 },
    { categoryId: 'restaurants', limit: 400000, spent: 250000 },
    { categoryId: 'coffee', limit: 150000, spent: 145000 },
    { categoryId: 'movies', limit: 200000, spent: 80000 },
  ],
  transactions: [
    { id: 1, description: 'Taksi uchlik ming', amount: -30000, categoryId: 'taxi', date: '2025-01-15', time: '14:30', source: 'voice' },
    { id: 2, description: 'Boshlang\'ich balans', amount: 100000, categoryId: 'other_income', date: '2025-01-15', time: '12:00', source: 'text' },
    { id: 3, description: 'Starbucks kofe', amount: -25000, categoryId: 'coffee', date: '2025-01-14', time: '09:15', source: 'receipt' },
    { id: 4, description: 'Tushlik', amount: -45000, categoryId: 'restaurants', date: '2025-01-14', time: '13:00', source: 'voice' },
    { id: 5, description: 'Oylik maosh', amount: 5000000, categoryId: 'salary', date: '2025-01-10', time: '10:00', source: 'text' },
  ],
  weeklyData: [
    { day: 'Dush', spent: 85000, income: 0 },
    { day: 'Sesh', spent: 120000, income: 0 },
    { day: 'Chor', spent: 45000, income: 5000000 },
    { day: 'Pay', spent: 200000, income: 0 },
    { day: 'Jum', spent: 180000, income: 0 },
    { day: 'Shan', spent: 150000, income: 0 },
    { day: 'Yak', spent: 95000, income: 0 },
  ],
  aiInsights: [
    { type: 'success', icon: '🎉', title: 'Zo\'r natija!', message: 'O\'tgan haftaga nisbatan oziq-ovqatga 23% kam sarfladingiz' },
    { type: 'warning', icon: '⚠️', title: 'Diqqat', message: 'Kofe xarajatlari oylik limitning 96% ga yetdi' },
    { type: 'tip', icon: '💡', title: 'Maslahat', message: 'Haftada 3 ta taksi kamaytirsangiz, oyiga 150,000 UZS tejaysiz' },
    { type: 'prediction', icon: '🔮', title: 'Bashorat', message: 'Hozirgi tezlikda oy oxiriga 1,575,000 UZS qoladi' },
  ],
};

// ============================================
// COLOR PALETTE - WARM SUNSET THEME
// ============================================
const THEME = {
  bg: {
    primary: '#0F0F14',
    secondary: '#16161D',
    card: '#1C1C26',
    cardHover: '#222230',
  },
  accent: {
    primary: '#F97316',
    secondary: '#FB923C',
    tertiary: '#FDBA74',
    success: '#22C55E',
    warning: '#FBBF24',
    danger: '#EF4444',
    info: '#38BDF8',
  },
  text: {
    primary: '#FAFAFA',
    secondary: '#A1A1AA',
    muted: '#71717A',
  },
  gradient: {
    primary: 'linear-gradient(135deg, #F97316 0%, #FB923C 50%, #FBBF24 100%)',
    success: 'linear-gradient(135deg, #22C55E 0%, #4ADE80 100%)',
    danger: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)',
    purple: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
    blue: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
  }
};

// ============================================
// UTILITY COMPONENTS
// ============================================
const GlassCard = ({ children, className = '', onClick, style = {}, gradient }) => (
  <motion.div
    whileHover={onClick ? { scale: 1.01, y: -2 } : {}}
    whileTap={onClick ? { scale: 0.99 } : {}}
    onClick={onClick}
    className={`relative overflow-hidden rounded-2xl border border-white/5 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    style={{
      background: gradient || THEME.bg.card,
      ...style
    }}
  >
    {children}
  </motion.div>
);

const getCategoryById = (id) => {
  const allCats = [...ALL_CATEGORIES.expense, ...ALL_CATEGORIES.income, ...ALL_CATEGORIES.debt];
  return allCats.find(c => c.id === id) || { name: 'Noma\'lum', emoji: '❓', color: '#888' };
};

// ============================================
// MAIN APP COMPONENT
// ============================================
export default function HamyonApp() {
  const [state, setState] = useState(initialState);
  const [activeTab, setActiveTab] = useState('home');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInsightsModal, setShowInsightsModal] = useState(false);
  const [showCategoriesScreen, setShowCategoriesScreen] = useState(false);
  const [showLimitsScreen, setShowLimitsScreen] = useState(false);
  const [showTransactionsScreen, setShowTransactionsScreen] = useState(false);
  const [showAnalyticsScreen, setShowAnalyticsScreen] = useState(false);
  const [showDebtsScreen, setShowDebtsScreen] = useState(false);
  const [showGoalsScreen, setShowGoalsScreen] = useState(false);
  const [showAddTransactionForm, setShowAddTransactionForm] = useState(false);
  const [newTransaction, setNewTransaction] = useState({ description: '', amount: '', categoryId: 'food' });
  
  // Telegram WebApp integration
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      tg.setHeaderColor('#0F0F14');
      tg.setBackgroundColor('#0F0F14');
      
      if (tg.initDataUnsafe?.user) {
        setState(prev => ({
          ...prev,
          user: {
            ...prev.user,
            name: tg.initDataUnsafe.user.first_name || prev.user.name,
          }
        }));
      }
    }
  }, []);

  const savingsPercentage = Math.round((state.savingsGoal.current / state.savingsGoal.target) * 100);

  // ============================================
  // HOME SCREEN
  // ============================================
  const HomeScreen = () => (
    <div className="pb-24">
      {/* Header */}
      <header className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold"
              style={{ background: THEME.gradient.primary }}
            >
              {state.user.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: THEME.text.primary }}>
                Salom, {state.user.name}!
              </h1>
              <p className="text-sm" style={{ color: THEME.text.muted }}>
                Moliyaviy yordamchingiz
              </p>
            </div>
          </div>
          <div 
            className="text-2xl font-black tracking-tight"
            style={{ 
              background: THEME.gradient.primary,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Hamyon
          </div>
        </div>
      </header>

      {/* Balance Card */}
      <div className="px-5 mb-4">
        <GlassCard className="p-5">
          <p className="text-sm mb-1" style={{ color: THEME.text.muted }}>Joriy balans</p>
          <div className="flex items-center gap-2 mb-4">
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: THEME.accent.success }}
            />
            <h2 
              className="text-3xl font-bold"
              style={{ color: THEME.text.primary }}
            >
              {formatFullUZS(state.balance)}
            </h2>
          </div>
          
          {/* Today's Summary */}
          <div 
            className="p-4 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            <p className="text-sm mb-3 text-center" style={{ color: THEME.text.muted }}>Bugungi xulosa</p>
            <div className="flex justify-around">
              <div className="text-center">
                <p className="text-xl font-bold" style={{ color: THEME.accent.danger }}>
                  {state.todayExpenses > 0 ? formatUZS(state.todayExpenses) : '0'}
                </p>
                <div className="flex items-center gap-1 justify-center">
                  <span style={{ color: THEME.accent.danger }}>↘</span>
                  <span className="text-xs" style={{ color: THEME.text.muted }}>Xarajatlar</span>
                </div>
              </div>
              <div className="w-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
              <div className="text-center">
                <p className="text-xl font-bold" style={{ color: THEME.accent.success }}>
                  {state.todayIncome > 0 ? formatUZS(state.todayIncome) : '0'}
                </p>
                <div className="flex items-center gap-1 justify-center">
                  <span style={{ color: THEME.accent.success }}>↗</span>
                  <span className="text-xs" style={{ color: THEME.text.muted }}>Daromad</span>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Quick Actions Grid */}
      <div className="px-5 mb-4">
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: '🎯', label: 'Limitlar', action: () => setShowLimitsScreen(true), gradient: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)' },
            { icon: '📊', label: 'Kategoriyalar', action: () => setShowCategoriesScreen(true), gradient: 'linear-gradient(135deg, #38BDF8 0%, #0EA5E9 100%)' },
            { icon: '📜', label: 'Tranzaksiyalar', action: () => setShowTransactionsScreen(true), gradient: 'linear-gradient(135deg, #4ADE80 0%, #22C55E 100%)' },
            { icon: '💳', label: 'Qarzlar', action: () => setShowDebtsScreen(true), gradient: 'linear-gradient(135deg, #FB923C 0%, #EA580C 100%)' },
          ].map((item, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={item.action}
              className="p-4 rounded-2xl flex flex-col items-center gap-2"
              style={{ background: THEME.bg.card, border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: item.gradient }}
              >
                {item.icon}
              </div>
              <span className="text-sm font-medium" style={{ color: THEME.text.primary }}>{item.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Analytics Card */}
      <div className="px-5 mb-4">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setShowAnalyticsScreen(true)}
          className="w-full p-5 rounded-2xl flex items-center gap-4"
          style={{ background: THEME.bg.card, border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <div 
            className="w-14 h-14 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)' }}
          >
            <span className="text-2xl">📈</span>
          </div>
          <div className="text-left flex-1">
            <p className="font-semibold" style={{ color: THEME.text.primary }}>Analitika</p>
            <p className="text-sm" style={{ color: THEME.text.muted }}>Xarajatlar va tendensiyalar</p>
          </div>
          <span style={{ color: THEME.text.muted }}>→</span>
        </motion.button>
      </div>

      {/* Goals Card */}
      <div className="px-5 mb-4">
        <GlassCard 
          className="p-5"
          onClick={() => setShowGoalsScreen(true)}
          gradient="linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(16, 185, 129, 0.08) 100%)"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{state.savingsGoal.emoji}</span>
              <div>
                <p className="font-semibold" style={{ color: THEME.text.primary }}>{state.savingsGoal.name}</p>
                <p className="text-xs" style={{ color: THEME.text.muted }}>Jamg'arma maqsadi</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold" style={{ color: THEME.accent.success }}>{savingsPercentage}%</p>
              <p className="text-xs" style={{ color: THEME.text.muted }}>{formatUZS(state.savingsGoal.target - state.savingsGoal.current)} qoldi</p>
            </div>
          </div>
          <div 
            className="h-3 rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.1)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: THEME.gradient.success }}
              initial={{ width: 0 }}
              animate={{ width: `${savingsPercentage}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </GlassCard>
      </div>

      {/* This Week Summary */}
      <div className="px-5 mb-4">
        <GlassCard className="p-5">
          <h3 className="font-semibold mb-4" style={{ color: THEME.text.primary }}>Bu hafta</h3>
          <div className="flex justify-between mb-4">
            <div>
              <p className="text-sm" style={{ color: THEME.text.muted }}>Jami xarajat</p>
              <p className="text-xl font-bold" style={{ color: THEME.text.primary }}>{formatUZS(state.weeklySpent)}</p>
              <div className="flex items-center gap-1 mt-1">
                <span style={{ color: THEME.accent.danger }}>↘</span>
                <span className="text-xs" style={{ color: THEME.accent.danger }}>-{formatUZS(Math.abs(state.weeklySpent - 900000))}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm" style={{ color: THEME.text.muted }}>Kunlik o'rtacha</p>
              <p className="text-xl font-bold" style={{ color: THEME.text.primary }}>{formatUZS(state.weeklyAvg)}</p>
              <div className="flex items-center gap-1 mt-1 justify-end">
                <span style={{ color: THEME.accent.success }}>↗</span>
                <span className="text-xs" style={{ color: THEME.accent.success }}>+0</span>
              </div>
            </div>
          </div>
          
          {/* Mini Chart */}
          <div className="flex items-end gap-1 h-16 mb-2">
            {state.weeklyData.map((day, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-t-sm"
                style={{ 
                  background: i === 6 ? THEME.gradient.primary : 'rgba(249, 115, 22, 0.3)',
                }}
                initial={{ height: 0 }}
                animate={{ height: `${(day.spent / 250000) * 100}%` }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
              />
            ))}
          </div>
          <div className="flex justify-between">
            {state.weeklyData.map((day, i) => (
              <span key={i} className="text-xs flex-1 text-center" style={{ color: THEME.text.muted }}>{day.day}</span>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Recent Activity */}
      <div className="px-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold" style={{ color: THEME.text.primary }}>So'nggi operatsiyalar</h3>
          <button 
            onClick={() => setShowTransactionsScreen(true)}
            className="text-sm font-medium"
            style={{ color: THEME.accent.primary }}
          >
            Hammasi
          </button>
        </div>
        
        <div className="space-y-2">
          {state.transactions.slice(0, 3).map((tx) => {
            const category = getCategoryById(tx.categoryId);
            return (
              <GlassCard key={tx.id} className="p-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ background: `${category.color}20` }}
                  >
                    {category.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate" style={{ color: THEME.text.primary }}>{tx.description}</p>
                    <p className="text-xs" style={{ color: THEME.text.muted }}>{tx.date}</p>
                  </div>
                  <p 
                    className="font-bold text-right"
                    style={{ color: tx.amount > 0 ? THEME.accent.success : THEME.accent.danger }}
                  >
                    {tx.amount > 0 ? '+' : ''}{formatUZS(tx.amount)}
                  </p>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* Financial Score */}
      <div className="px-5 mb-4">
        <GlassCard 
          className="p-5"
          onClick={() => setShowInsightsModal(true)}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">💎</span>
              <span className="font-semibold" style={{ color: THEME.text.primary }}>Moliyaviy salomatlik</span>
            </div>
            <span className="text-2xl font-bold" style={{ color: THEME.accent.primary }}>{state.financialScore}/100</span>
          </div>
          <div 
            className="h-2 rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.1)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: THEME.gradient.primary }}
              initial={{ width: 0 }}
              animate={{ width: `${state.financialScore}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          <p className="text-xs mt-2 flex items-center gap-1" style={{ color: THEME.text.muted }}>
            <span>✨</span> AI tavsiyalarini ko'rish uchun bosing
          </p>
        </GlassCard>
      </div>
    </div>
  );

  // ============================================
  // ADD TRANSACTION MODAL
  // ============================================
  const AddTransactionModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={() => setShowAddModal(false)}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full rounded-t-3xl p-6"
        style={{ background: THEME.bg.secondary }}
      >
        <div className="w-12 h-1 rounded-full mx-auto mb-6" style={{ background: 'rgba(255,255,255,0.2)' }} />
        
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold" style={{ color: THEME.text.primary }}>Tranzaksiya qo'shish</h2>
          <button onClick={() => setShowAddModal(false)}>
            <span style={{ color: THEME.text.muted }}>✕</span>
          </button>
        </div>
        <p className="text-sm mb-6" style={{ color: THEME.text.muted }}>
          Telegram bot orqali xarajat va daromadlaringizni tez qo'shing
        </p>

        <div className="space-y-3 mb-6">
          {[
            { 
              icon: '🎤', 
              title: 'Ovozli xabar', 
              desc: 'Shunchaki ayting: "Taksi 30 ming" yoki "Oylik 5 million"',
              gradient: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
            },
            { 
              icon: '📷', 
              title: 'Chek skanerlash', 
              desc: 'Chek rasmini yuboring, biz summani avtomatik aniqlaymiz',
              gradient: 'linear-gradient(135deg, #38BDF8 0%, #0284C7 100%)',
            },
            { 
              icon: '💬', 
              title: 'Matn xabari', 
              desc: '"Kofe 15000" yoki "Maosh 5,000,000" deb yozing',
              gradient: 'linear-gradient(135deg, #A78BFA 0%, #7C3AED 100%)',
            },
          ].map((method, i) => (
            <GlassCard key={i} className="p-4">
              <div className="flex items-start gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: method.gradient }}
                >
                  {method.icon}
                </div>
                <div>
                  <h4 className="font-semibold mb-1" style={{ color: THEME.text.primary }}>{method.title}</h4>
                  <p className="text-sm" style={{ color: THEME.text.muted }}>{method.desc}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (window.Telegram?.WebApp) {
              window.Telegram.WebApp.openTelegramLink('https://t.me/hamyon_uz_bot');
            }
          }}
          className="w-full py-4 rounded-2xl font-semibold text-lg"
          style={{ background: THEME.gradient.primary, color: '#000' }}
        >
          Botni ochish
        </motion.button>
        
        <p className="text-xs text-center mt-4" style={{ color: THEME.text.muted }}>
          Bot xabaringizni qayta ishlaydi va tranzaksiyani saqlaydi
        </p>
      </motion.div>
    </motion.div>
  );

  // ============================================
  // CATEGORIES SCREEN
  // ============================================
  const CategoriesScreen = () => {
    const [activeType, setActiveType] = useState('expense');
    const categories = ALL_CATEGORIES[activeType] || [];
    
    return (
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        className="fixed inset-0 z-50 overflow-y-auto"
        style={{ background: THEME.bg.primary }}
      >
        <div className="p-5 pb-24">
          <div className="flex items-center gap-4 mb-6">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowCategoriesScreen(false)}
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: THEME.bg.card }}
            >
              ←
            </motion.button>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: THEME.text.primary }}>Kategoriyalar</h1>
              <p className="text-sm" style={{ color: THEME.text.muted }}>
                Daromad, xarajat va qarz kategoriyalari
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-2xl font-semibold mb-6"
            style={{ background: THEME.gradient.primary, color: '#000' }}
          >
            + Kategoriya qo'shish
          </motion.button>

          <div className="flex gap-2 mb-4">
            {[
              { key: 'expense', label: 'Xarajat', icon: '↘', count: ALL_CATEGORIES.expense.length },
              { key: 'income', label: 'Daromad', icon: '↗', count: ALL_CATEGORIES.income.length },
              { key: 'debt', label: 'Qarz', icon: '💳', count: ALL_CATEGORIES.debt.length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveType(tab.key)}
                className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                style={{ 
                  background: activeType === tab.key ? THEME.bg.card : 'transparent',
                  color: activeType === tab.key ? THEME.text.primary : THEME.text.muted,
                  border: `1px solid ${activeType === tab.key ? 'rgba(255,255,255,0.1)' : 'transparent'}`
                }}
              >
                <span>{tab.icon}</span>
                <span className="text-sm font-medium">{tab.label}</span>
                <span 
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {categories.map((cat) => (
              <GlassCard key={cat.id} className="p-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                    style={{ background: `${cat.color}30` }}
                  >
                    {cat.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium" style={{ color: THEME.text.primary }}>{cat.name}</p>
                    <p className="text-xs" style={{ color: THEME.text.muted }}>{cat.nameEn}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(59, 130, 246, 0.2)' }}
                    >
                      <span style={{ color: '#3B82F6' }}>✏️</span>
                    </button>
                    <button 
                      className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(239, 68, 68, 0.2)' }}
                    >
                      <span style={{ color: '#EF4444' }}>👁️</span>
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  // ============================================
  // LIMITS SCREEN
  // ============================================
  const LimitsScreen = () => (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ background: THEME.bg.primary }}
    >
      <div className="p-5 pb-24">
        <div className="flex items-center gap-4 mb-6">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowLimitsScreen(false)}
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: THEME.bg.card }}
          >
            ←
          </motion.button>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: THEME.text.primary }}>Xarajat limitlari</h1>
            <p className="text-sm" style={{ color: THEME.text.muted }}>
              Har bir kategoriya uchun byudjet belgilang
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-2xl font-semibold mb-6"
          style={{ background: THEME.gradient.primary, color: '#000' }}
        >
          + Yangi limit qo'shish
        </motion.button>

        <div className="space-y-3">
          {state.limits.map((limit, i) => {
            const category = getCategoryById(limit.categoryId);
            const percentage = Math.round((limit.spent / limit.limit) * 100);
            const isNearLimit = percentage >= 90;
            const isOverLimit = percentage >= 100;
            
            return (
              <GlassCard key={i} className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                      style={{ background: `${category.color}30` }}
                    >
                      {category.emoji}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold" style={{ color: THEME.text.primary }}>{category.name}</p>
                        {isNearLimit && !isOverLimit && (
                          <span 
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(251, 191, 36, 0.2)', color: THEME.accent.warning }}
                          >
                            ⚠️ Limitga yaqin
                          </span>
                        )}
                        {isOverLimit && (
                          <span 
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(239, 68, 68, 0.2)', color: THEME.accent.danger }}
                          >
                            🚨 Limit oshdi
                          </span>
                        )}
                      </div>
                      <p className="text-sm" style={{ color: THEME.text.muted }}>
                        {formatUZS(limit.spent)} / {formatUZS(limit.limit)}
                      </p>
                    </div>
                  </div>
                  <span 
                    className="text-xl font-bold"
                    style={{ 
                      color: isOverLimit ? THEME.accent.danger : 
                             isNearLimit ? THEME.accent.warning : 
                             THEME.accent.success 
                    }}
                  >
                    {percentage}%
                  </span>
                </div>
                <div 
                  className="h-3 rounded-full overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ 
                      background: isOverLimit ? THEME.gradient.danger :
                                 isNearLimit ? 'linear-gradient(90deg, #FBBF24, #F59E0B)' :
                                 `linear-gradient(90deg, ${category.color}, ${category.color}88)`
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percentage, 100)}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1 }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs" style={{ color: THEME.text.muted }}>
                    Qoldi: {formatUZS(Math.max(0, limit.limit - limit.spent))}
                  </span>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </motion.div>
  );

  // ============================================
  // TRANSACTIONS SCREEN
  // ============================================
  const TransactionsScreen = () => (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ background: THEME.bg.primary }}
    >
      <div className="p-5 pb-24">
        <div className="flex items-center gap-4 mb-6">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowTransactionsScreen(false)}
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: THEME.bg.card }}
          >
            ←
          </motion.button>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: THEME.text.primary }}>Barcha tranzaksiyalar</h1>
            <p className="text-sm" style={{ color: THEME.text.muted }}>
              {state.transactions.length} ta tranzaksiya
            </p>
          </div>
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {['Hammasi', 'Xarajatlar', 'Daromadlar', 'Bugun', 'Bu hafta'].map((filter) => (
            <button
              key={filter}
              className="px-4 py-2 rounded-xl whitespace-nowrap text-sm"
              style={{ 
                background: filter === 'Hammasi' ? THEME.accent.primary : THEME.bg.card,
                color: filter === 'Hammasi' ? '#000' : THEME.text.secondary,
              }}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {state.transactions.map((tx) => {
            const category = getCategoryById(tx.categoryId);
            return (
              <GlassCard key={tx.id} className="p-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                    style={{ background: `${category.color}30` }}
                  >
                    {category.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate" style={{ color: THEME.text.primary }}>{tx.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs" style={{ color: THEME.text.muted }}>{tx.date}</span>
                      <span className="text-xs" style={{ color: THEME.text.muted }}>•</span>
                      <span className="text-xs" style={{ color: THEME.text.muted }}>{category.name}</span>
                      {tx.source && (
                        <>
                          <span className="text-xs" style={{ color: THEME.text.muted }}>•</span>
                          <span className="text-xs" style={{ color: THEME.accent.primary }}>
                            {tx.source === 'voice' ? '🎤' : tx.source === 'receipt' ? '📷' : '💬'}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <p 
                    className="font-bold text-lg"
                    style={{ color: tx.amount > 0 ? THEME.accent.success : THEME.accent.danger }}
                  >
                    {tx.amount > 0 ? '+' : ''}{formatUZS(tx.amount)}
                  </p>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </motion.div>
  );

  // ============================================
  // ANALYTICS SCREEN
  // ============================================
  const AnalyticsScreen = () => (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ background: THEME.bg.primary }}
    >
      <div className="p-5 pb-24">
        <div className="flex items-center gap-4 mb-6">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowAnalyticsScreen(false)}
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: THEME.bg.card }}
          >
            ←
          </motion.button>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: THEME.text.primary }}>Analitika</h1>
            <p className="text-sm" style={{ color: THEME.text.muted }}>
              Moliyaviy tahlil
            </p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {['Hafta', 'Oy', 'Yil'].map((period, i) => (
            <button
              key={period}
              className="flex-1 py-3 rounded-xl text-sm font-medium"
              style={{ 
                background: i === 0 ? THEME.accent.primary : THEME.bg.card,
                color: i === 0 ? '#000' : THEME.text.secondary,
              }}
            >
              {period}
            </button>
          ))}
        </div>

        <GlassCard className="p-5 mb-4">
          <h3 className="font-semibold mb-4" style={{ color: THEME.text.primary }}>Kunlik xarajatlar</h3>
          <div className="flex items-end gap-2 h-32 mb-2">
            {state.weeklyData.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  className="w-full rounded-t-lg"
                  style={{ background: THEME.gradient.primary }}
                  initial={{ height: 0 }}
                  animate={{ height: `${(day.spent / 250000) * 100}%` }}
                  transition={{ delay: i * 0.05, duration: 0.5 }}
                />
                <span className="text-xs" style={{ color: THEME.text.muted }}>{day.day}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5 mb-4">
          <h3 className="font-semibold mb-4" style={{ color: THEME.text.primary }}>Eng ko'p xarajat</h3>
          <div className="space-y-3">
            {state.limits.slice(0, 5).map((limit, i) => {
              const category = getCategoryById(limit.categoryId);
              return (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-lg">{category.emoji}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm" style={{ color: THEME.text.primary }}>{category.name}</span>
                      <span className="text-sm font-semibold" style={{ color: category.color }}>{formatUZS(limit.spent)}</span>
                    </div>
                    <div 
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{ background: 'rgba(255,255,255,0.1)' }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: category.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(limit.spent / limit.limit) * 100}%` }}
                        transition={{ delay: i * 0.1 }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <h3 className="font-semibold mb-4" style={{ color: THEME.text.primary }}>Daromad va Xarajat</h3>
          <div className="flex gap-4 mb-4">
            <div className="flex-1 p-4 rounded-xl" style={{ background: 'rgba(34, 197, 94, 0.1)' }}>
              <p className="text-xs mb-1" style={{ color: THEME.text.muted }}>Jami daromad</p>
              <p className="text-xl font-bold" style={{ color: THEME.accent.success }}>+5.1M</p>
            </div>
            <div className="flex-1 p-4 rounded-xl" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
              <p className="text-xs mb-1" style={{ color: THEME.text.muted }}>Jami xarajat</p>
              <p className="text-xl font-bold" style={{ color: THEME.accent.danger }}>-2.5M</p>
            </div>
          </div>
          <div className="p-4 rounded-xl" style={{ background: 'rgba(249, 115, 22, 0.1)' }}>
            <p className="text-xs mb-1 text-center" style={{ color: THEME.text.muted }}>Sof tejam</p>
            <p className="text-2xl font-bold text-center" style={{ color: THEME.accent.primary }}>+2.6M UZS</p>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );

  // ============================================
  // DEBTS SCREEN
  // ============================================
  const DebtsScreen = () => (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ background: THEME.bg.primary }}
    >
      <div className="p-5 pb-24">
        <div className="flex items-center gap-4 mb-6">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowDebtsScreen(false)}
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: THEME.bg.card }}
          >
            ←
          </motion.button>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: THEME.text.primary }}>Qarzlar</h1>
            <p className="text-sm" style={{ color: THEME.text.muted }}>
              Qarz olish va berish
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <GlassCard className="p-4 text-center" gradient="linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 100%)">
            <p className="text-xs mb-1" style={{ color: THEME.text.muted }}>Men qarzdorman</p>
            <p className="text-xl font-bold" style={{ color: THEME.accent.danger }}>0 UZS</p>
          </GlassCard>
          <GlassCard className="p-4 text-center" gradient="linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.05) 100%)">
            <p className="text-xs mb-1" style={{ color: THEME.text.muted }}>Menga qarzdor</p>
            <p className="text-xl font-bold" style={{ color: THEME.accent.success }}>0 UZS</p>
          </GlassCard>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-2xl font-semibold mb-6"
          style={{ background: THEME.gradient.primary, color: '#000' }}
        >
          + Qarz qo'shish
        </motion.button>

        <div className="text-center py-12">
          <span className="text-6xl mb-4 block">💳</span>
          <p style={{ color: THEME.text.muted }}>Hozircha qarzlar yo'q</p>
          <p className="text-sm mt-2" style={{ color: THEME.text.muted }}>
            Qarz olish yoki berish uchun tugmani bosing
          </p>
        </div>
      </div>
    </motion.div>
  );

  // ============================================
  // GOALS SCREEN
  // ============================================
  const GoalsScreen = () => (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ background: THEME.bg.primary }}
    >
      <div className="p-5 pb-24">
        <div className="flex items-center gap-4 mb-6">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowGoalsScreen(false)}
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: THEME.bg.card }}
          >
            ←
          </motion.button>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: THEME.text.primary }}>Maqsadlar</h1>
            <p className="text-sm" style={{ color: THEME.text.muted }}>
              Jamg'arma maqsadlari
            </p>
          </div>
        </div>

        {/* Main Goal */}
        <GlassCard 
          className="p-6 mb-6"
          gradient="linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)"
        >
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{state.savingsGoal.emoji}</div>
            <h3 className="text-2xl font-bold" style={{ color: THEME.text.primary }}>{state.savingsGoal.name}</h3>
            <p className="text-sm" style={{ color: THEME.text.muted }}>Asosiy maqsad</p>
          </div>
          
          <div className="relative mb-4">
            <div 
              className="h-6 rounded-full overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: THEME.gradient.success }}
                initial={{ width: 0 }}
                animate={{ width: `${savingsPercentage}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-bold text-sm">{savingsPercentage}%</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <p className="text-sm" style={{ color: THEME.text.muted }}>Yig'ildi</p>
              <p className="text-xl font-bold" style={{ color: THEME.accent.success }}>{formatUZS(state.savingsGoal.current)}</p>
            </div>
            <div className="p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <p className="text-sm" style={{ color: THEME.text.muted }}>Qoldi</p>
              <p className="text-xl font-bold" style={{ color: THEME.accent.warning }}>{formatUZS(state.savingsGoal.target - state.savingsGoal.current)}</p>
            </div>
          </div>
          
          <div className="mt-4 p-4 rounded-2xl" style={{ background: 'rgba(249, 115, 22, 0.1)' }}>
            <p className="text-sm text-center">
              <span style={{ color: THEME.accent.primary }}>🔮 AI bashorat:</span>{' '}
              <span style={{ color: THEME.text.primary }}>Hozirgi tezlikda taxminan 3 haftada maqsadga yetasiz</span>
            </p>
          </div>
        </GlassCard>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 rounded-2xl font-semibold"
          style={{ background: THEME.gradient.primary, color: '#000' }}
        >
          + Yangi maqsad qo'shish
        </motion.button>
      </div>
    </motion.div>
  );

  // ============================================
  // AI INSIGHTS MODAL
  // ============================================
  const InsightsModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ background: 'linear-gradient(180deg, #1a0a00 0%, #0F0F14 100%)' }}
    >
      <div className="p-5 pb-24">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold" style={{ color: THEME.text.primary }}>🤖 AI Tavsiyalar</h1>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowInsightsModal(false)}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.1)' }}
          >
            ✕
          </motion.button>
        </div>

        <div className="space-y-3">
          {state.aiInsights.map((insight, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-5 rounded-2xl border"
              style={{ 
                background: insight.type === 'success' ? 'rgba(34, 197, 94, 0.1)' :
                           insight.type === 'warning' ? 'rgba(251, 191, 36, 0.1)' :
                           insight.type === 'tip' ? 'rgba(56, 189, 248, 0.1)' :
                           'rgba(249, 115, 22, 0.1)',
                borderColor: insight.type === 'success' ? 'rgba(34, 197, 94, 0.2)' :
                            insight.type === 'warning' ? 'rgba(251, 191, 36, 0.2)' :
                            insight.type === 'tip' ? 'rgba(56, 189, 248, 0.2)' :
                            'rgba(249, 115, 22, 0.2)',
              }}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{insight.icon}</span>
                <div>
                  <h4 className="font-bold mb-1" style={{ color: THEME.text.primary }}>{insight.title}</h4>
                  <p className="text-sm" style={{ color: THEME.text.secondary }}>{insight.message}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  // ============================================
  // BOTTOM NAVIGATION
  // ============================================
  const BottomNav = () => (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-40"
      style={{ background: 'linear-gradient(to top, rgba(15,15,20,1) 0%, rgba(15,15,20,0.95) 100%)' }}
    >
      <div className="flex items-center justify-around py-3 px-4">
        {[
          { icon: '🏠', label: 'Bosh sahifa', tab: 'home' },
          { icon: '📊', label: 'Statistika', action: () => setShowAnalyticsScreen(true) },
          { icon: '➕', label: 'Qo\'shish', isAdd: true },
          { icon: '📁', label: 'Kategoriya', action: () => setShowCategoriesScreen(true) },
          { icon: '⚙️', label: 'Sozlamalar', tab: 'settings' },
        ].map((item, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (item.isAdd) setShowAddModal(true);
              else if (item.action) item.action();
              else if (item.tab) setActiveTab(item.tab);
            }}
            className={`flex flex-col items-center gap-1 ${item.isAdd ? '' : 'p-2'}`}
          >
            {item.isAdd ? (
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center -mt-6 shadow-lg"
                style={{ 
                  background: THEME.gradient.primary,
                  boxShadow: '0 8px 24px rgba(249, 115, 22, 0.4)'
                }}
              >
                <span className="text-2xl">➕</span>
              </div>
            ) : (
              <>
                <span className="text-xl">{item.icon}</span>
                <span 
                  className="text-xs"
                  style={{ color: activeTab === item.tab ? THEME.accent.primary : THEME.text.muted }}
                >
                  {item.label}
                </span>
              </>
            )}
          </motion.button>
        ))}
      </div>
    </nav>
  );

  // ============================================
  // FIXED ADD BUTTON
  // ============================================
  const FixedAddButton = () => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setShowAddModal(true)}
      className="fixed bottom-20 left-4 right-4 py-4 rounded-2xl font-semibold text-lg z-30"
      style={{ 
        background: THEME.gradient.primary, 
        color: '#000',
        boxShadow: '0 8px 32px rgba(249, 115, 22, 0.4)'
      }}
    >
      Tranzaksiya qo'shish
    </motion.button>
  );

  // ============================================
  // RENDER
  // ============================================
  return (
    <div 
      className="min-h-screen font-sans"
      style={{ 
        background: THEME.bg.primary,
        color: THEME.text.primary,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        ::-webkit-scrollbar { display: none; }
        * { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <HomeScreen />
      <FixedAddButton />
      <BottomNav />

      <AnimatePresence>
        {showAddModal && <AddTransactionModal />}
        {showInsightsModal && <InsightsModal />}
        {showCategoriesScreen && <CategoriesScreen />}
        {showLimitsScreen && <LimitsScreen />}
        {showTransactionsScreen && <TransactionsScreen />}
        {showAnalyticsScreen && <AnalyticsScreen />}
        {showDebtsScreen && <DebtsScreen />}
        {showGoalsScreen && <GoalsScreen />}
      </AnimatePresence>
    </div>
  );
}
