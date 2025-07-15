import { jugador1, jugador2, winMatrix } from "../constants";

export const checkWin = (tablero) => {
  for (const linea of winMatrix) {
    const fichas = linea.map((index) => tablero[index]);
    if (fichas.every((ficha) => ficha === jugador1)) {
      return jugador1;
    }
    if (fichas.every((ficha) => ficha === jugador2)) {
      return jugador2;
    }
  }
  if (tablero.every((ficha) => ficha !== null)) {
    return "Empate";
  }
  return null;
};
