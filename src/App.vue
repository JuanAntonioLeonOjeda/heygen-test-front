<template>
  <video id="avatarVideo" autoplay playsinline />
  <button 
    v-if="!sessionStarted && !isLoading"
    @click="startConversation"
  >
    Start Conversation
  </button>
  <div v-else-if="isLoading">
    Loading...
  </div>
  <div v-else>
    <input
      type="text" 
      @keydown="handleKeyDown"
    >
    <button @click="terminateSession">
      Stop Conversation
    </button>
  </div>
</template>

<script setup>
  import axios from 'axios'
  import { ref, onMounted } from 'vue'
  import {
    StreamingEvents, 
    TaskType
  } from "@heygen/streaming-avatar"
  import {createHeyGenToken} from './heygen/auth'
  import {
    createStreamingAvatar,
    createStreamingSession
  } from './heygen/streaming'

  const isLoading = ref(false)
  const sessionStarted = ref(false)
  const sessionId = ref('')
  const avatar = ref(null)

  const videoElement = ref(null)

  onMounted(() => {
    videoElement.value = document.getElementById("avatarVideo")
  })

  const initializeStream = () => {
    avatar.value.on(StreamingEvents.STREAM_READY, handleStreamReady)
    avatar.value.on(StreamingEvents.STREAM_DISCONNECTED, handleStreamDisconnected)
  }

  const handleStreamReady = (e) => {
    if (e.detail && videoElement.value) {
        videoElement.value.srcObject = e.detail
        videoElement.value.onloadedmetadata = () => {
          videoElement.value.play().catch(console.error)
        }
    } else {
      console.error("Stream is not available")
    }
  }

  const handleStreamDisconnected = async () => {
    console.log("Stream disconnected")
    if (videoElement.value) {
      videoElement.value.srcObject = null
    }
  }

  const terminateSession = async () => {
    if (!avatar.value || !sessionId) return

    await avatar.value.stopAvatar()
    videoElement.value.srcObject = null
    avatar.value = null
  }

  const startConversation = async () => {
    try {
      isLoading.value = true
      const token = await createHeyGenToken()

      if (token.error) throw new Error (token.error)

      const streamAvatar = await createStreamingAvatar(token)
      avatar.value = streamAvatar
      const session = await createStreamingSession(streamAvatar)

      sessionStarted.value = session.session_id

      initializeStream()
      isLoading.value = false
    } catch (error) {
      console.error(error)
      isLoading.value = false
    }
  }

  async function askQuestion(input) {
    try {
    avatar.value.speak({ text: input, taskType: TaskType.TALK })
    // const response = await axios.post(`http://localhost:3000/claude`, {
    //   question: input
    // })
    // console.log(response.data)
  } catch (error) {
    console.error("Error asking question:", error)
  }
  }

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') askQuestion(e.target.value)
  }
</script>

<style scoped>

</style>
