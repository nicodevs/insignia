<script setup type="ts">
import { db } from '../firebase';
import { sum, max, min, random } from 'lodash-es';

onMounted(() => {
    db.ref('rolls').on('value', (snapshot) => {
        rolls.value = snapshot.val() ? Object.values(snapshot.val()) : [];
    })
});

const rolls = ref([]);
const diceOptions = [1, 2, 3, 4, 5, 6, 7, 8];
const modes = ['NORMAL', 'ADVANTAGE', 'DISADVANTAGE'];
const mode = ref('NORMAL');

function pushDiceRoll (numberOfDice) {
    db.ref('rolls').push({
        ...rollDice(numberOfDice, mode.value),
        timestamp: Date.now(),
        player: useRoute().query.player
    });
}

function rollDice (numberOfDice, mode = 'NORMAL') {
    const results = [];
    const diceToRoll = numberOfDice + (mode !== 'NORMAL' ? 1 : 0);

    for (let i = 0; i < diceToRoll; i++) {
        const roll = random(1, 6);
        results.push(roll);
    }

    const insignias = results.splice(0, mode !== 'NORMAL' ? 2 : 1);
    const total = (mode === 'DISADVANTAGE' ? min(insignias) : max(insignias)) + sum(results);

    return { insignias, results, total };
}
</script>

<template>
  <div class="flex-1">
    <div class="flex gap-2">
      <button
        v-for="option in diceOptions"
        :key="option"
        class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
        @click="pushDiceRoll(option)">
        Roll {{ option }}
      </button>
      <select
        v-model="mode"
        class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
        <option
          v-for="option in modes"
          :key="option"
          :value="option">
          {{ option }}
        </option>
      </select>
    </div>
    <div class="text-xl grid gap-6 mt-8">
      <div
        v-for="roll in rolls.toReversed()"
        :key="roll.timestamp">
        <p>
          <strong>{{ roll.player }}:</strong> {{ roll.total }}
        </p>
        <div class="flex items-center text-3xl">
          <div class="flex flex-col">
            <DiceDisplay
              v-for="(number, index) in roll.insignias"
              :key="index"
              :number="number" />
          </div>
          <DiceDisplay
            v-for="(number, index) in roll.results"
            :key="index"
            :number="number" />
        </div>
      </div>
    </div>
  </div>
</template>
