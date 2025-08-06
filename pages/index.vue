<template>
  <div class="min-h-screen bg-[#F5F6F8] text-[#1F2025]">
    <!-- Navigation Bar -->
    <nav class="flex items-center justify-between px-6 py-4 bg-[#2C2F3A] shadow-md relative">
      <div class="text-2xl font-semibold tracking-wide text-white">sitemapAI</div>

      <!-- Hamburger Icon Button (always visible) -->
      <div class="relative">
        <button @click="toggleMenu" class="cursor-pointer">
          <svg class="w-6 h-6" fill="none" stroke="white" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>

        <!-- Dropdown Menu -->
        <div
          v-if="isMenuOpen"
          class="absolute right-0 mt-2 w-40 bg-[#2C2F3A] rounded shadow-md z-10"
        >
          <ul class="flex flex-col">
            <li><a href="#" class="block px-4 py-2 text-white hover:bg-[#3A3E4D]">Function1</a></li>
            <li><a href="#" class="block px-4 py-2 text-white hover:bg-[#3A3E4D]">Function2</a></li>
            <li><a href="#" class="block px-4 py-2 text-white hover:bg-[#3A3E4D]">Function3</a></li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="p-10 text-center">
      <h1 class="text-4xl font-bold text-[#1F2025]">Welcome to sitemap</h1>
      <p class="text-[#5A5A5A] mt-4">This is your prototype homepage.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isMenuOpen = ref(false)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}
</script>




