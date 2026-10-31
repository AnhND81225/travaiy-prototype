/**
 * Travaiy API Module (Feature-Based Architecture)
 * -------------------------------------------------------------
 * Bạn có thể import theo từng Feature:
 *   import { authApi, useAuth } from '@/src/api/auth';
 *   import { tripsApi, useTrips } from '@/src/api/trips';
 *
 * Hoặc import tập trung từ index:
 *   import { authApi, tripsApi, httpClient, useApi } from '@/src/api';
 */

// 1. Core Infrastructure
export * from './core';

// 2. Feature: Auth
export * from './auth';

// 3. Feature: Trips
export * from './trips';

// 4. Feature: Places
export * from './places';

// 5. Feature: Stays
export * from './stays';

// 6. Feature: Expenses
export * from './expenses';

// 7. Feature: Media
export * from './media';
