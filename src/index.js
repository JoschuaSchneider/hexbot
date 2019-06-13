import React, { useState, useEffect, useContext } from "react"
import { render } from "react-dom"

import {
  GameStateContext,
  GameStateProvider
} from "./context/game-state-context"

import "./index.css"

function Color({ placeholder = false, color, left, right }) {
  const { colorScore } = useContext(GameStateContext)

  const score = colorScore(color)

  if (placeholder)
    return (
      <div
        className={`color ${left && "left"} ${right && "right"}`}
        style={{ background: "#ebebeb" }}
      >
        <div className="hex">-</div>
      </div>
    )
  return (
    <div
      className={`color ${left && "left"} ${right && "right"} ${score &&
        score.greater &&
        "greater"} ${score && !score.greater && "lower"}`}
      style={{ background: color.hex }}
    >
      <div className="label">
        <div className="red">{color.red}</div>
        <div className="green">{color.green}</div>
        <div className="blue">{color.blue}</div>
      </div>
      <div className="hex">{score ? score.score : color.hex}</div>
    </div>
  )
}

function RandomColor() {
  const {
    colorsA,
    colorsB,
    ready,
    initGame,
    start,
    next,
    showWinner,
    totalPoints
  } = useContext(GameStateContext)

  useEffect(() => {
    initGame()
    start()
  }, [initGame, start])

  return (
    <div className="game">
      <header className="info">
        <div className="title">Hexbot Battle</div>
        <div className="sub-title">
          <a href="https://noopschallenge.com/challenges/hexbot">
            noops-challenge/hexbot
          </a>
          <br />
          <br />
          Generates 5 Colors for each team using the Hexbot API.
          <br />
          Then compares the average RGB values of each corresponding color.
          Highest average value wins a point, most total points win.
        </div>
      </header>
      <div className="teams">
        <div className="team">
          <div className="title">Hexbot A</div>
          {!ready && (
            <>
              <Color placeholder left />
              <Color placeholder left />
              <Color placeholder left />
              <Color placeholder left />
              <Color placeholder left />
            </>
          )}
          {ready && colorsA.map(color => <Color left color={color} />)}
          <div className="points">{(showWinner && totalPoints[0]) || "-"}</div>
        </div>
        <div className="team">
          <div className="title">Hexbot B</div>
          {!ready && (
            <>
              <Color placeholder left />
              <Color placeholder left />
              <Color placeholder left />
              <Color placeholder left />
              <Color placeholder left />
            </>
          )}
          {ready && colorsB.map(color => <Color right color={color} />)}
          <div className="points">{(showWinner && totalPoints[1]) || "-"}</div>
        </div>
      </div>
      <div className="init">
        {showWinner && <button onClick={initGame}>Generate new Teams</button>}
        {!showWinner && <button onClick={next}>Compare next</button>}
      </div>
      <footer>
        Made by <a href="https://joschuaschneider.de">Joschua Schneider</a> |{" "}
        <a href="https://github.com/JoschuaSchneider/hexbot">Source</a>
      </footer>
    </div>
  )
}

render(
  <GameStateProvider>
    <RandomColor />
  </GameStateProvider>,
  document.getElementById("root")
)
