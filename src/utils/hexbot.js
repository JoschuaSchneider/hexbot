import Color from "color"

const API_ENDPOINT = "https://api.noopschallenge.com/hexbot"

async function doFetchWithTimeout(path, timeout) {
  const responsePromise = fetch(path)
  let didTimeout = false
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("Request timed out"))
      didTimeout = true
    }, timeout)

    responsePromise
      .then(response => {
        if (!didTimeout) return resolve(response)
      })
      .catch(reject)
  })
}

export function hexToColor(hex) {
  const color = Color(hex)

  return {
    color,
    hex: hex,
    red: color.red(),
    green: color.green(),
    blue: color.blue()
  }
}

export async function getColor() {
  try {
    const response = await doFetchWithTimeout(API_ENDPOINT, 5000)
    const data = await response.json()

    return hexToColor(data.colors[0].value)
  } catch (e) {
    console.error(e)
    throw e
  }
}

export async function getMultipleColors(count) {
  try {
    const response = await doFetchWithTimeout(
      `${API_ENDPOINT}?count=${count}`,
      5000
    )
    const data = await response.json()

    return data.colors.map(color => hexToColor(color.value))
  } catch (e) {
    console.error(e)
    throw e
  }
}
