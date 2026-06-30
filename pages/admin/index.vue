<template>
  <div class="space-y-6">
    <h1 class="text-xl font-semibold">概览</h1>
    <div class="grid gap-4 md:grid-cols-3">
      <UCard>
        <p class="text-sm text-gray-500">近 24h 调用</p>
        <p class="text-2xl font-bold mt-1">{{ stats?.total ?? "—" }}</p>
      </UCard>
      <UCard>
        <p class="text-sm text-gray-500">近 24h 错误</p>
        <p class="text-2xl font-bold mt-1 text-red-400">{{ stats?.errors ?? "—" }}</p>
      </UCard>
      <UCard>
        <p class="text-sm text-gray-500">平均耗时 (ms)</p>
        <p class="text-2xl font-bold mt-1">{{ avgMs }}</p>
      </UCard>
    </div>
    <UCard>
      <template #header>配置文件</template>
      <p class="text-sm text-gray-400">
        关键项保存在项目根目录 <code>config.toml</code>。在「配置」页保存会写回该文件，并同步 SQLite 中的代理与号池密钥。
      </p>
    </UCard>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "admin", middleware: "admin-auth" });

const { adminFetch } = useAdminToken();
const { data } = await useAsyncData("admin-calls-stats", () =>
  adminFetch<{ stats: { total: number; errors: number; avg_ms: number | null } }>("/api/admin/calls?limit=1"),
);
const stats = computed(() => data.value?.stats);
const avgMs = computed(() => {
  const v = stats.value?.avg_ms;
  return v == null ? "—" : Math.round(v);
});
</script>