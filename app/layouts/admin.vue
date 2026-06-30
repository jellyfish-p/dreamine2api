<template>
  <div class="min-h-screen text-gray-100">
    <header class="border-b px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-6">
        <NuxtLink to="/admin" class="font-semibold text-primary-400">Dreamine 管理</NuxtLink>
        <nav class="flex gap-4 text-sm text-gray-400">
          <NuxtLink to="/admin/settings" active-class="text-white">配置</NuxtLink>
          <NuxtLink to="/admin/accounts" active-class="text-white">账号池</NuxtLink>
          <NuxtLink to="/admin/calls" active-class="text-white">调用记录</NuxtLink>
        </nav>
      </div>
      <UButton size="xs" color="neutral" variant="ghost" @click="logout">退出</UButton>
    </header>
    <main class="max-w-6xl mx-auto p-4 md:p-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const { clearToken } = useAdminToken();
async function logout() {
  clearToken();
  await navigateTo("/admin/login");
}
</script>