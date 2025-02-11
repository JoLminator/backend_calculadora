const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let historial = []; // Aquí se guardarán las operaciones

// Ruta para obtener el historial
app.get("/historial", (req, res) => {
    res.json(historial);
});

// Ruta para guardar una operación en el historial
app.post("/historial", (req, res) => {
    const { operacion, valor1, valor2, resultado } = req.body;
    
    if (!operacion || isNaN(valor1) || isNaN(valor2) || isNaN(resultado)) {
        return res.status(400).json({ error: "Datos inválidos" });
    }

    const nuevaOperacion = { operacion, valor1, valor2, resultado };
    historial.push(nuevaOperacion);

    res.json({ mensaje: "Operación guardada", historial });
});

// Ruta para borrar el historial
app.delete("/historial", (req, res) => {
    historial = [];
    res.json({ mensaje: "Historial borrado" });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
