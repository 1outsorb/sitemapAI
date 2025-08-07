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

    <!-- Main Content -->
    <div class="max-w-6xl mx-auto p-8">
      <div class="flex justify-between items-center mb-6">
        <button class="bg-[#2C2F3A] text-white px-4 py-2 rounded hover:bg-[#3A3E4D] shadow transition">Upload File</button>
        <input
          v-model="search"
          type="text"
          placeholder="Search..."
          class="border border-gray-300 rounded px-4 py-2 outline-none focus:ring-2 focus:ring-[#2C2F3A]"
        />
      </div>
      <div class="overflow-x-auto rounded shadow bg-white">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-6 py-3 text-left font-semibold text-gray-700">Client Name</th>
              <th class="px-6 py-3 text-left font-semibold text-gray-700">Address</th>
              <th class="px-6 py-3 text-left font-semibold text-gray-700">Suburb</th>
              <th class="px-6 py-3 text-left font-semibold text-gray-700">Postcode</th>
              <th class="px-6 py-3 text-left font-semibold text-gray-700">State</th>
              <th class="px-6 py-3 text-left font-semibold text-gray-700">Number<br>of locations</th>
              <th class="px-6 py-3 text-left font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in filteredRows"
              :key="item.id"
              class="odd:bg-white even:bg-gray-50 hover:bg-gray-100"
            >
              <td class="px-6 py-4 whitespace-nowrap">{{ item.clientName }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ item.address }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ item.suburb }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ item.postcode }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ item.state }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ item.numLocations }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button class="text-[#2C2F3A] bg-gray-200 rounded px-3 py-1 hover:bg-gray-300 transition">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const search = ref('')

const rows = ref([
  {
    id: 1,
    clientName: 'Acme Corp',
    address: '123 Main St',
    suburb: 'Sydney',
    postcode: '2000',
    state: 'NSW',
    numLocations: 3,
  },
  {
    id: 2,
    clientName: 'Beta Pty Ltd',
    address: '456 George St',
    suburb: 'Parramatta',
    postcode: '2150',
    state: 'NSW',
    numLocations: 2,
  },
  {
    id: 3,
    clientName: 'Gamma Solutions',
    address: '789 Market Rd',
    suburb: 'Chatswood',
    postcode: '2067',
    state: 'NSW',
    numLocations: 5,
  },
  // 你可以继续添加更多硬编码数据
])

const filteredRows = computed(() => {
  if (!search.value) return rows.value
  const q = search.value.toLowerCase()
  return rows.value.filter(item =>
    Object.values(item).some(v =>
      String(v).toLowerCase().includes(q)
    )
  )
})
</script>

