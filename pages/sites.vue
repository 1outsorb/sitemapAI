<template>
  <div class="min-h-screen bg-[#F5F6F8] text-[#1F2025]">
    <!-- Navigation Bar -->
    <nav class="flex items-center justify-between px-6 py-8 bg-[#2C2F3A] shadow-md relative">
      <NuxtLink to="/" class="text-2xl font-semibold tracking-wide text-white hover:underline transition">
        sitemapAI
      </NuxtLink>
      <div class="flex space-x-6">
        <NuxtLink to="/dashboard" class="px-4 py-2 rounded font-medium text-white hover:bg-[#3A3E4D] transition">Dashboard</NuxtLink>
        <NuxtLink to="/sites" class="px-4 py-2 rounded font-medium text-white hover:bg-[#3A3E4D] transition">Sites</NuxtLink>
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
              <th class="px-6 py-3 text-left font-semibold text-gray-700">Number of locations</th>
              <th class="px-6 py-3 text-left font-semibold text-gray-700">Number of tasks</th>
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
              <td class="px-6 py-4 whitespace-nowrap">{{ item.numLocations }}</td>
              <td class="px-6 py-4 whitespace-nowrap">{{ item.numTasks }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button class="text-[#2C2F3A] bg-gray-200 rounded px-3 py-1 hover:bg-gray-300 transition">
                  Edit
                </button>
              </td>
            </tr>
          </tbody>
        </table> 
      </div>

            <!-- Result Panel -->
      <div v-if="result" class="mt-8 grid grid-cols-1 gap-6">
        <div class="bg-white rounded-xl shadow p-6">
          <div class="font-semibold text-lg mb-3">
            Azure Analyze Result <span v-if="result.modelId"> (model: {{ result.modelId }})</span>
          </div>

          <pre class="text-sm text-gray-800 bg-gray-50 rounded p-4 overflow-x-auto">
{{ pretty(result.raw ?? result) }}
          </pre>

          <div v-if="result.content" class="mt-4">
            <div class="text-sm text-gray-500 mb-1">Extracted Content</div>
            <div class="text-sm text-gray-700 whitespace-pre-wrap">
              {{ result.content }}
            </div>
          </div>

          <div v-if="result.areaBasedTaskTable?.length" class="mt-6">
            <div class="text-sm font-semibold mb-2">Extracted Area Based Tasks</div>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 border">
                <thead class="bg-gray-100">
                  <tr>
                    <th
                      v-for="(val, col) in result.areaBasedTaskTable[0]"
                      :key="col"
                      class="px-4 py-2 text-left font-semibold text-gray-700"
                    >
                      {{ col }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(row, idx) in result.areaBasedTaskTable"
                    :key="idx"
                    class="odd:bg-white even:bg-gray-50 hover:bg-gray-100"
                  >
                    <td
                      v-for="(val, col) in row"
                      :key="col"
                      class="px-4 py-2 whitespace-pre-wrap"
                    >
                      {{ val }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
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
        <div class="relative z-10 w-[92%] max-w-lg rounded-xl bg-white p-6 shadow-xl">
          <div class="flex items-start justify-between mb-4">
            <h3 class="text-xl font-semibold text-[#1F2025]">Upload file</h3>
            <button
              @click="closeModal"
              class="ml-3 rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              aria-label="Close"
            >✕</button>
          </div>

          <p class="text-sm text-gray-600 mb-3">
            Please upload a document in
            <span class="font-medium">PDF, JPEG, PNG, TIFF or BMP format.</span> 
            Max size: {{ humanSize(MAX_MB * 1024 * 1024) }}.
          </p>

          <label class="block">
            <input
              type="file"
              :accept="ACCEPT"
              class="block w-full text-sm text-gray-700 file:mr-4 file:rounded file:border-0 file:bg-[#2C2F3A] file:px-4 file:py-2 file:text-white hover:file:bg-[#3A3E4D]"
              @change="onPick"
            />
          </label>

          <div v-if="pickedFile" class="mt-3 text-sm text-gray-700">
            <div>Selected: <span class="font-medium">{{ pickedFile.name }}</span></div>
            <div class="text-gray-500">Size: {{ humanSize(pickedFile.size) }}</div>
          </div>

          <p v-if="modalError" class="mt-3 text-sm text-red-600">
            {{ modalError }}
          </p>

          <div class="mt-6 flex justify-end space-x-3">
            <button
              @click="closeModal"
              class="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100"
              :disabled="uploading"
            >
              Cancel
            </button>

            <button
              @click="onUpload"
              class="rounded bg-[#2C2F3A] px-4 py-2 text-white hover:bg-[#3A3E4D] disabled:opacity-60"
              :disabled="!pickedFile || uploading"
            >
              <span v-if="!uploading">Upload</span>
              <span v-else>Uploading…</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const ACCEPT =
  '.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
const MAX_MB = 20 

const search = ref('')
const showModal = ref(false)

const pickedFile = ref/** @type {File|null} */(null)
const uploading = ref(false)

const errorMsg = ref('')
const modalError = ref('')
const result = ref(null)

/** ----- helpers ----- */
function humanSize (bytes) {
  if (!bytes && bytes !== 0) return ''
  const thresh = 1024
  if (Math.abs(bytes) < thresh) return `${bytes} B`
  const units = ['KB', 'MB', 'GB', 'TB']
  let u = -1
  do {
    bytes /= thresh
    ++u
  } while (Math.abs(bytes) >= thresh && u < units.length - 1)
  return `${bytes.toFixed(1)} ${units[u]}`
}

function pretty (val) {
  try { return JSON.stringify(val, null, 2) } catch { return String(val) }
}

/** ----- modal control ----- */
function openModal () {
  showModal.value = true
  errorMsg.value = ''
  modalError.value = ''
  document.documentElement.classList.add('overflow-hidden')
}
function closeModal () {
  showModal.value = false
  document.documentElement.classList.remove('overflow-hidden')
  uploading.value = false
  modalError.value = ''
  pickedFile.value = null
}

/** ----- pick & validate ----- */
function onPick (e) {
  modalError.value = ''
  const input = e.target
  const f = input && input.files ? input.files[0] : null
  if (!f) {
    pickedFile.value = null
    return
  }

  const okType =
  f.type === 'application/pdf' ||
  f.type === 'image/jpeg' ||
  f.type === 'image/png' ||
  f.type === 'image/tiff' ||
  f.type === 'image/bmp' ||
  /\.(pdf|jpeg|jpg|png|tif|tiff|bmp)$/i.test(f.name)

  if (!okType) {
    modalError.value = 'Only PDF/DOC/DOCX files are allowed.'
    pickedFile.value = null
    return
  }

  const maxBytes = MAX_MB * 1024 * 1024
  if (f.size > maxBytes) {
    modalError.value = `File is too large. Max allowed: ${humanSize(maxBytes)}.`
    pickedFile.value = null
    return
  }

  pickedFile.value = f
}

/** ----- upload ----- */
async function onUpload () {
  if (!pickedFile.value) return
  modalError.value = ''
  uploading.value = true

  try {
    const fd = new FormData()
    fd.append('file', pickedFile.value)

    const res = await $fetch('/api/analyze', {
      method: 'POST',
      body: fd
    })

    result.value = res
    closeModal()
  } catch (err) {
    errorMsg.value = (err?.data?.message) || err?.message || 'Upload failed'
    uploading.value = false
  }
}

/** ----- esc to close modal ----- */
function escClose (e) {
  if (e.key === 'Escape' && showModal.value && !uploading.value) closeModal()
}
onMounted(() => window.addEventListener('keydown', escClose))
onBeforeUnmount(() => window.removeEventListener('keydown', escClose))

/** ----- table data from API ----- */
const rows = ref([])

onMounted(async () => {
  try {
    rows.value = await $fetch('/api/clients')
  } catch (err) {
    errorMsg.value = err?.message || 'Failed to load clients'
  }
})

const filteredRows = computed(() => {
  if (!search.value) return rows.value
  const q = search.value.toLowerCase()
  return rows.value.filter(item =>
    Object.values(item).some(v => String(v).toLowerCase().includes(q))
  )
})
</script>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity .15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
