import { use4linea } from "../hooks/use4linea";
import { Header } from "./header/header";
import { Board } from "./board/board";
import { Footer } from "./footer/Footer";
import { Modal } from "./modal/Modal";

export const App = () => {
  const { tablero, turno, ganador, meterFicha, reset, setProfundidad } =
    use4linea();

  return (
    <>
      <Header setProfundidad={setProfundidad} reset={reset} turno={turno} />
      <Board tablero={tablero} meterFicha={meterFicha} />
      <Footer ganador={ganador} reset={reset} />
      {ganador && <Modal reset={reset} ganador={ganador} />}
    </>
  );
};
