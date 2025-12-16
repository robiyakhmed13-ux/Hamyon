import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Get user by Telegram ID
export async function getUser(telegramId) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('telegram_id', telegramId)
    .single()
  
  if (error) return null
  return data
}

// Get user transactions
export async function getTransactions(telegramId, limit = 50) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_telegram_id', telegramId)
    .order('created_at', { ascending: false })
    .limit(limit)
  
  if (error) return []
  return data
}

// Get user limits
export async function getLimits(telegramId) {
  const { data, error } = await supabase
    .from('limits')
    .select('*')
    .eq('user_telegram_id', telegramId)
  
  if (error) return []
  return data
}

// Get user goals
export async function getGoals(telegramId) {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_telegram_id', telegramId)
  
  if (error) return []
  return data
}

// Get user debts
export async function getDebts(telegramId) {
  const { data, error } = await supabase
    .from('debts')
    .select('*')
    .eq('user_telegram_id', telegramId)
    .eq('is_settled', false)
  
  if (error) return []
  return data
}

// Subscribe to realtime updates
export function subscribeToTransactions(telegramId, callback) {
  const channel = supabase
    .channel('transactions-changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'transactions',
        filter: `user_telegram_id=eq.${telegramId}`
      },
      (payload) => {
        callback(payload.new)
      }
    )
    .subscribe()
  
  return () => {
    supabase.removeChannel(channel)
  }
}

// Subscribe to user balance updates
export function subscribeToUser(telegramId, callback) {
  const channel = supabase
    .channel('user-changes')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'users',
        filter: `telegram_id=eq.${telegramId}`
      },
      (payload) => {
        callback(payload.new)
      }
    )
    .subscribe()
  
  return () => {
    supabase.removeChannel(channel)
  }
}
