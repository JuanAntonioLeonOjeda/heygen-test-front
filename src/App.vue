<template>
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
    <!-- <video v-if="videoUrl" :src="videoUrl" controls autoplay></video> -->
    <!-- <p v-else>Loading...</p> -->
    <video id="avatarVideo" autoplay playsinline></video>
    <input
      type="text" 
      @keydown="handleKeyDown"
    >
    <button>
      @click="stopConversation"
    </button>
  </div>
</template>

<script setup>
  import axios from 'axios'
  import { ref, onMounted } from 'vue'
  import {
    StreamingEvents
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

  const videoElement = document.getElementById("avatarVideo")

  const initializeStream = () => {
    console.log(avatar.value)
    avatar.value.on(StreamingEvents.STREAM_READY, handleStreamReady)
    avatar.value.on(StreamingEvents.STREAM_DISCONNECTED, handleStreamDisconnected)
  }

  const handleStreamReady = (e) => {
    if (e.detail && videoElement) {
        videoElement.srcObject = e.detail
        videoElement.onloadedmetadata = () => {
          videoElement.play().catch(console.error)
        }
    } else {
      console.error("Stream is not available")
    }
  }

  const handleStreamDisconnected = async () => {
    console.log("Stream disconnected");
    if (videoElement) {
      videoElement.srcObject = null
    }
  }

  const terminateAvatarSession = async () => {
    if (!avatar || !sessionId) return

    await avatar.stopAvatar()
    videoElement.srcObject = null
    avatar = null
  }

  const startConversation = async () => {
    try {
      isLoading.value = true
      const token = await createHeyGenToken()

      if (token.error) throw new Error (token.error)

      const avatar = await createStreamingAvatar(token)
      avatar.value = avatar
      const session = await createStreamingSession(avatar)

      sessionStarted.value = session.session_id

      initializeStream()
      isLoading.value = false
    } catch (error) {
      console.error(error)
      isLoading.value = false
    }
  }

  const stopConversation = () => {
    console.log('stahp')
  }

  // async function getVideoUrl(input) {
  //   console.log(input)
  // try {
  //   const response = await axios.post(`http://localhost:3000/claude`, {
  //     question: input
  //   })
  //   console.log(response.data)
  //   videoUrl.value = response.data.video_url
  // } catch (error) {
  //   console.error("Error fetching video:", error)
  // }
  // }

  const handleKeyDown = async (e) => {
    // if (e.key === 'Enter') getVideoUrl(e.target.value)
  }
</script>

<style scoped>

</style>
