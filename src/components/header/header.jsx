export const Header = ({ setProfundidad, reset, turno }) => {
  return (
    <header>
      <h1 className="text-4xl text-center m-5">4Linea</h1>
      <section className="flex justify-between">
        <div>
          <label className="text-lg" htmlFor="profundidad">
            Profundidad IA:
          </label>
          <select
            className="border border-gray-300 rounded-lg p-2 mx-5"
            id="profundidad"
            onChange={(e) => {
              setProfundidad(e.target.value);
              reset();
            }}
          >
            <option value="0">Sin IA</option>
            <option value="2">2</option>
            <option value="4">4</option>
            <option value="6">6</option>
          </select>
        </div>
        <p className="text-lg">Turno: {turno}</p>
      </section>
    </header>
  );
};
