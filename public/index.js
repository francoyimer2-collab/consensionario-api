// ─── CONFIGURACIÓN ────────────────────────────────────────
const API_URL = "";

// ─── NAVEGACIÓN ───────────────────────────────────────────

function showSection(sectionName) {
    const allSections = document.querySelectorAll(".formSection");
    allSections.forEach(section => section.classList.add("hidden"));

    const allNavBtns = document.querySelectorAll(".navBtn");
    allNavBtns.forEach(btn => btn.classList.remove("active"));

    const targetSection = document.querySelector(`#${sectionName}`);
    targetSection.classList.remove("hidden");

    const activeBtn = document.querySelector(`#btn${capitalize(sectionName)}`);
    activeBtn.classList.add("active");
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ─── MENSAJES DE RESPUESTA ────────────────────────────────

function showMsg(elementId, text, type) {
    const msgElement = document.querySelector(`#${elementId}`);
    msgElement.textContent = text;
    msgElement.className = `responseMsg ${type}`;

    setTimeout(() => {
        msgElement.textContent = "";
        msgElement.className = "responseMsg";
    }, 3000);
}


// ─── VEHÍCULOS ────────────────────────────────────────────

async function cargarVehiculos() {
    try {
        const res = await fetch(`${API_URL}/vehiculos`);
        const vehiculos = await res.json();
        renderVehiculos(vehiculos);
    } catch (err) {
        console.error("Error al cargar vehículos:", err);
    }
}

function renderVehiculos(vehiculos) {
    const tbody = document.querySelector("#vehiculosBody");
    tbody.innerHTML = "";

    if (vehiculos.length === 0) {
        tbody.innerHTML = `<tr class="emptyRow"><td colspan="9">No hay vehículos registrados</td></tr>`;
        return;
    }

    vehiculos.forEach(v => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${v.id_vehiculo}</td>
            <td>${v.marca}</td>
            <td>${v.modelo}</td>
            <td>${v.ano}</td>
            <td>$${Number(v.precio).toLocaleString("es-CL")}</td>
            <td>${v.color}</td>
            <td>${Number(v.kilometraje).toLocaleString("es-CL")} km</td>
            <td>${v.estado}</td>
            <td><button class="deleteBtn" onclick="eliminarVehiculo(${v.id_vehiculo})">Eliminar</button></td>
        `;
        tbody.appendChild(tr);
    });
}

async function registrarVehiculo() {
    const marca = document.querySelector("#vehiculoMarca").value.trim();
    const modelo = document.querySelector("#vehiculoModelo").value.trim();
    const ano = document.querySelector("#vehiculoAno").value.trim();
    const precio = document.querySelector("#vehiculoPrecio").value.trim();
    const color = document.querySelector("#vehiculoColor").value.trim();
    const kilometraje = document.querySelector("#vehiculoKilometraje").value.trim();
    const estado = document.querySelector("#vehiculoEstado").value;

    if (!marca || !modelo || !ano || !precio || !color || !kilometraje || !estado) {
        showMsg("msgVehiculo", "Por favor completa todos los campos", "error");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/vehiculos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ marca, modelo, ano, precio, color, kilometraje, estado }),
        });

        const data = await res.json();

        if (res.ok) {
            showMsg("msgVehiculo", "Vehículo registrado exitosamente ✓", "success");
            limpiarFormulario(["vehiculoMarca", "vehiculoModelo", "vehiculoAno", "vehiculoPrecio", "vehiculoColor", "vehiculoKilometraje", "vehiculoEstado"]);
            cargarVehiculos();
        } else {
            showMsg("msgVehiculo", data.error || "Error al registrar", "error");
        }
    } catch (err) {
        console.error("Error al registrar vehículo:", err);
        showMsg("msgVehiculo", "Error de conexión con el servidor", "error");
    }
}

async function eliminarVehiculo(id) {
    if (!confirm("¿Estás seguro de que deseas eliminar este vehículo?")) return;

    try {
        const res = await fetch(`${API_URL}/vehiculos/${id}`, { method: "DELETE" });
        const data = await res.json();

        if (res.ok) {
            showMsg("msgVehiculo", "Vehículo eliminado exitosamente ✓", "success");
            cargarVehiculos();
        } else {
            showMsg("msgVehiculo", data.error || "Error al eliminar", "error");
        }
    } catch (err) {
        console.error("Error al eliminar vehículo:", err);
        showMsg("msgVehiculo", "Error de conexión con el servidor", "error");
    }
}


// ─── CLIENTES ─────────────────────────────────────────────

async function cargarClientes() {
    try {
        const res = await fetch(`${API_URL}/clientes`);
        const clientes = await res.json();
        renderClientes(clientes);
        poblarSelectClientes(clientes);
    } catch (err) {
        console.error("Error al cargar clientes:", err);
    }
}

function renderClientes(clientes) {
    const tbody = document.querySelector("#clientesBody");
    tbody.innerHTML = "";

    if (clientes.length === 0) {
        tbody.innerHTML = `<tr class="emptyRow"><td colspan="6">No hay clientes registrados</td></tr>`;
        return;
    }

    clientes.forEach(c => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${c.id_cliente}</td>
            <td>${c.nombre}</td>
            <td>${c.email}</td>
            <td>${c.telefono}</td>
            <td>${c.ciudad}</td>
            <td><button class="deleteBtn" onclick="eliminarCliente(${c.id_cliente})">Eliminar</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function poblarSelectClientes(clientes) {
    const select = document.querySelector("#reservaIdCliente");
    const valorActual = select.value;
    select.innerHTML = `<option value="">-- Seleccionar cliente --</option>`;

    clientes.forEach(c => {
        const option = document.createElement("option");
        option.value = c.id_cliente;
        option.textContent = `${c.nombre} (ID: ${c.id_cliente})`;
        select.appendChild(option);
    });

    // Restaurar selección previa si existía
    if (valorActual) select.value = valorActual;
}

async function registrarCliente() {
    const nombre = document.querySelector("#clienteNombre").value.trim();
    const email = document.querySelector("#clienteEmail").value.trim();
    const telefono = document.querySelector("#clienteTelefono").value.trim();
    const ciudad = document.querySelector("#clienteCiudad").value.trim();

    if (!nombre || !email || !telefono || !ciudad) {
        showMsg("msgCliente", "Por favor completa todos los campos", "error");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/clientes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, email, telefono, ciudad }),
        });

        const data = await res.json();

        if (res.ok) {
            showMsg("msgCliente", "Cliente registrado exitosamente ✓", "success");
            limpiarFormulario(["clienteNombre", "clienteEmail", "clienteTelefono", "clienteCiudad"]);
            cargarClientes();
        } else {
            showMsg("msgCliente", data.error || "Error al registrar", "error");
        }
    } catch (err) {
        console.error("Error al registrar cliente:", err);
        showMsg("msgCliente", "Error de conexión con el servidor", "error");
    }
}

async function eliminarCliente(id) {
    if (!confirm("¿Estás seguro de que deseas eliminar este cliente?")) return;

    try {
        const res = await fetch(`${API_URL}/clientes/${id}`, { method: "DELETE" });
        const data = await res.json();

        if (res.ok) {
            showMsg("msgCliente", "Cliente eliminado exitosamente ✓", "success");
            cargarClientes();
        } else {
            showMsg("msgCliente", data.error || "Error al eliminar", "error");
        }
    } catch (err) {
        console.error("Error al eliminar cliente:", err);
        showMsg("msgCliente", "Error de conexión con el servidor", "error");
    }
}


// ─── RESERVAS ─────────────────────────────────────────────

async function cargarReservas() {
    try {
        const res = await fetch(`${API_URL}/reservas`);
        const reservas = await res.json();
        renderReservas(reservas);
    } catch (err) {
        console.error("Error al cargar reservas:", err);
    }
}

function renderReservas(reservas) {
    const tbody = document.querySelector("#reservasBody");
    tbody.innerHTML = "";

    if (reservas.length === 0) {
        tbody.innerHTML = `<tr class="emptyRow"><td colspan="6">No hay reservas registradas</td></tr>`;
        return;
    }

    reservas.forEach(r => {
        const fecha = new Date(r.fecha_reserva).toLocaleDateString("es-CL");
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${r.id_reserva}</td>
            <td>${fecha}</td>
            <td>${r.tipo_transaccion}</td>
            <td>${r.nombre_cliente}</td>
            <td>${r.marca} ${r.modelo} (${r.ano})</td>
            <td><button class="deleteBtn" onclick="eliminarReserva(${r.id_reserva})">Eliminar</button></td>
        `;
        tbody.appendChild(tr);
    });
}

async function poblarSelectVehiculos() {
    try {
        const res = await fetch(`${API_URL}/vehiculos`);
        const vehiculos = await res.json();

        const select = document.querySelector("#reservaIdVehiculo");
        const valorActual = select.value;
        select.innerHTML = `<option value="">-- Seleccionar vehículo --</option>`;

        vehiculos.forEach(v => {
            const option = document.createElement("option");
            option.value = v.id_vehiculo;
            option.textContent = `${v.marca} ${v.modelo} ${v.ano} — ${v.estado} (ID: ${v.id_vehiculo})`;
            select.appendChild(option);
        });

        if (valorActual) select.value = valorActual;
    } catch (err) {
        console.error("Error al poblar select de vehículos:", err);
    }
}

async function registrarReserva() {
    const fecha_reserva = document.querySelector("#reservaFecha").value;
    const tipo_transaccion = document.querySelector("#reservaTipo").value;
    const id_cliente = document.querySelector("#reservaIdCliente").value;
    const id_vehiculo = document.querySelector("#reservaIdVehiculo").value;

    if (!fecha_reserva || !tipo_transaccion || !id_cliente || !id_vehiculo) {
        showMsg("msgReserva", "Por favor completa todos los campos", "error");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/reservas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fecha_reserva, tipo_transaccion, id_cliente, id_vehiculo }),
        });

        const data = await res.json();

        if (res.ok) {
            showMsg("msgReserva", "Reserva registrada exitosamente ✓", "success");
            limpiarFormulario(["reservaFecha", "reservaTipo", "reservaIdCliente", "reservaIdVehiculo"]);
            cargarReservas();
        } else {
            showMsg("msgReserva", data.error || "Error al registrar", "error");
        }
    } catch (err) {
        console.error("Error al registrar reserva:", err);
        showMsg("msgReserva", "Error de conexión con el servidor", "error");
    }
}

async function eliminarReserva(id) {
    if (!confirm("¿Estás seguro de que deseas eliminar esta reserva?")) return;

    try {
        const res = await fetch(`${API_URL}/reservas/${id}`, { method: "DELETE" });
        const data = await res.json();

        if (res.ok) {
            showMsg("msgReserva", "Reserva eliminada exitosamente ✓", "success");
            cargarReservas();
        } else {
            showMsg("msgReserva", data.error || "Error al eliminar", "error");
        }
    } catch (err) {
        console.error("Error al eliminar reserva:", err);
        showMsg("msgReserva", "Error de conexión con el servidor", "error");
    }
}


// ─── UTILIDADES ───────────────────────────────────────────

function limpiarFormulario(campoIds) {
    campoIds.forEach(id => {
        const campo = document.querySelector(`#${id}`);
        campo.value = "";
    });
}

// ─── EVENT LISTENERS ──────────────────────────────────────

document.querySelector("#btnRegistrarVehiculo").addEventListener("click", registrarVehiculo);
document.querySelector("#btnCargarVehiculos").addEventListener("click", cargarVehiculos);

document.querySelector("#btnRegistrarCliente").addEventListener("click", registrarCliente);
document.querySelector("#btnCargarClientes").addEventListener("click", cargarClientes);

document.querySelector("#btnRegistrarReserva").addEventListener("click", registrarReserva);
document.querySelector("#btnCargarReservas").addEventListener("click", cargarReservas);

document.querySelector("#btnReservas").addEventListener("click", () => {
    cargarClientes();
    poblarSelectVehiculos();
    cargarReservas();
});

// Cargar vehículos al iniciar
cargarVehiculos();
