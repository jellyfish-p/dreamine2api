<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-xl font-semibold">账号池</h1>
      <div class="flex gap-2">
        <UButton variant="outline" :loading="refreshing" @click="refreshAll">刷新全部额度</UButton>
        <UButton variant="outline" @click="showLogin = true">邮箱登录</UButton>
        <UButton @click="showAdd = true">添加账号</UButton>
      </div>
    </div>
    <UTable :data="rows" :columns="columns">
      <template #enabled-cell="{ row }">
        <UBadge :color="row.original.enabled ? 'success' : 'neutral'" variant="subtle">
          {{ row.original.enabled ? "启用" : "禁用" }}
        </UBadge>
      </template>
      <template #account_type-cell="{ row }">
        <span v-if="row.original.account_type" class="text-xs">{{ row.original.account_type }}</span>
        <span v-else class="text-xs text-muted">—</span>
      </template>
      <template #vip_level-cell="{ row }">
        <UBadge v-if="row.original.vip_level" color="warning" variant="subtle" class="text-xs">
          {{ row.original.vip_level }}
        </UBadge>
        <span v-else class="text-xs text-muted">—</span>
      </template>
      <template #vip_expire_at-cell="{ row }">
        <span v-if="row.original.vip_expire_at" class="text-xs">{{ row.original.vip_expire_at }}</span>
        <span v-else class="text-xs text-muted">—</span>
      </template>
      <template #actions-cell="{ row }">
        <div class="flex flex-wrap gap-1">
          <UButton
            size="xs"
            icon="i-lucide-info"
            variant="outline"
            @click="openDetails(row.original)"
          >详情</UButton>
          <UButton
            size="xs"
            variant="outline"
            :loading="loadingId === row.original.id && loadingAction === 'credit'"
            @click="refreshCredit(row.original)"
          >刷新额度</UButton>
          <UButton
            size="xs"
            variant="outline"
            :loading="loadingId === row.original.id && loadingAction === 'info'"
            @click="fetchInfo(row.original)"
          >获取类型</UButton>
          <UButton
            size="xs"
            variant="outline"
            :disabled="!row.original.has_password"
            :loading="loadingId === row.original.id && loadingAction === 'session'"
            @click="refreshSession(row.original)"
          >刷新Session</UButton>
          <UButton
            size="xs"
            color="error"
            variant="ghost"
            @click="removeAccount(row.original)"
          >删除</UButton>
        </div>
      </template>
    </UTable>
    <UModal v-model:open="showAdd">
      <template #content>
        <UCard>
          <template #header>添加 Dreamina Session</template>
          <form class="space-y-3" @submit.prevent="add">
            <UInput v-model="newSession" placeholder="session_id" />
            <UInput v-model="newLabel" placeholder="备注 label" />
            <UInput v-model="newProxy" placeholder="代理 proxy_url（可选）" />
            <UButton type="submit" block :loading="adding">添加</UButton>
          </form>
        </UCard>
      </template>
    </UModal>
    <UModal v-model:open="showLogin">
      <template #content>
        <UCard>
          <template #header>邮箱密码自动登录</template>
          <form class="space-y-3" @submit.prevent="loginAdd">
            <UInput v-model="loginEmail" type="email" placeholder="邮箱 email" />
            <UInput v-model="loginPassword" type="password" placeholder="密码 password" />
            <UInput v-model="loginLabel" placeholder="备注 label（可选）" />
            <UInput v-model="loginProxy" placeholder="代理 proxy_url（可选）" />
            <div v-if="loginError" class="text-sm text-red-500">{{ loginError }}</div>
            <div v-if="loginSuccessMsg" class="text-sm text-green-500">{{ loginSuccessMsg }}</div>
            <UButton type="submit" block :loading="logining">登录并添加</UButton>
          </form>
        </UCard>
      </template>
    </UModal>
    <UModal v-model:open="showDetails">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between gap-3">
              <div>
                <div class="text-base font-semibold">账号详情</div>
                <div class="text-xs text-muted">{{ detailAccount?.label || detailAccount?.session_mask }}</div>
              </div>
              <UBadge :color="detailAccount?.enabled ? 'success' : 'neutral'" variant="subtle">
                {{ detailAccount?.enabled ? "启用" : "禁用" }}
              </UBadge>
            </div>
          </template>

          <div v-if="detailAccount" class="space-y-5">
            <section class="space-y-2">
              <h2 class="text-sm font-medium">基础信息</h2>
              <div class="grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <div class="text-xs text-muted">ID</div>
                  <div>{{ detailAccount.id }}</div>
                </div>
                <div>
                  <div class="text-xs text-muted">Session</div>
                  <div>{{ detailAccount.session_mask }}</div>
                </div>
                <div>
                  <div class="text-xs text-muted">用户</div>
                  <div class="break-all">{{ detailAccount.user_name || detailAccount.user_id || "—" }}</div>
                </div>
                <div>
                  <div class="text-xs text-muted">地区</div>
                  <div>{{ detailAccount.store_country || "—" }}</div>
                </div>
              </div>
            </section>

            <section class="space-y-2">
              <h2 class="text-sm font-medium">账户状态</h2>
              <div class="grid gap-2 text-sm sm:grid-cols-2">
                <div>
                  <div class="text-xs text-muted">类型</div>
                  <div>{{ detailAccount.account_type || "未知" }}</div>
                </div>
                <div>
                  <div class="text-xs text-muted">会员</div>
                  <div>{{ detailAccount.vip_level || "—" }}</div>
                </div>
                <div>
                  <div class="text-xs text-muted">到期</div>
                  <div>{{ detailAccount.vip_expire_at || "—" }}</div>
                </div>
                <div>
                  <div class="text-xs text-muted">最近检查</div>
                  <div>{{ formatTime(detailAccount.last_check_at) }}</div>
                </div>
              </div>
            </section>

            <section class="space-y-2">
              <h2 class="text-sm font-medium">额度</h2>
              <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <div class="rounded-md border border-default p-3">
                  <div class="text-xs text-muted">总额度</div>
                  <div class="text-lg font-semibold">{{ formatNumber(detailAccount.last_total_credit) }}</div>
                </div>
                <div class="rounded-md border border-default p-3">
                  <div class="text-xs text-muted">赠送</div>
                  <div class="text-lg font-semibold">{{ formatNumber(detailAccount.last_gift_credit) }}</div>
                </div>
                <div class="rounded-md border border-default p-3">
                  <div class="text-xs text-muted">VIP</div>
                  <div class="text-lg font-semibold">{{ formatNumber(detailAccount.last_vip_credit) }}</div>
                </div>
                <div class="rounded-md border border-default p-3">
                  <div class="text-xs text-muted">购买</div>
                  <div class="text-lg font-semibold">{{ formatNumber(detailAccount.last_purchase_credit) }}</div>
                </div>
              </div>
            </section>

            <section v-if="detailAccount.last_error" class="space-y-2">
              <h2 class="text-sm font-medium text-red-500">错误</h2>
              <p class="break-all text-sm text-red-500">{{ detailAccount.last_error }}</p>
            </section>
          </div>
        </UCard>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";

definePageMeta({ layout: "admin", middleware: "admin-auth" });

type Account = {
  id: number;
  session_mask: string;
  label: string;
  enabled: boolean;
  proxy_url: string | null;
  last_total_credit: number | null;
  last_gift_credit: number | null;
  last_vip_credit: number | null;
  last_purchase_credit: number | null;
  last_check_at: number | null;
  last_success_at: number | null;
  fail_count: number;
  last_error: string | null;
  email: string | null;
  user_id: string | null;
  user_name: string | null;
  store_country: string | null;
  account_type: string | null;
  vip_level: string | null;
  vip_expire_at: string | null;
  has_password: boolean;
  created_at: number;
  updated_at: number;
};

const { adminFetch } = useAdminToken();
const rows = ref<Account[]>([]);

async function loadAccounts() {
  const res = await adminFetch<{ data: Account[] }>("/api/admin/accounts");
  rows.value = res?.data ?? [];
}
await loadAccounts();

const columns: TableColumn<Account>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "session_mask", header: "Session" },
  { accessorKey: "label", header: "备注" },
  { accessorKey: "enabled", header: "启用" },
  { accessorKey: "last_total_credit", header: "积分" },
  { accessorKey: "account_type", header: "类型" },
  { accessorKey: "vip_level", header: "会员" },
  { accessorKey: "vip_expire_at", header: "到期" },
  { accessorKey: "fail_count", header: "失败" },
  { id: "actions", header: "操作" },
];

const showAdd = ref(false);
const newSession = ref("");
const newLabel = ref("");
const newProxy = ref("");
const adding = ref(false);
const refreshing = ref(false);

const showLogin = ref(false);
const loginEmail = ref("");
const loginPassword = ref("");
const loginLabel = ref("");
const loginProxy = ref("");
const logining = ref(false);
const loginError = ref("");
const loginSuccessMsg = ref("");

const loadingId = ref<number | null>(null);
const loadingAction = ref<string>("");
const showDetails = ref(false);
const detailAccount = ref<Account | null>(null);

const toast = useToast();

function openDetails(row: Account) {
  detailAccount.value = row;
  showDetails.value = true;
}

function formatNumber(value: number | null) {
  return value == null ? "—" : value.toLocaleString();
}

function formatTime(value: number | null) {
  if (!value) return "—";
  return new Date(value * 1000).toLocaleString();
}

async function add() {
  adding.value = true;
  try {
    await adminFetch("/api/admin/accounts", {
      method: "POST",
      body: {
        session_id: newSession.value,
        label: newLabel.value,
        proxy_url: newProxy.value || undefined,
      },
    });
    showAdd.value = false;
    newSession.value = "";
    newLabel.value = "";
    newProxy.value = "";
    await loadAccounts();
  } finally {
    adding.value = false;
  }
}

async function loginAdd() {
  loginError.value = "";
  loginSuccessMsg.value = "";
  if (!loginEmail.value.trim() || !loginPassword.value) {
    loginError.value = "请填写邮箱和密码";
    return;
  }
  logining.value = true;
  try {
    const res = await adminFetch<{ action: string; user_id?: string }>(
      "/api/admin/accounts/login",
      {
        method: "POST",
        body: {
          email: loginEmail.value,
          password: loginPassword.value,
          label: loginLabel.value || undefined,
          proxy_url: loginProxy.value || undefined,
        },
      },
    );
    loginSuccessMsg.value = `登录成功（${res.action === "updated" ? "已更新" : "已添加"}）${
      res.user_id ? `，user_id: ${res.user_id}` : ""
    }`;
    loginEmail.value = "";
    loginPassword.value = "";
    loginLabel.value = "";
    loginProxy.value = "";
    await loadAccounts();
  } catch (e: any) {
    loginError.value = e?.data?.message || e?.message || "登录失败";
  } finally {
    logining.value = false;
  }
}

async function refreshAll() {
  refreshing.value = true;
  try {
    await adminFetch("/api/admin/accounts/refresh", { method: "POST", body: {} });
    await loadAccounts();
  } finally {
    refreshing.value = false;
  }
}

async function refreshCredit(row: Account) {
  loadingId.value = row.id;
  loadingAction.value = "credit";
  try {
    await adminFetch("/api/admin/accounts/refresh", { method: "POST", body: { id: row.id } });
    toast.add({ title: "额度刷新成功", color: "success" });
    await loadAccounts();
  } catch (e: any) {
    toast.add({ title: "额度刷新失败", description: e?.data?.message || e?.message, color: "error" });
  } finally {
    loadingId.value = null;
    loadingAction.value = "";
  }
}

async function fetchInfo(row: Account) {
  loadingId.value = row.id;
  loadingAction.value = "info";
  try {
    const res = await adminFetch<{
      account_type: string;
      user_name: string;
      store_country: string;
      vip_level: string | null;
      vip_expire_at: string | null;
    }>(`/api/admin/accounts/${row.id}/info`, { method: "POST" });
    const accountType = res.account_type || "未知";
    toast.add({
      title: "获取账户信息成功",
      description: `类型: ${accountType}${res.vip_level ? `，会员: ${res.vip_level}` : ""}${res.vip_expire_at ? `，到期: ${res.vip_expire_at}` : ""}`,
      color: "success",
    });
    await loadAccounts();
  } catch (e: any) {
    toast.add({ title: "获取账户信息失败", description: e?.data?.message || e?.message, color: "error" });
  } finally {
    loadingId.value = null;
    loadingAction.value = "";
  }
}

async function refreshSession(row: Account) {
  loadingId.value = row.id;
  loadingAction.value = "session";
  try {
    await adminFetch(`/api/admin/accounts/${row.id}/refresh-session`, { method: "POST" });
    toast.add({ title: "Session 刷新成功", color: "success" });
    await loadAccounts();
  } catch (e: any) {
    toast.add({ title: "Session 刷新失败", description: e?.data?.message || e?.message, color: "error" });
  } finally {
    loadingId.value = null;
    loadingAction.value = "";
  }
}

async function removeAccount(row: Account) {
  loadingId.value = row.id;
  loadingAction.value = "delete";
  try {
    await adminFetch(`/api/admin/accounts/${row.id}`, { method: "DELETE" });
    toast.add({ title: "账号已删除", color: "success" });
    await loadAccounts();
  } catch (e: any) {
    toast.add({ title: "删除失败", description: e?.data?.message || e?.message, color: "error" });
  } finally {
    loadingId.value = null;
    loadingAction.value = "";
  }
}
</script>
