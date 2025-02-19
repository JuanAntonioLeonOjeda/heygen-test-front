import StreamingAvatar, {
  AvatarQuality,
  VoiceEmotion
} from "@heygen/streaming-avatar"

import { faq } from './faq'

export const createStreamingAvatar = async (token) => {
  try {
    const avatar = new StreamingAvatar({
      token,
    })

    return avatar
  } catch (error) {
    return {
      message: "Error creating Avatar",
      error,
    }
  }
}

export const createStreamingSession = async (avatar) => {
  try {
    const sessionData = await avatar.createStartAvatar({
      quality: AvatarQuality.Medium,
      avatarName: "default",
      voice: {
        emotion: VoiceEmotion.FRIENDLY,
      },
      language: 'es-ES',
      knowledgeBase: faq
    })

    return sessionData
  } catch (error) {
    return {
      message: "Error creating new Session",
      error,
    }
  }
}
