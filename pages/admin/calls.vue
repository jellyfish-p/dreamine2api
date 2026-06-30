<template>
  <div class="space-y-4">
    <h1 class="text-xl font-semibold">API 调用记录</h1>
    <p class="text-sm text-gray-500">存储于 SQLite 表 <code>api_calls</code></p>
    <UTable :data="rows" :columns="columns" />
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";

definePageMeta({ layout: "admin", middleware: "admin-auth" });

type CallRow = {
  id: number;
  path: string;
  method: string;
  model: string | null;
  status_code: number | null;
  duration_ms: number | null;
  error: string | null;
  created_at: number;
};

const { adminFetch } = useAdminToken();
const { data } = await useAsyncData("admin-calls", () =>
  adminFetch<{ data: CallRow[] }>("/api/admin/calls?limit=100"),
);

const rows = computed(() => data.value?.data ?? []);

const columns: TableColumn<CallRow>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "created_at", header: "时间", cell: ({ row }) => formatTs(row.original.created_at) },
  { accessorKey: "method", header: "方法" },
  { accessorKey: "path", header: "路径" },
  { accessorKey: "status_code", header: "状态" },
  { accessorKey: "duration_ms", header: "耗时(ms)" },
  { accessorKey: "error", header: "错误" },
];

function formatTs(ts: number) {
  return new Date(ts * 1000).toLocaleString();
}
</script>