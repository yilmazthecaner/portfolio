export interface User {
  id: string
  name: string
  email: string
  imageUrl: string
  budget: Budget
}

export interface Budget {
  totalBalance: number
  investments: number
  cash: number
  activePositions: number
}

export interface UserUpdateData {
  name?: string
  email?: string
  imageUrl?: string
}

