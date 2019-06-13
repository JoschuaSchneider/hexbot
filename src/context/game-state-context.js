import React, { createContext, useReducer, useEffect, useCallback } from "react"

import { getMultipleColors } from "../utils/hexbot"

export const GameStateContext = createContext({})

const initialGameState = {
  teamSize: 5,
  colorsA: [],
  colorsB: [],
  scores: [],
  ready: false,
  playing: false,
  totalPoints: [],
  showWinner: false
}

const reduceGameState = (state, action) => {
  switch (action.type) {
    case "setColors":
      return {
        ...state,
        colorsA: action.colorsA,
        colorsB: action.colorsB,
        ready: true
      }
    case "setPlaying":
      return { ...state, playing: true }
    case "reset":
      return { ...initialGameState }
    case "setScores":
      return { ...state, scores: action.scores }
    case "showWinner":
      return {
        ...state,
        playing: false,
        totalPoints: action.totalPoints,
        showWinner: true
      }
  }

  return state
}

export function GameStateProvider(props) {
  const [state, dispatch] = useReducer(reduceGameState, initialGameState)

  const initGame = useCallback(async () => {
    dispatch({ type: "reset" })
    const colors = await getMultipleColors(state.teamSize * 2)

    dispatch({
      type: "setColors",
      colorsA: colors.slice(0, state.teamSize),
      colorsB: colors.slice(state.teamSize)
    })
  }, [state.teamSize])

  const start = useCallback(() => {
    dispatch({ type: "setPlaying" })
  }, [])

  const next = () => {
    //if (!state.playing) return null
    const scores = state.scores

    if (scores.length < state.teamSize) {
      const colorA = state.colorsA[scores.length]
      const colorB = state.colorsB[scores.length]

      const avgA = (colorA.red + colorA.green + colorA.red) / 3
      const avgB = (colorB.red + colorB.green + colorB.red) / 3

      const newScores = [...scores, [Math.round(avgA), Math.round(avgB)]]

      dispatch({ type: "setScores", scores: newScores })

      if (newScores.length === state.teamSize) {
        const pointsA = newScores.reduce(
          (prev, curr) => prev + (curr[0] > curr[1] ? 1 : 0),
          0
        )
        const pointsB = newScores.reduce(
          (prev, curr) => prev + (curr[0] < curr[1] ? 1 : 0),
          0
        )

        dispatch({
          type: "showWinner",
          totalPoints: [pointsA, pointsB]
        })
      }
    }
  }

  const colorScore = function(color) {
    let colorIndex = -1
    let collection = 0
    colorIndex = state.colorsA.findIndex(c => c === color)
    if (colorIndex === -1) {
      colorIndex = state.colorsB.findIndex(c => c === color)
      collection = 1
    }
    if (colorIndex === -1) return null

    const score = state.scores[colorIndex]

    if (!score) return null

    return {
      score: score[collection],
      greater: score[collection] > score[collection === 1 ? 0 : 1]
    }
  }

  return (
    <GameStateContext.Provider
      value={{
        ...state,
        initGame,
        start,
        next,
        colorScore
      }}
      {...props}
    />
  )
}
