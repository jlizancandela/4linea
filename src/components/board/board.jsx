import { Botones } from "./botones";
import { Box } from "./Box";

export const Board = ({ tablero, meterFicha }) => (
  <section className="grid grid-cols-7 my-5">
    <Botones meterFicha={meterFicha} />
    {tablero.map((casilla, index) => (
      <Box key={index} ficha={casilla} />
    ))}
  </section>
);
