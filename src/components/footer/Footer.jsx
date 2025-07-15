export const Footer = ({ ganador, reset }) => {
  return (
    <footer>
      {!ganador && (
        <button
          onClick={reset}
          className="w-full mt-2 bg-blue-500 text-white p-2 rounded-lg"
        >
          Reiniciar Juego
        </button>
      )}
    </footer>
  );
};
