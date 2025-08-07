<template>
  <div class="min-h-screen bg-[#F5F6F8] text-[#1F2025]">
    <nav class="flex items-center justify-between px-6 py-8 bg-[#2C2F3A] shadow-md relative">
      <NuxtLink to="/" class="text-2xl font-semibold tracking-wide text-white hover:underline transition">sitemapAI</NuxtLink>
      <div class="flex space-x-6">
        <NuxtLink to="/dashboard" class="px-4 py-2 rounded font-medium text-white hover:bg-[#3A3E4D] transition">Dashboard</NuxtLink>
        <NuxtLink to="/sites" class="px-4 py-2 rounded font-medium text-white hover:bg-[#3A3E4D] transition">Sites</NuxtLink>
        <NuxtLink to="/allocations" class="px-4 py-2 rounded font-medium text-white hover:bg-[#3A3E4D] transition">Allocations</NuxtLink>
      </div>
    </nav>
    <div class="p-10 text-center">
      <h1 class="text-4xl font-bold text-[#1F2025]">Sites</h1>
      <p class="text-[#5A5A5A] mt-4">This is the sites page.</p>
    </div>
  </div>
</template>
