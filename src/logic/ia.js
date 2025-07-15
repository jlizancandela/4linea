import { columnas, jugador1, jugador2, columnasMatrix } from "../constants";
import { checkWin } from "./logic";

const posiblesMovimientos = (tablero) => {
  let movimientosPosibles = [];
  for (let col = 0; col < columnas; col++) {
    for (const index of columnasMatrix[col]) {
      if (tablero[index] === null) {
        movimientosPosibles.push(col); // ← columna, no índice del tablero
        break;
      }
    }
  }
  return movimientosPosibles;
};

const simularMovimiento = (tablero, columna, jugador) => {
  const tableroSimulado = [...tablero];
  for (const index of columnasMatrix[columna]) {
    if (tableroSimulado[index] === null) {
      tableroSimulado[index] = jugador;
      break;
    }
  }
  return tableroSimulado;
};

const evaluarGanador = (resultado, jugador) => {
  if (resultado === jugador) return 1000;
  if (resultado === "Empate") return 0;
  if (resultado === null) return 0;
  return -1000;
};

const negamax = (tablero, profundidad, alpha, beta, jugador) => {
  const resultado = checkWin(tablero);
  if (resultado !== null || profundidad === 0) {
    return evaluarGanador(resultado, jugador);
  }

  let maxEval = -Infinity;
  const movimientos = posiblesMovimientos(tablero);

  for (const movimiento of movimientos) {
    const nuevoTablero = simularMovimiento(tablero, movimiento, jugador);
    const oponente = jugador === jugador1 ? jugador2 : jugador1;
    const puntuacion = -negamax(
      nuevoTablero,
      profundidad - 1,
      -beta,
      -alpha,
      oponente
    );

    if (puntuacion > maxEval) {
      maxEval = puntuacion;
    }
    alpha = Math.max(alpha, puntuacion);
    if (alpha >= beta) {
      break; // Poda
    }
  }

  return maxEval;
};

const mejorMovimientoIA = (tablero, profundidad, jugador) => {
  let mejorValor = -Infinity;
  let mejorMovimiento = null;
  const movimientos = posiblesMovimientos(tablero);

  for (const movimiento of movimientos) {
    const nuevoTablero = simularMovimiento(tablero, movimiento, jugador);
    const oponente = jugador === jugador1 ? jugador2 : jugador1;
    const puntuacion = -negamax(
      nuevoTablero,
      profundidad - 1,
      -Infinity,
      Infinity,
      oponente
    );

    if (puntuacion > mejorValor) {
      mejorValor = puntuacion;
      mejorMovimiento = movimiento;
    }
  }

  return mejorMovimiento;
};

export { mejorMovimientoIA };
