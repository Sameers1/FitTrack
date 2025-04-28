'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type User = {
  name: string
  email: string
  goals: {
    steps: number
    water: number
    calories: number
  }
  stats: {
    steps: number
    water: number
    calories: number
  }
}

type UserContextType = {
  user: User
  updateUser: (data: Partial<User>) => void
  updateStats: (type: 'steps' | 'water' | 'calories', value: number) => void
}

const defaultUser: User = {
  name: 'John',
  email: 'john@example.com',
  goals: {
    steps: 10000,
    water: 8,
    calories: 2000,
  },
  stats: {
    steps: 8432,
    water: 5,
    calories: 1500,
  },
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(defaultUser)

  const updateUser = (data: Partial<User>) => {
    setUser(prev => ({ ...prev, ...data }))
  }

  const updateStats = (type: 'steps' | 'water' | 'calories', value: number) => {
    setUser(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [type]: value,
      },
    }))
  }

  return (
    <UserContext.Provider value={{ user, updateUser, updateStats }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
} 