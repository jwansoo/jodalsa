<template>
  <div class="flex flex-col mt-6 justify-center items-center">
    <h1 class="text-2xl pb-5">Create an event</h1>
    <form action="" class="text-xl" @submit.prevent="sendForm">
      <BaseSelect :options="categories" v-model="event.category" label="Select a category" />
      <h3>Name & describe your event</h3>
      <BaseInput v-model="event.title" label="Title" type="text" />
      <BaseInput v-model="event.description" label="Description" />
      <h3>Where is your event?</h3>
      <BaseInput v-model="event.location" label="location" type="text" />
      <h3>Are pets allowed?</h3>
      <div>
        <BaseRadioGroup v-model="event.pets" name="pets" :options="petOptions" :vertical="false" />
      </div>
      <h3>Extras</h3>
      <div>
        <BaseCheck v-model="event.extras.catering" label="Catering" />
      </div>
      <div><BaseCheck v-model="event.extras.music" label="live music" /></div>
      <button
        class="mt-3 justify-center items-center py-0.5 px-2 bg-blue-500 rounded-lg text-white"
        type="submit"
      >
        Submit
      </button>
    </form>
    <pre>{{ event }}</pre>
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'

const categories = ref([
  'sustainability',
  'nature',
  'animal welfare',
  'housing',
  'education',
  'food',
  'communith',
])
const event = ref({
  category: '',
  title: '',
  description: '',
  location: '',
  pets: 1,
  extras: {
    catering: false,
    music: false,
  },
})

const petOptions = ref([
  { label: 'Yes', value: 1 },
  { label: 'No', value: 0 },
])

const sendForm = () => {
  axios.post('https://github.com/jwansoo/jodalsa/events', event.value).then((response) => {
    console.log('Response', response)
  })
}
</script>

<style scoped></style>
