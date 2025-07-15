# 4línea 🔴🔵

Juego de **Conecta 4** moderno desarrollado con React y Vite. Incluye modo jugador contra jugador y contra IA inteligente. Proyecto educativo con arquitectura limpia y bien estructurada, ideal para aprender React, hooks y separación de responsabilidades.

📁 **[Código fuente](https://github.com/jlizancandela/4linea)**

---

## ✨ Características

- 🎮 **Modo PvP**: Jugador contra jugador local
- 🤖 **IA Inteligente**: Algoritmo **Negamax con poda alfa-beta**
- ⚛️ **React + Vite**: Desarrollo moderno y rápido
- 🧩 **Arquitectura limpia**: Lógica separada en módulos
- 📦 **Custom Hook**: `use4linea` para gestión de estado
- 🎉 **Efectos visuales**: Animaciones y confeti al ganar
- 🎨 **Diseño responsivo**: Optimizado para móvil y escritorio
- 🔄 **Reinicio rápido**: Empezar nueva partida al instante
- 🏆 **Detección de empate**: Manejo completo de estados de juego

---

## 🛠️ Tecnologías utilizadas

- **Frontend**: React 18, Vite
- **Lenguaje**: JavaScript (ES6+)
- **Estilos**: CSS3 personalizado
- **Algoritmo IA**: Negamax con poda alfa-beta
- **Herramientas**: ESLint, npm
- **Deploy**: GitHub Pages

---

## 📁 Estructura del proyecto

```
4linea/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── board/
│   │   ├── header/
│   │   ├── footer/
│   │   └── modal/
│   ├── logic/
│   ├── hooks/
│   ├── constants.js
│   ├── main.jsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.js
```

---

## 🚀 Instalación

```bash
git clone https://github.com/jlizancandela/4linea.git
cd 4linea
npm install
npm run dev
```

Abre el navegador en `http://localhost:5173`.

### 📄 Comandos disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Construir para producción
npm run preview      # Vista previa de la construcción
npm run lint         # Ejecutar ESLint
```

---

## 🕹️ Cómo jugar

- Haz clic en la columna donde quieras soltar tu ficha.
- Primer turno: 🔴 (jugador 1), segundo: 🔵 (jugador 2).
- Cuando alguien gana, aparece un modal con confeti 🎉.
- Modo IA con **Negamax con poda alfa-beta** (función ya integrada en `logic/ia.js`).

---

## 📌 Archivos clave

| Archivo                           | Función principal                                      |
|----------------------------------|--------------------------------------------------------|
| `use4linea.js`                   | Hook personalizado que maneja el estado del juego     |
| `logic.js`                       | Verifica combinaciones ganadoras, tablero lleno, etc. |
| `ia.js`                          | Lógica de IA con **Negamax + poda alfa-beta**         |
| `App.jsx`                        | Componente principal del juego                        |
| `Box.jsx`, `board.jsx`           | Renderizado del tablero y celdas                      |
| `Modal.jsx`                      | Modal emergente al finalizar la partida               |


---

## 📄 Licencia

MIT © 2025 [Jorge Lizán Candela](https://github.com/jlizancandela)

---

🎆 ¡Gracias por visitar el proyecto! No olvides dejar una ⭐ si te gustó.
