const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const HISTORIAL_FILE = "historial.json";

// Función para cargar historial desde el archivo
function cargarHistorial() {
    try {
        const data = fs.readFileSync(HISTORIAL_FILE, "utf8");
        return JSON.parse(data);
    } catch (error) {
        return []; // Si hay un error (ej. el archivo no existe), devuelve un historial vacío
    }
}

// Función para guardar historial en el archivo
function guardarHistorial(historial) {
    fs.writeFileSync(HISTORIAL_FILE, JSON.stringify(historial, null, 2));
}

let historial = cargarHistorial(); // Cargar historial al iniciar el servidor

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
    guardarHistorial(historial); // Guardar historial actualizado

    res.json({ mensaje: "Operación guardada", historial });
});

// Ruta para borrar el historial
app.delete("/historial", (req, res) => {
    historial = [];
    guardarHistorial(historial); // Vaciar el archivo JSON también
    res.json({ mensaje: "Historial borrado" });
});

// Ruta de prueba
app.get("/", (req, res) => {
    res.send("Servidor funcionando correctamente");
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
