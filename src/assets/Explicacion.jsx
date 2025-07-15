/* ========================== 4 EN LÍNEA CON IA (MINIMAX + ALPHA‑BETA) ===========================
   Este archivo está *excesivamente* comentado. Cada variable y cada paso se explica con lujo
   de detalles para que puedas seguir la lógica sin perderte. Si te resulta demasiado verborrea,
   simplemente borra líneas de comentario. 😉

   ───────────── TABLA DE CONTENIDO DE LOS COMENTARIOS ─────────────
   1. Importaciones y constantes globales
   2. Estados del componente React <App>
   3. useEffect ▶ IA automática
   4. checkWin ▶ comprobación de victoria / empate
   5. Functions auxiliares: cambiarTurno, reset, meterFicha
   6. IA – helpers: posiblesMovimientos, simularMovimiento, evaluarGanador
   7. IA – algoritmo: negamax (recursivo) y mejorMovimientoIA (wrapper)
   8. Render (botones de columnas, tablero, UI)
   ─────────────────────────────────────────────────────────────────

   Usa CTRL+F para saltar a la sección que te interese. -------------------------------------*/

/* ───────────────────────── 1. IMPORTACIONES Y CONSTANTES ───────────────────────── */
/*
 * React hooks ✨
 *   - useState   → gestionamos el estado del tablero, turno, etc.
 *   - useEffect  → ejecutamos la jugada de la IA cuando sea su turno
 */
import { useState, useEffect } from "react";

/*
 * winMatrix y columnasMatrix son matrices precalculadas que vienen de otro archivo.
 *   - winMatrix       → todas las combinaciones de 4 casillas que suponen victoria
 *   - columnasMatrix  → para cada columna (0‑6) la lista de índices donde cae la ficha
 */
import { winMatrix, columnasMatrix } from "../coordenadas";

/*
 * <Box> es el componente que pinta cada casilla del tablero (círculo azul/rojo o vacío).
 */
import { Box } from "../Box";

/*
 * canvas‑confetti simplemente lanza confeti cuando alguien gana. 🎉
 */
import confetti from "canvas-confetti";

/* ───────────────────────── 2. ESTADO DEL COMPONENTE ───────────────────────── */
export const App = () => {
  /* Dimensiones fijas del tablero. OJO: conectan con columnasMatrix.
   *   - 7 columnas  (de izquierda a derecha)
   *   - 6 filas     (de abajo a arriba ‑ así funcionan los índices de columnasMatrix)
   */
  const columnas = 7;
  const filas = 6;

  /* Fichas de los jugadores (emojis para comodidad visual). */
  const jugador1 = "🔵"; // Humano
  const jugador2 = "🔴"; // IA

  /* ---------------------- useState ---------------------- */
  /*
   * tablero   → Array(42) con valores null / "🔵" / "🔴".
   * turno     → quién juega ahora mismo.
   * ganador   → null / "🔵" / "🔴" / "Empate".
   * profundidad → cuántos niveles mira la IA (0 = sin IA).
   */
  const [tablero, setTablero] = useState(Array(42).fill(null));
  const [turno, setTurno] = useState(jugador1);
  const [ganador, setGanador] = useState(null);
  const [profundidad, setProfundidad] = useState(0);

  /* ───────────────────────── 3. useEffect ▶ IA AUTOMÁTICA ───────────────────────── */
  /*
   * Cada vez que cambian [tablero, turno, ganador, profundidad] se evalúa este efecto.
   * Si es el turno de la IA (jugador2), no hay ganador y profundidad > 0, la IA calcula
   * su mejor jugada y la ejecuta. 200ms de timeout solo para que el jugador vea el cambio.
   */
  useEffect(() => {
    if (turno === jugador2 && !ganador && profundidad > 0) {
      const mejorColumna = mejorMovimientoIA(tablero, profundidad, jugador2);
      if (mejorColumna !== null) {
        setTimeout(() => meterFicha(mejorColumna), 200);
      }
    }
    /* Notas sobre dependencias:
     *  - tablero: necesitamos recalcular cuando cambia algo.
     *  - turno:   para saber de quién es el turno.
     *  - ganador: para no seguir jugando si ya terminó.
     *  - profundidad: por si el usuario cambia la dificultad.
     */
  }, [tablero, turno, ganador, profundidad]);

  /* ───────────────────────── 4. checkWin ▶ DETECCIÓN DE VICTORIA ───────────────────────── */
  /*
   * Parámetros:
   *   - tablero          → array de 42 con el estado actual (o simulado).
   *   - modificarEstado  → si es true actualiza React state y lanza confeti.
   *                         Si es false (caso IA) solo devuelve el resultado.
   * Retorna: "🔵", "🔴", "Empate" o null (partida en curso).
   */
  const checkWin = (tablero, modificarEstado = true) => {
    // 1️⃣ Recorremos todas las líneas ganadoras
    for (const linea of winMatrix) {
      /* linea = [idx1, idx2, idx3, idx4] */
      const fichas = linea.map((index) => tablero[index]);

      // ¿Ganó Jugador 1?
      if (fichas.every((f) => f === jugador1)) {
        if (modificarEstado) {
          setGanador(jugador1);
          confetti();
        }
        return jugador1;
      }
      // ¿Ganó Jugador 2?
      if (fichas.every((f) => f === jugador2)) {
        if (modificarEstado) {
          setGanador(jugador2);
          confetti();
        }
        return jugador2;
      }
    }

    // 2️⃣ ¿Tablero lleno? → empate
    if (tablero.every((ficha) => ficha !== null)) {
      if (modificarEstado) setGanador("Empate");
      return "Empate";
    }

    // 3️⃣ Ningún caso anterior → la partida sigue
    return null;
  };

  /* ───────────────────────── 5. FUNCIONES DE JUEGO (humanas) ───────────────────────── */
  const cambiarTurno = () => {
    setTurno(turno === jugador1 ? jugador2 : jugador1);
  };

  /* Reinicia a estado inicial. */
  const reset = () => {
    setTablero(Array(42).fill(null));
    setTurno(jugador1);
    setGanador(null);
  };

  /*
   * meterFicha(columna) ✔️
   *  - Si la partida acabó, early‑return.
   *  - Clona el tablero (inmutabilidad React).
   *  - Recorre los índices de esa columna de abajo a arriba.
   *  - Primera casilla libre → coloca ficha.
   *  - Actualiza tablero y chequea victoria.
   *  - Si no hay ganador, cambia turno.
   */
  const meterFicha = (columna) => {
    if (ganador) return; // ❌ No jugamos si ya acabó
    const nuevoTablero = [...tablero];

    for (const index of columnasMatrix[columna]) {
      if (nuevoTablero[index] === null) {
        nuevoTablero[index] = turno; // Colocar ficha ⚪/🔴
        setTablero(nuevoTablero); // Actualizar estado

        const resultado = checkWin(nuevoTablero); // ¿Alguien ganó?
        if (resultado === null) cambiarTurno(); // Si sigue, cambiar turno
        return; // Salir tras colocar la ficha
      }
    }
  };

  /* ───────────────────────── 6. IA – HELPERS ───────────────────────── */
  /*
   * 6.1 posiblesMovimientos(tablero): devuelve array con columnas (0‑6) disponibles.
   */
  const posiblesMovimientos = (tablero) => {
    const columnasDisponibles = [];

    // Para cada columna (0..6)…
    for (let col = 0; col < columnas; col++) {
      // Recorre los índices verticalmente – abajo→arriba
      for (const idx of columnasMatrix[col]) {
        if (tablero[idx] === null) {
          columnasDisponibles.push(col);
          break; // Pasamos a siguiente columna
        }
      }
    }
    return columnasDisponibles;
  };

  /*
   * 6.2 simularMovimiento: clona -> coloca ficha -> devuelve nuevo tablero (no muta el real)
   */
  const simularMovimiento = (tablero, columna, jugador) => {
    const copia = [...tablero]; // Clonar
    for (const idx of columnasMatrix[columna]) {
      if (copia[idx] === null) {
        copia[idx] = jugador;
        break;
      }
    }
    return copia;
  };

  /*
   * 6.3 evaluarGanador: traduce resultado string → número para comparar.
   *      Ganar    →  +1000
   *      Empatar  →     0
   *      Perder   →  -1000
   */
  const evaluarGanador = (resultado, jugador) => {
    if (resultado === jugador) return +1000;
    if (resultado === "Empate" || resultado === null) return 0;
    return -1000; // Perdió
  };

  /* ───────────────────────── 7. IA – ALGORITMO ───────────────────────── */
  /*
   * 7.1 negamax (...)
   * Algoritmo recursivo = corazón de la IA.
   *   - profundidad: cuántos niveles quedan por explorar.
   *   - alpha / beta: límites para la poda (mejor de MAX / peor de MIN).
   *   - jugador: la ficha que moverá en este nivel.
   * Devuelve la puntuación **máxima posible** desde este estado.
   */
  const negamax = (tablero, profundidad, alpha, beta, jugador) => {
    // Paso A: comprobar fin de partida o profundidad límite
    const estadoActual = checkWin(tablero, false);
    if (estadoActual !== null || profundidad === 0) {
      return evaluarGanador(estadoActual, jugador);
    }

    // Paso B: inicializar mejor puntuación a -∞ (porque buscamos máximo)
    let maxEval = -Infinity;

    // Paso C: iterar sobre todas las columnas legales
    for (const col of posiblesMovimientos(tablero)) {
      // 1. Simular tablero con la jugada
      const tableroSim = simularMovimiento(tablero, col, jugador);

      // 2. Cambiar jugador para la siguiente llamada recursiva
      const oponente = jugador === jugador1 ? jugador2 : jugador1;

      // 3. Llamada recursiva (¡y negamos el resultado!)
      const valor = -negamax(
        tableroSim,
        profundidad - 1,
        -beta, // alpha'  = -beta
        -alpha, // beta'   = -alpha
        oponente
      );

      // 4. Actualizar mejor valoración
      if (valor > maxEval) maxEval = valor;

      // 5. Actualizar alpha (mejor opción local de MAX)
      alpha = Math.max(alpha, valor);

      // 6. Poda: si alpha >= beta, cortar el bucle
      if (alpha >= beta) break;
    }

    // Paso D: devolver mejor valor encontrado
    return maxEval;
  };

  /*
   * 7.2 mejorMovimientoIA (...)
   * Wrapper: recorre todas las columnas y llama a negamax para ver cuál es la mejor.
   * Devuelve SOLO la mejor columna (0‑6).
   */
  const mejorMovimientoIA = (tablero, profundidad, jugador) => {
    let mejorValor = -Infinity; // Peor caso posible
    let mejorColumna = null;

    // Evaluamos cada posible columna...
    for (const col of posiblesMovimientos(tablero)) {
      const tableroSim = simularMovimiento(tablero, col, jugador);
      const oponente = jugador === jugador1 ? jugador2 : jugador1;
      const valor = -negamax(
        tableroSim,
        profundidad - 1,
        -Infinity,
        Infinity,
        oponente
      );

      if (valor > mejorValor) {
        mejorValor = valor;
        mejorColumna = col;
      }
    }
    return mejorColumna; // Puede ser null si no hay movimientos (tablero lleno)
  };

  /* ───────────────────────── 8. RENDER UI ───────────────────────── */
  /* Creamos 7 botones, uno por columna. Al clicar → meterFicha(columna) */
  const botonesColumnas = Array(columnas)
    .fill(null)
    .map((_, col) => (
      <button key={col} onClick={() => meterFicha(col)}>
        {col + 1}
      </button>
    ));

  return (
    <>
      {/* ---------------- Header: título + selector profundidad */}
      <header>
        <h1>4 LÍNEA (IA Minimax)</h1>
        <label htmlFor="profundidad">Profundidad IA: </label>
        <select
          id="profundidad"
          value={profundidad}
          onChange={(e) => {
            setProfundidad(Number(e.target.value)); // Important: convertir a número
            reset(); // Reiniciar partida al cambiar dificultad
          }}
        >
          <option value={0}>Sin IA</option>
          <option value={2}>2</option>
          <option value={4}>4</option>
          <option value={6}>6</option>
        </select>
        <p>Turno: {turno}</p>
      </header>

      {/* ---------------- Tablero + botones de columnas */}
      <section
        style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}
      >
        {botonesColumnas}
        {tablero.map((ficha, idx) => (
          <Box key={idx} ficha={ficha} />
        ))}
      </section>

      {/* ---------------- Footer: mensajes de ganador + reset */}
      <footer>
        {ganador ? (
          <>
            <p>{ganador === "Empate" ? "Empate" : `Ha ganado ${ganador}`} 🎉</p>
            <button style={{ marginTop: 10, width: "100%" }} onClick={reset}>
              Jugar de nuevo
            </button>
          </>
        ) : (
          <button style={{ marginTop: 10, width: "100%" }} onClick={reset}>
            Reiniciar Juego
          </button>
        )}
      </footer>
    </>
  );
};
