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
        <button
          @click="openModal"
          class="bg-[#2C2F3A] text-white px-4 py-2 rounded hover:bg-[#3A3E4D] shadow transition"
        >
          Upload File
        </button>
        <input
          v-model="search"
          type="text"
          placeholder="Search..."
          class="border border-gray-300 rounded px-4 py-2 outline-none focus:ring-2 focus:ring-[#2C2F3A]"
        />
      </div>

      <!-- Table -->
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

    <!-- Upload Modal -->
    <transition name="fade">
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center"
        aria-modal="true" role="dialog"
        @keydown.esc="closeModal"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40" @click="closeModal"></div>

        <!-- Dialog -->
        <div
          class="relative z-10 w-[92%] max-w-lg rounded-xl bg-white p-6 shadow-xl"
        >
          <div class="flex items-start justify-between mb-4">
            <h3 class="text-xl font-semibold text-[#1F2025]">Upload file</h3>
            <button
              @click="closeModal"
              class="ml-3 rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              aria-label="Close"
            >✕</button>
          </div>

          <p class="text-sm text-gray-600 mb-4">
            Please upload a document in <span class="font-medium">PDF</span> or
            <span class="font-medium">Word</span> format only.
          </p>

          <!-- Dummy input: no backend yet -->
          <label class="block">
            <input
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              class="block w-full text-sm text-gray-700 file:mr-4 file:rounded file:border-0 file:bg-[#2C2F3A] file:px-4 file:py-2 file:text-white hover:file:bg-[#3A3E4D]"
              @change="onPick"
            />
          </label>

          <p v-if="fileName" class="mt-3 text-sm text-gray-600">
            Selected: <span class="font-medium">{{ fileName }}</span>
          </p>

          <div class="mt-6 flex justify-end space-x-3">
            <button
              @click="closeModal"
              class="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              disabled
              class="cursor-not-allowed rounded bg-gray-300 px-4 py-2 text-white"
              title="Upload not implemented yet"
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const search = ref('')
const showModal = ref(false)
const fileName = ref('')

function openModal() {
  showModal.value = true
  // prevent page scroll under modal
  document.documentElement.classList.add('overflow-hidden')
}
function closeModal() {
  showModal.value = false
  document.documentElement.classList.remove('overflow-hidden')
  fileName.value = ''
}
function onPick(e) {
  const f = e.target.files?.[0]
  fileName.value = f ? f.name : ''
}

// Close on Cmd/Ctrl+W prevention? (not necessary). Close on Escape handled via @keydown.esc on container.
onMounted(() => window.addEventListener('keydown', escClose))
onBeforeUnmount(() => window.removeEventListener('keydown', escClose))
function escClose(e) { if (e.key === 'Escape' && showModal.value) closeModal() }

const rows = ref([
  { id: 1, clientName: 'Acme Corp', address: '123 Main St', suburb: 'Sydney',     postcode: '2000', state: 'NSW', numLocations: 3 },
  { id: 2, clientName: 'Beta Pty Ltd', address: '456 George St', suburb: 'Parramatta', postcode: '2150', state: 'NSW', numLocations: 2 },
  { id: 3, clientName: 'Gamma Solutions', address: '789 Market Rd', suburb: 'Chatswood', postcode: '2067', state: 'NSW', numLocations: 5 },
])

const filteredRows = computed(() => {
  if (!search.value) return rows.value
  const q = search.value.toLowerCase()
  return rows.value.filter(item =>
    Object.values(item).some(v => String(v).toLowerCase().includes(q))
  )
})
</script>

<style>
/* simple fade for modal */
.fade-enter-active, .fade-leave-active { transition: opacity .15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>


