import { httpClient } from '../core/httpClient';
import type {
  Expense,
  ExpenseInput,
  Balances,
  Settlement,
  SettlementInput,
} from './expenses.types';

export const expensesApi = {
  /**
   * GET /api/v1/trips/{tripId}/expenses
   * Lấy danh sách chi phí trong chuyến đi
   */
  getExpenses(tripId: string, page = 0, size = 50): Promise<{ items: Expense[]; total: number }> {
    return httpClient.get(`/trips/${tripId}/expenses`, { page, size });
  },

  /**
   * POST /api/v1/trips/{tripId}/expenses
   * Tạo khoản chi mới
   */
  createExpense(tripId: string, payload: ExpenseInput): Promise<Expense> {
    return httpClient.post<Expense>(`/trips/${tripId}/expenses`, payload);
  },

  /**
   * DELETE /api/v1/trips/{tripId}/expenses/{expenseId}
   * Xóa khoản chi
   */
  deleteExpense(tripId: string, expenseId: string): Promise<void> {
    return httpClient.delete<void>(`/trips/${tripId}/expenses/${expenseId}`);
  },

  /**
   * GET /api/v1/trips/{tripId}/expense-balances
   * Lấy bảng tính số dư nợ và đề xuất chuyển tiền giữa các thành viên
   */
  getBalances(tripId: string): Promise<Balances> {
    return httpClient.get<Balances>(`/trips/${tripId}/expense-balances`);
  },

  /**
   * POST /api/v1/trips/{tripId}/settlements
   * Ghi nhận thanh toán / quyết toán tiền giữa 2 người
   */
  createSettlement(tripId: string, payload: SettlementInput): Promise<Settlement> {
    return httpClient.post<Settlement>(`/trips/${tripId}/settlements`, payload);
  },
};
