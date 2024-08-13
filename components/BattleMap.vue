<script setup>
import { db } from '../firebase'
import { ref } from 'vue'

const gridSize = 20

// Token list
const tokens = ref([])

onMounted(() => {
  db.ref('tokens').on('value', snapshot => {
    if (snapshot.exists()) {
      const tokensArray = Object.entries(snapshot.val()).map(([id, data]) => {
        return {
          ...data,
          url: `tokens/${id}`
        }
      })
      tokens.value = tokensArray
    } else {
      tokens.value = []
    }
  })
})

const selectedToken = ref(null)

// Function to select a token
const selectToken = index => {
  selectedToken.value = tokens.value.find(token => token.index === index)
}

// Function to move the selected token
const moveToken = index => {
  if (selectedToken.value) {
    selectedToken.value.index = index
    db.ref(selectedToken.value.url).update(selectedToken.value)
  }
}

// Function to add a new token
const addToken = () => {
  const newLabel = String.fromCharCode('A'.charCodeAt(0) + tokens.value.length)
  db.ref('tokens').push({ label: newLabel, index: 0 })
}

// Function to remove the selected token
const removeToken = () => {
  if (selectedToken.value) {
    db.ref(selectedToken.value.url).remove()
    selectedToken.value = null
  }
}
</script>

<template>
  <div class="p-4 space-y-4">
    <div class="space-x-2">
      <button
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        @click="addToken">
        Add Token
      </button>
      <button
        :disabled="selectedToken === null"
        class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:bg-gray-400"
        @click="removeToken">
        Remove Token
      </button>
    </div>
    <div class="w-full max-w-4xl">
      <div style="display: flex; flex-wrap: wrap">
        <div
          v-for="rowIndex in gridSize"
          :key="rowIndex"
          class="flex w-full">
          <div
            v-for="colIndex in gridSize"
            :key="colIndex"
            class="w-6 h-6 border border-gray-300 flex items-center justify-center relative cursor-pointer"
            :class="{
              'bg-blue-100': selectedToken !== null && selectedToken.index === (rowIndex - 1) * gridSize + (colIndex - 1)
            }"
            @dblclick="moveToken((rowIndex - 1) * gridSize + (colIndex - 1))">
            <div
              v-if="tokens.some(token => token.index === (rowIndex - 1) * gridSize + (colIndex - 1))"
              :class="{
                'bg-green-500': selectedToken !== null && selectedToken.index === (rowIndex - 1) * gridSize + (colIndex - 1),
                'bg-yellow-500': selectedToken === null || selectedToken.index !== (rowIndex - 1) * gridSize + (colIndex - 1)
              }"
              class="absolute inset-0 flex items-center justify-center text-white font-bold cursor-pointer"
              @click.stop="selectToken((rowIndex - 1) * gridSize + (colIndex - 1))">
              {{ tokens.find(token => token.index === (rowIndex - 1) * gridSize + (colIndex - 1)).label }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
