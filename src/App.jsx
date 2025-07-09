/* eslint-disable no-unused-vars */
import { useState } from "react";
import { winMatrix, columnasMatrix } from "./coordenadas";
import { Box } from "./Box";
import confetti from "canvas-confetti";

export const App = () => {
  const columnas = 7;
  const filas = 6;

  const jugador1 = "🔵";
  const jugador2 = "🔴";

  const [tablero, setTablero] = useState(Array(42).fill(null));
  const [turno, setTurno] = useState(jugador1);
  const [ganador, setGanador] = useState(null);

  const checkWin = (tablero) => {
    for (const linea of winMatrix) {
      const fichas = linea.map((index) => tablero[index]);
      if (fichas.every((ficha) => ficha === jugador1)) {
        setGanador(jugador1);
        confetti();
        return true;
      }
      if (fichas.every((ficha) => ficha === jugador2)) {
        setGanador(jugador2);
        confetti();
        return true;
      }
      if (tablero.every((ficha) => ficha !== null)) {
        setGanador("Empate");
        return true;
      }
    }
    return false;
  };

  const cambiarTurno = () => {
    setTurno(turno === jugador1 ? jugador2 : jugador1);
  };

  const reset = () => {
    setTablero(Array(42).fill(null));
    setTurno(jugador1);
    setGanador(null);
  };

  const meterFicha = (columna) => {
    if (ganador) return;
    const nuevoTablero = [...tablero];
    for (const index of columnasMatrix[columna]) {
      if (nuevoTablero[index] === null) {
        nuevoTablero[index] = turno;
        setTablero(nuevoTablero);
        const hayGanador = checkWin(nuevoTablero);
        !hayGanador && cambiarTurno();
        return;
      }
    }
  };

  const botones = Array(columnas)
    .fill(null)
    .map((_, index) => (
      <button key={index} onClick={() => meterFicha(index)}>
        {index + 1}
      </button>
    ));

  return (
    <>
      <header>
        <h1>4Linea</h1>
        <p>Turno: {turno}</p>
      </header>
      <section
        style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}
      >
        {botones}
        {tablero.map((casilla, index) => (
          <Box key={index} ficha={casilla} />
        ))}
      </section>
      <footer>
        {ganador && (
          <>
            <p>Ha ganado {ganador}!!!!🎉</p>
            <button
              style={{ marginTop: "10px", width: "100%" }}
              onClick={reset}
            >
              Jugar de nuevo
            </button>
          </>
        )}
        {!ganador && (
          <button style={{ marginTop: "10px", width: "100%" }} onClick={reset}>
            Reiniciar Juego
          </button>
        )}
      </footer>
    </>
  );
};
