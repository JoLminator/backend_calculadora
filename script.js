// 🟢 Capturamos los elementos del DOM
const boton = document.getElementById("cambiarColor");
const inputNombre = document.getElementById("nombreUsuario");
const botonSaludar = document.getElementById("saludar");
const mensajeSaludo = document.getElementById("mensajeSaludo");
const botonToggle = document.getElementById("toggleTexto");
const texto = document.getElementById("texto");
const num1 = document.getElementById("num1");
const num2 = document.getElementById("num2");
const resultado = document.getElementById("resultado");
const botonLimpiar = document.getElementById("limpiar");
const historial = document.getElementById("historial");
const botonModo = document.getElementById("modoOscuro");
const botonBorrarHistorial = document.getElementById("borrarHistorial");

// 🟢 Cambiar el fondo con color aleatorio
boton.addEventListener("click", function() {
    const colorAleatorio = "#" + Math.floor(Math.random() * 16777215).toString(16);
    document.body.style.backgroundColor = colorAleatorio;
});

// 🟢 Saludo personalizado
botonSaludar.addEventListener("click", function() {
    const nombre = inputNombre.value.trim();
    if (nombre) {
        mensajeSaludo.textContent = `¡Hola, ${nombre}! ¡¡¡Ya te saludé!!! ¿Qué más querés?.`;
        mensajeSaludo.style.color = "lightgreen";
    } else {
        mensajeSaludo.textContent = "Escribí acá tu nombre pues";
        mensajeSaludo.style.color = "red";
    }
});

// 🟢 Mostrar/ocultar texto con animación
if (botonToggle && texto) {
    botonToggle.addEventListener("click", function() {
        if (texto.style.display === "none" || texto.style.display === "") {
            texto.style.display = "block";
            setTimeout(() => texto.style.opacity = "1", 10);
        } else {
            texto.style.opacity = "0";
            setTimeout(() => texto.style.display = "none", 500);
        }
    });
}

// 🔹 Función para agregar operaciones al historial en el servidor
async function agregarHistorial(operacion, valor1, valor2, resultado) {
    const textoOperacion = `${valor1} ${operacion} ${valor2} = ${resultado}`;

    // Agregar al historial en la página
    const nuevoItem = document.createElement("li");
    nuevoItem.textContent = textoOperacion;
    historial.appendChild(nuevoItem);

    try {
        // Enviar la operación al servidor
        await fetch("https://backend-calculadora-urnl.onrender.com", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ operacion, valor1, valor2, resultado })
        });
    } catch (error) {
        console.error("Error al guardar en el servidor:", error);
    }
}

// 🔹 Función para cargar el historial desde el servidor
async function cargarHistorial() {
    try {
        const respuesta = await fetch("https://backend-calculadora-urnl.onrender.com");
        const datos = await respuesta.json();

        historial.innerHTML = ""; // Limpiar la lista antes de cargar
        datos.forEach(item => {
            const nuevoItem = document.createElement("li");
            nuevoItem.textContent = `${item.valor1} ${item.operacion} ${item.valor2} = ${item.resultado}`;
            historial.appendChild(nuevoItem);
        });
    } catch (error) {
        console.error("Error al obtener el historial:", error);
    }
}

// 🔹 Cargar el historial al iniciar la página
document.addEventListener("DOMContentLoaded", cargarHistorial);

// 🔹 Función para borrar el historial en el servidor
botonBorrarHistorial.addEventListener("click", async function() {
    try {
        await fetch("https://backend-calculadora-urnl.onrender.com", { method: "DELETE" });
        historial.innerHTML = "";
    } catch (error) {
        console.error("Error al borrar el historial:", error);
    }
});


// 🟢 Cargar historial guardado al iniciar la página
document.addEventListener("DOMContentLoaded", function() {
    const historialGuardado = JSON.parse(localStorage.getItem("historial")) || [];
    historialGuardado.forEach(item => {
        const nuevoItem = document.createElement("li");
        nuevoItem.textContent = item;
        historial.appendChild(nuevoItem);
    });
});

// 🟢 Borrar historial de operaciones
botonBorrarHistorial.addEventListener("click", function() {
    localStorage.removeItem("historial");
    historial.innerHTML = "";
});

// 🟢 Función de cálculo
function calcular(operacion) {
    const valor1 = parseFloat(num1.value);
    const valor2 = parseFloat(num2.value);

    if (isNaN(valor1) || isNaN(valor2)) {
        resultado.textContent = "No sea culiaaaa... poné bien";
        resultado.style.color = "red";
        return;
    }

    let total;
    let simbolo;
    switch (operacion) {
        case "sumar": total = valor1 + valor2; simbolo = "+"; break;
        case "restar": total = valor1 - valor2; simbolo = "-"; break;
        case "multiplicar": total = valor1 * valor2; simbolo = "×"; break;
        case "dividir":
            if (valor2 === 0) {
                resultado.textContent = "lpqtp, No se puede dividir por cero.";
                resultado.style.color = "red";
                return;
            }
            total = valor1 / valor2;
            simbolo = "÷";
            break;
    }

    resultado.textContent = `Y, es más o menos: ${total}`;
    resultado.style.color = "lightgreen";
    agregarHistorial(simbolo, valor1, valor2, total);
}

// 🟢 Asignamos eventos a los botones de operaciones
document.getElementById("sumar").addEventListener("click", () => calcular("sumar"));
document.getElementById("restar").addEventListener("click", () => calcular("restar"));
document.getElementById("multiplicar").addEventListener("click", () => calcular("multiplicar"));
document.getElementById("dividir").addEventListener("click", () => calcular("dividir"));

// 🟢 Limpiar la calculadora
botonLimpiar.addEventListener("click", function() {
    num1.value = "";
    num2.value = "";
    resultado.textContent = "Y, es más o menos: ";
    resultado.style.color = "yellow";
});

// 🟢 Modo oscuro/claro
botonModo.addEventListener("click", function() {
    document.body.classList.toggle("modo-oscuro");
});

// 🟢 Operaciones avanzadas (potencia, raíz cuadrada, porcentaje)
document.getElementById("potencia").addEventListener("click", function() {
    const valor1 = parseFloat(num1.value);
    const valor2 = parseFloat(num2.value);
    if (isNaN(valor1) || isNaN(valor2)) {
        resultado.textContent = "No sea culiaaaa... poné bien";
        resultado.style.color = "red";
        return;
    }
    const total = Math.pow(valor1, valor2);
    resultado.textContent = `${valor1} ^ ${valor2} = ${total}`;
    resultado.style.color = "lightgreen";
    agregarHistorial("^", valor1, valor2, total);
});

document.getElementById("raiz").addEventListener("click", function() {
    const valor1 = parseFloat(num1.value);
    if (isNaN(valor1) || valor1 < 0) {
        resultado.textContent = "No se puede calcular raíz de un negativo, logi.";
        resultado.style.color = "red";
        return;
    }
    const total = Math.sqrt(valor1);
    resultado.textContent = `√${valor1} = ${total}`;
    resultado.style.color = "lightgreen";
    agregarHistorial("√", valor1, "", total);
});

document.getElementById("porcentaje").addEventListener("click", function() {
    const valor1 = parseFloat(num1.value);
    const valor2 = parseFloat(num2.value);
    if (isNaN(valor1) || isNaN(valor2)) {
        resultado.textContent = "Poné números válidos, wachín.";
        resultado.style.color = "red";
        return;
    }
    const total = (valor1 * valor2) / 100;
    resultado.textContent = `${valor1}% de ${valor2} = ${total}`;
    resultado.style.color = "lightgreen";
    agregarHistorial("% de", valor1, valor2, total);
});

const SERVER_URL = "https://backend-calculadora-urnl.onrender.com";
