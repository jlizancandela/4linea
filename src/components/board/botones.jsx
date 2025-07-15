import { columnas } from "../../constants";

export const Botones = ({ meterFicha }) =>
  Array(columnas)
    .fill(null)
    .map((_, index) => (
      <button
        key={index}
        onClick={() => meterFicha(index)}
        className="border border-gray-300 rounded-lg h-7"
      >
        {index + 1}
      </button>
    ));
