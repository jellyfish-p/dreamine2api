# Account Credit Details Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show cached account credit breakdown in the admin account list modal and refresh credits/account type automatically when importing accounts.

**Architecture:** Persist `last_vip_credit` and `last_purchase_credit` alongside existing total/gift credit fields. Keep external Dreamina calls in `server/services/pool/accounts.ts`, expose cached values through existing admin account list responses, and render a detail modal from the already loaded row data.

**Tech Stack:** Nuxt 4, Nitro server routes, SQLite via `better-sqlite3`, Vue `<script setup>`, Node test runner.

---

### Task 1: Backend Credit Split Persistence

**Files:**
- Modify: `server/repositories/sqlite/schema.ts`
- Modify: `server/services/pool/accounts.ts`
- Test: `tests/account-credit-details.test.mjs`

- [ ] Write a failing test that asserts schema migration includes `last_vip_credit` and `last_purchase_credit`, `refreshAccountCredit` writes those fields, and `toPublicAccount` returns them.
- [ ] Run `node --test tests/account-credit-details.test.mjs` and verify it fails because the fields are absent.
- [ ] Add the two SQLite columns and TypeScript row fields.
- [ ] Update `refreshAccountCredit()` to persist `points.vipCredit` and `points.purchaseCredit`.
- [ ] Update `toPublicAccount()` to expose both fields.
- [ ] Re-run `node --test tests/account-credit-details.test.mjs` and verify it passes.

### Task 2: Import Auto Refresh

**Files:**
- Modify: `server/services/pool/accounts.ts`
- Modify: `server/api/admin/accounts.post.ts`
- Modify: `server/api/admin/accounts/login.post.ts`
- Test: `tests/account-import-refresh.test.mjs`

- [ ] Write a failing test that checks manual import and email login import call an account enrichment helper after adding/updating accounts.
- [ ] Run `node --test tests/account-import-refresh.test.mjs` and verify it fails.
- [ ] Add `refreshAccountSnapshot(id)` that calls `refreshAccountCredit(id)` and `fetchAccountInfo(id)` independently, returning non-fatal `credit_error` and `info_error` strings.
- [ ] Make `addAccount()` return the inserted row id.
- [ ] Call `refreshAccountSnapshot()` from session import and email login import/update paths.
- [ ] Re-run `node --test tests/account-import-refresh.test.mjs` and verify it passes.

### Task 3: Admin Detail Modal

**Files:**
- Modify: `app/pages/admin/accounts.vue`

- [ ] Add `last_vip_credit`, `last_purchase_credit`, and timestamp fields to the `Account` type.
- [ ] Add a `详情` action button that opens a modal for the selected row.
- [ ] Render cached basic account fields, account type/VIP fields, and credit breakdown: total, gift, VIP, purchase.
- [ ] Keep layout compact and consistent with the existing Nuxt UI table/actions.
- [ ] Run `npm run type-check` and fix any Vue/TypeScript issues.

### Task 4: Full Verification

**Files:**
- Existing test suite and type checker.

- [ ] Run `npm test`.
- [ ] Run `npm run type-check`.
- [ ] Report exact verification results and any residual git status caveat.
