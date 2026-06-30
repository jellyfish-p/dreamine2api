<template>
  <div class="min-h-screen flex flex-col items-center justify-center gap-4 text-gray-200 p-6">
    <h1 class="text-2xl font-bold">{{ appName }}</h1>
    <p class="text-gray-500 text-center max-w-md">
      OpenAI 兼容图像/视频 API。管理面板可编辑 <code class="text-primary-400">config.toml</code> 与 SQLite 账号/调用数据。
    </p>
    <div class="flex gap-3">
      <UButton to="/admin" color="primary">管理面板</UButton>
      <UButton to="/admin/login" variant="outline" color="neutral">登录</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const appName = useRuntimeConfig().public.appName;
</script>