<template>
  <div class="min-h-screen bg-[#F5F6F8] text-[#1F2025]">
    <!-- Navigation Bar -->
    <nav class="flex items-center justify-between px-6 py-8 bg-[#2C2F3A] shadow-md relative">
      <NuxtLink to="/" class="text-2xl font-semibold tracking-wide text-white hover:underline transition">sitemapAI</NuxtLink>
      <div class="flex space-x-6">
        <NuxtLink to="/dashboard" class="px-4 py-2 rounded font-medium text-white hover:bg-[#3A3E4D] transition">Dashboard</NuxtLink>
        <NuxtLink to="/sites" class="px-4 py-2 rounded font-medium text-white hover:bg-[#3A3E4D] transition">Sites</NuxtLink>
        <NuxtLink to="/allocations" class="px-4 py-2 rounded font-medium text-white hover:bg-[#3A3E4D] transition">Allocations</NuxtLink>
      </div>
    </nav>

    <!-- Summary Cards -->
    <div class="max-w-6xl mx-auto p-8 grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-xl shadow p-6 text-center">
        <div class="text-gray-500 text-sm mb-2">Total Clients</div>
        <div class="text-3xl font-bold text-[#2C2F3A]">{{ stats.totalClients }}</div>
      </div>
      <div class="bg-white rounded-xl shadow p-6 text-center">
        <div class="text-gray-500 text-sm mb-2">Total Sites</div>
        <div class="text-3xl font-bold text-[#2C2F3A]">{{ stats.totalSites }}</div>
      </div>
      <div class="bg-white rounded-xl shadow p-6 text-center">
        <div class="text-gray-500 text-sm mb-2">Total Allocations</div>
        <div class="text-3xl font-bold text-[#2C2F3A]">{{ stats.totalAllocations }}</div>
      </div>
      <div class="bg-white rounded-xl shadow p-6 text-center">
        <div class="text-gray-500 text-sm mb-2">Pending Actions</div>
        <div class="text-3xl font-bold text-[#2C2F3A]">{{ stats.pending }}</div>
      </div>
    </div>

    <!-- EChart Bar -->
    <div class="max-w-6xl mx-auto px-8 mb-8">
      <div class="bg-white rounded-xl shadow p-6">
        <div class="font-semibold text-lg mb-4 text-[#2C2F3A]">Clients by Suburb</div>
        <EChartBar />
      </div>
    </div>

    <!-- Recent Activity 
    <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-8">
      <div class="md:col-span-2"></div>
      <div class="bg-white rounded-xl shadow p-6">
        <div class="font-semibold text-lg mb-4 text-[#2C2F3A]">Recent Changes</div>
        <ul>
          <li
            v-for="item in recentChanges"
            :key="item.id"
            class="border-b border-gray-100 last:border-0 py-2"
          >
            <span class="font-semibold">{{ item.client }}</span>
            <span class="text-gray-500">({{ item.action }})</span>
            <span class="text-gray-400 text-xs ml-2">{{ item.time }}</span>
          </li>
        </ul>
      </div>
    </div>
    -->
  </div>
</template>

<script setup>
import { ref } from 'vue'
import EChartBar from '~/components/EChartBar.vue'

const stats = ref({
  totalClients: 17,
  totalSites: 32,
  totalAllocations: 10,
  pending: 3,
})

const recentChanges = [
  { id: 1, client: 'Acme Corp', action: 'Added', time: '2 hours ago' },
  { id: 2, client: 'Beta Pty Ltd', action: 'Edited', time: '5 hours ago' },
  { id: 3, client: 'Gamma Solutions', action: 'Deleted', time: '1 day ago' },
]
</script>






