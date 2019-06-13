import Color from "color"

const API_ENDPOINT = "https://api.noopschallenge.com/hexbot"

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
    const response = await fetch(API_ENDPOINT)
    const data = await response.json()

    return hexToColor(data.colors[0].value)
  } catch (e) {
    console.error(e)
    throw e
  }
}

export async function getMultipleColors(count) {
  try {
    const response = await fetch(`${API_ENDPOINT}?count=${count}`)
    const data = await response.json()

    return data.colors.map(color => hexToColor(color.value))
  } catch (e) {
    console.error(e)
    throw e
  }
}
