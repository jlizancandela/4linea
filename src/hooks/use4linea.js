import { useState } from "react";
import { jugador1, jugador2, columnasMatrix } from "../constants";
import { useEffect } from "react";
import { mejorMovimientoIA } from "../logic/ia";
import { checkWin } from "../logic/logic";
import confetti from "canvas-confetti";

export const use4linea = () => {
  const [tablero, setTablero] = useState(Array(42).fill(null));
  const [turno, setTurno] = useState(jugador1);
  const [ganador, setGanador] = useState(null);
  const [profundidad, setProfundidad] = useState(0);

  useEffect(() => {
    let ejecutado = false;
    if (ejecutado) return;
    if (turno === jugador2 && !ganador && profundidad > 0) {
      const movimiento = mejorMovimientoIA(tablero, profundidad, jugador2);
      if (movimiento !== null) {
        setTimeout(() => meterFicha(movimiento), 200);
        ejecutado = true;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tablero, turno, ganador, profundidad]);

  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const estadoGuardado = localStorage.getItem("estado");
      if (!estadoGuardado) return;
      const { tablero, turno, ganador, profundidad } =
        JSON.parse(estadoGuardado);
      setTablero(tablero);
      setTurno(turno);
      setGanador(ganador);
      setProfundidad(profundidad);
    } catch (error) {
      console.error("Error al cargar el estado:", error);
    }
  }, []);

  const meterFicha = (columna) => {
    if (ganador) return;
    const nuevoTablero = [...tablero];
    for (const index of columnasMatrix[columna]) {
      if (nuevoTablero[index] === null) {
        nuevoTablero[index] = turno;
        setTablero(nuevoTablero);
        const hayGanador = checkWin(nuevoTablero);
        if (hayGanador) {
          setGanador(hayGanador);
          return;
        }
        if (hayGanador === null) {
          const nuevoTurno = turno == jugador1 ? jugador2 : jugador1;
          setTurno(nuevoTurno);
          guardarEstado(nuevoTablero, nuevoTurno, ganador, profundidad);
          return;
        }
      }
    }
  };

  const guardarEstado = (tablero, turno, ganador, profundidad) => {
    const estado = {
      tablero,
      turno,
      ganador,
      profundidad,
    };
    localStorage.setItem("estado", JSON.stringify(estado));
  };

  const reset = () => {
    setTablero(Array(42).fill(null));
    setTurno(jugador1);
    setGanador(null);
    localStorage.removeItem("estado");
  };

  return {
    tablero,
    turno,
    ganador,
    profundidad,
    meterFicha,
    reset,
    setProfundidad,
  };
};
