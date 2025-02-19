<template>
  <button 
    v-if="!sessionStarted"
    @click="startConversation"
  >
    Start Conversation
  </button>
  <div v-else>
    <!-- <video v-if="videoUrl" :src="videoUrl" controls autoplay></video> -->
    <!-- <p v-else>Loading...</p> -->
    <input type="text" @keydown="handleKeyDown">
  </div>
</template>

<script setup>
  import axios from 'axios'
  import { ref, onMounted } from 'vue'
  const videoId = "f4df0165a54b486a9493145aed4a594c"
  const videoUrl = ref('')
  const sessionStarted = ref(false)
  const sessionId = ref('')

  const startConversation = async () => {
    const result = await axios.get('http://localhost:3000/session')
    sessionStarted.value = true
    console.log(result)
    sessionId.value = result.data.session_id
  }

  async function getVideoUrl(input) {
    console.log(input)
  try {
    const response = await axios.post(`http://localhost:3000/claude`, {
      question: input
    })
    console.log(response.data)
    videoUrl.value = response.data.video_url
  } catch (error) {
    console.error("Error fetching video:", error)
  }
}

const handleKeyDown = async (e) => {
  if (e.key === 'Enter') getVideoUrl(e.target.value)
}
</script>

<style scoped>

</style>
