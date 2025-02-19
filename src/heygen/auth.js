import axios from 'axios'

const HEYGEN_API_KEY =
  "YmVkZDRhNzY0ZmU5NDI1MTkyNmJjOWNjZGZmMzk3MDUtMTczOTg4MDA0Ng=="

export const createHeyGenToken = async () => {
  try {
    const { data } = await axios.post(
      " https://api.heygen.com/v1/streaming.create_token",
      {},
      {
        headers: { "X-Api-Key": HEYGEN_API_KEY },
      }
    )

    if (data.error)
      return {
        message: "Error generating token",
        error: data.error,
      }
    return data.data.token
  } catch (error) {
    return {
      message: "Error generating token",
      error,
    }
  }
}
