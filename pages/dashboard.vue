<template>
  <div class="min-h-screen bg-[#F5F6F8] text-[#1F2025]">
    <!-- Navigation Bar -->
    <nav class="flex items-center justify-between px-6 py-8 bg-[#2C2F3A] shadow-md relative">
      <NuxtLink to="/" class="text-2xl font-semibold tracking-wide text-white hover:underline transition">sitemapAI</NuxtLink>
      <div class="flex space-x-6">
        <NuxtLink to="/dashboard" class="px-4 py-2 rounded font-medium text-white hover:bg-[#3A3E4D] transition">Dashboard</NuxtLink>
        <NuxtLink to="/sites" class="px-4 py-2 rounded font-medium text-white hover:bg-[#3A3E4D] transition">Sites</NuxtLink>
      </div>
    </nav>

    <!-- Summary Cards -->
    <div class="max-w-4xl mx-auto p-8 flex flex-col md:flex-row justify-center items-stretch gap-6">
  <div class="flex-1 bg-white rounded-xl shadow p-6 text-center">
    <div class="text-gray-500 text-sm mb-2">Total Clients</div>
    <div class="text-3xl font-bold text-[#2C2F3A]">
      {{ stats?.totalClients ?? '-' }}
    </div>
  </div>
  <div class="flex-1 bg-white rounded-xl shadow p-6 text-center">
    <div class="text-gray-500 text-sm mb-2">Total Sites</div>
    <div class="text-3xl font-bold text-[#2C2F3A]">
      {{ stats?.totalSites ?? '-' }}
    </div>
  </div>
  <div class="flex-1 bg-white rounded-xl shadow p-6 text-center">
    <div class="text-gray-500 text-sm mb-2">Total Allocations</div>
    <div class="text-3xl font-bold text-[#2C2F3A]">
      {{ stats?.totalAllocations ?? '-' }}
    </div>
  </div>



      
<!--


      <div class="bg-white rounded-xl shadow p-6 text-center">
        <div class="text-gray-500 text-sm mb-2">Pending Actions</div>
        <div class="text-3xl font-bold text-[#2C2F3A]">
          {{ stats?.pending ?? '-' }}
        </div>
      </div>

-->     


    </div>

    <!-- EChart Bar -->
    <div class="max-w-6xl mx-auto px-8 mb-8">
      <div class="bg-white rounded-xl shadow p-6">
        
        <EChartLine />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAsyncData } from '#app'
import EChartLine from '~/components/EChartLine.vue'

import EChartBar from '~/components/EChartBar.vue'

const { data: stats } = await useAsyncData('dashboardStats', () =>
  $fetch('/api/dashboardStats')
)
</script>







