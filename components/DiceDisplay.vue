<script setup>
const props = defineProps({
  number: {
    type: Number,
    required: true,
    validator: value => value >= 1 && value <= 6
  }
})

const diceCharacters = { 1: '⚀', 2: '⚁', 3: '⚂', 4: '⚃', 5: '⚄', 6: '⚅' }

const diceCharacter = computed(() => diceCharacters[props.number])
</script>

<template>
  <div>
    {{ diceCharacter }}
  </div>
</template>
