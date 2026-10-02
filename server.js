const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.get('/', (req, res) => {
    res.json({ 
        status: "Online", 
        app: "Yendo! Backend Cloud P2P", 
        ubicacion: "Resistencia, Chaco",
        aliasCobro: "yendo.creditos (Personal Pay - Gabriel Romano)"
    });
});

io.on('connection', (socket) => {
    console.log(`[CONEXIÓN CLOUD] Dispositivo conectado: ${socket.id}`);

    socket.on('solicitar_viaje', (datosViaje) => {
        console.log(`[VIAJE] Solicitud de ${datosViaje.origen} a ${datosViaje.destino}`);
        io.emit('nuevo_viaje_disponible', datosViaje);
    });

    socket.on('finalizar_viaje_cliente', (viaje) => {
        console.log(`[VIAJE COMPLETADO] Ruta: ${viaje.ruta} - Monto: $${viaje.monto}`);
        io.emit('viaje_completado_broadcast', viaje);
    });

    socket.on('registrar_recarga_cliente', (recarga) => {
        console.log(`[RECARGA] +${recarga.creditos} créditos por $${recarga.precio}`);
        io.emit('recarga_completada_broadcast', recarga);
    });

    socket.on('disconnect', () => {
        console.log(`[DESCONEXIÓN] Dispositivo desconectado: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor Cloud Yendo! corriendo en puerto ${PORT}`);
});
