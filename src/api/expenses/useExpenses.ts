import { useState, useCallback } from 'react';
import { expensesApi } from './expenses.api';
import type { Expense, ExpenseInput, Balances, SettlementInput } from './expenses.types';
import { ApiError } from '../core/apiError';

export function useExpenses(tripId: string) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [balances, setBalances] = useState<Balances | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchAll = useCallback(async () => {
    if (!tripId) return;
    setLoading(true);
    setError(null);
    try {
      const [expRes, balRes] = await Promise.all([
        expensesApi.getExpenses(tripId),
        expensesApi.getBalances(tripId).catch(() => null),
      ]);
      setExpenses(expRes.items || []);
      if (balRes) setBalances(balRes);
    } catch (err) {
      const apiErr = err instanceof ApiError ? err : new ApiError({ message: 'Không thể tải chi phí' });
      setError(apiErr);
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  const addExpense = useCallback(
    async (payload: ExpenseInput) => {
      setLoading(true);
      setError(null);
      try {
        const created = await expensesApi.createExpense(tripId, payload);
        setExpenses((prev) => [created, ...prev]);
        expensesApi.getBalances(tripId).then(setBalances).catch(() => {});
        return created;
      } catch (err) {
        const apiErr = err instanceof ApiError ? err : new ApiError({ message: 'Thêm chi phí thất bại' });
        setError(apiErr);
        throw apiErr;
      } finally {
        setLoading(false);
      }
    },
    [tripId]
  );

  const deleteExpense = useCallback(
    async (expenseId: string) => {
      setLoading(true);
      setError(null);
      try {
        await expensesApi.deleteExpense(tripId, expenseId);
        setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
        expensesApi.getBalances(tripId).then(setBalances).catch(() => {});
      } catch (err) {
        const apiErr = err instanceof ApiError ? err : new ApiError({ message: 'Xóa chi phí thất bại' });
        setError(apiErr);
        throw apiErr;
      } finally {
        setLoading(false);
      }
    },
    [tripId]
  );

  const settleDebt = useCallback(
    async (payload: SettlementInput) => {
      setLoading(true);
      setError(null);
      try {
        const res = await expensesApi.createSettlement(tripId, payload);
        expensesApi.getBalances(tripId).then(setBalances).catch(() => {});
        return res;
      } catch (err) {
        const apiErr = err instanceof ApiError ? err : new ApiError({ message: 'Quyết toán nợ thất bại' });
        setError(apiErr);
        throw apiErr;
      } finally {
        setLoading(false);
      }
    },
    [tripId]
  );

  return {
    expenses,
    balances,
    loading,
    error,
    fetchAll,
    addExpense,
    deleteExpense,
    settleDebt,
    setExpenses,
  };
}
