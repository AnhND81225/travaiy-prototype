/**
 * Types cho Quản lý chi tiêu & Chia tiền khớp OpenAPI TravAIy Backend
 */

export interface Share {
  userId: string;
  amountVnd: number;
}

export interface ExpenseInput {
  title: string;
  amountVnd: number;
  payerId?: string;
  audience?: 'ALL' | 'MEMBERS' | string;
  splitMethod?: 'EQUAL' | 'EXACT' | 'PERCENTAGE' | string;
  participants?: string[];
  shares?: Share[];
}

export interface Expense {
  id: string;
  createdBy?: string;
  payerId?: string;
  audience?: string;
  title: string;
  amountVnd: number;
  version: number;
  deleted?: boolean;
  shares?: Share[];
  createdAt?: string;
}

export interface Balance {
  userId: string;
  netVnd: number;
}

export interface SuggestedTransfer {
  fromUserId: string;
  toUserId: string;
  amountVnd: number;
}

export interface Balances {
  totalSharedVnd: number;
  balances: Balance[];
  suggestedTransfers: SuggestedTransfer[];
}

export interface SettlementInput {
  fromUserId: string;
  toUserId: string;
  amountVnd: number;
}

export interface Settlement {
  id: string;
  createdBy?: string;
  fromUserId: string;
  toUserId: string;
  amountVnd: number;
  version: number;
  deleted?: boolean;
  createdAt?: string;
}
