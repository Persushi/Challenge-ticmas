import express from "express"
import user from '../mock/user.js'
import constants from "../utils/constants.js"
let router = express.Router();
let timeout = false;

router.get("/cuenta", async (req, res) => {
    if (timeout) {
        return res.send(constants)
    }
    res.send({
        nombre: user.nombre,
        apellido: user.apellido,
        credito: user.credito,
        saldo: user.saldo.debito
    })
})

router.get("/historial", async (req, res) => {
    if (timeout) {
        return res.send(constants.MESSAGE_IN_PROCESS)
    }
    res.send(user.historial)
})

router.post("/debito", async (req, res) => {
    const { monto, operacion } = req.body
    if (timeout) {
        return res.send(constants.MESSAGE_IN_PROCESS)
    }
    if (monto < 0 || typeof monto !== "number") {
        return res.send(constants.INVALID)
    }
    if (operacion) {
        user.saldo.debito = user.saldo.debito + monto
    } else {
        if (user.saldo.debito - monto < 0) {
            return res.send(constants.INSUFFICIENT_FONDS)
        }
        user.saldo.debito = user.saldo.debito - monto
    }
    timeout = true
    let saldo = user.saldo.debito
    user.historial.push(
        {
            fecha: new Date().toISOString().slice(0, 10),
            tipo: operacion ? "Acreditación" : "Debitación",
            saldo_anterior: saldo,
            monto: monto,
            saldo_actual: user.saldo.debito
        }
    )
    res.send({ message: `Transaccion completada con éxito, debito actual $${user.saldo.debito}` })
    setTimeout(() => {
        timeout = false
    }, 5000)
})
router.post("/credito", async (req, res) => {
    const { credito, cuotas, nombre } = req.body
    if (timeout) {
        return res.send(constants.MESSAGE_IN_PROCESS)
    }
    if (credito / cuotas > user.credito.maximo) {
        return res.send(constants.MAX_LIMIT_ERROR)
    }
    timeout = true
    let saldo = user.credito.maximo
    user.credito.maximo = user.credito.maximo - credito / cuotas
    user.credito.deuda = user.credito.deuda + credito

    user.historial.unshift(
        {
            nombre: nombre,
            fecha: new Date().toISOString().slice(0, 10),
            tipo: "Credito",
            credito_anterior: saldo,
            cuotas: cuotas,
            cuotas_restantes: cuotas,
            monto: credito,
            monto_mensual: credito / cuotas,
            credito_maximo_actual: user.credito.maximo,
            deuda_actual: user.credito.deuda
        }
    )

    res.send(user.historial[0])
    setTimeout(() => {
        timeout = false
    }, 5000)

})

router.post("/pagar/:nombre", async (req, res) => {
    if (timeout) {
        return res.send(constants.MESSAGE_IN_PROCESS)
    }
    const index = user.historial.findIndex((e) => {
        return (e.nombre == req.params.nombre)
    })
    if (user.historial[index].cuotas_restantes === 0 || user.historial[index] === undefined) {
        return res.send(constants.NOT_FOUND)
    }
    let saldo = user.saldo.debito
    if (user.saldo.debito - user.historial[index].monto_mensual < 0) {
        return res.send(constants.INSUFFICIENT_FONDS)
    }
    timeout = true
    user.saldo.debito = user.saldo.debito - user.historial[index].monto_mensual
    user.historial.unshift(
        {
            nombre: user.historial[index].nombre,
            fecha: new Date().toISOString().slice(0, 10),
            tipo: "Pago de Credito",
            cuotas: user.historial[index].cuotas,
            cuotas_restantes: user.historial[index].cuotas_restantes - 1,
            saldo_anterior: saldo,
            monto_mensual: user.historial[index].monto_mensual,
            saldo_actual: user.saldo.debito,
        }
    )
    user.credito.deuda - user.historial[index + 1].monto_mensual
    if (user.historial[0].cuotas_restantes === 0) {
        user.credito.maximo = user.credito.maximo + user.historial[index + 1].monto_mensual
    }
    res.send(user.historial[0])
    setTimeout(() => {
        timeout = false
    }, 5000)

})

export default router