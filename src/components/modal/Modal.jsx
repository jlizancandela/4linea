import confetti from "canvas-confetti";
import { useEffect } from "react";

export const Modal = ({ reset, ganador }) => {
  useEffect(() => {
    ganador && confetti();
  }, [ganador]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50"
    >
      <div className="bg-white p-5 rounded-lg w-1/2 h-50 flex flex-col items-center justify-center gap-5">
        <p className="text-2xl text-center">Ha ganado {ganador}!!!!🎉</p>
        <button
          className="bg-blue-500 text-white p-2 rounded-lg"
          onClick={reset}
          autoFocus
        >
          Jugar de nuevo
        </button>
      </div>
    </div>
  );
};
