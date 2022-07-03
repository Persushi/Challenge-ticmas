import express from "express"
import axios from "axios"
var router = express.Router();

//lo correcto es modularizar por servicios, etc
const IP_API = 'http://ip-api.com/json/'
const WEATHER_API = 'https://api.openweathermap.org/data/2.5'

router.get('/location', async function (req, res) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
    // para facilitar la operación para conseguir la ip pública se descargó la libreria que internamente hace una consulta
    // http para obtener la ip, al hacer los testeos en local usaría la ip privada con lo que no es posible consultar
    // al servicio para conseguir la dirección desde donde se consulta
    const response = (await axios.get(`${IP_API}${ip}`)).data
    res.send(response)
})
router.get('/current/:city?', async function (req, res) {
    //en el documento se pidió que tambien se devuelvan los datos de ubicación por ip-api, ese dato solo es obtenible con la ip
    //más no con una ciudad indicada, ademas que puede haber una falta de precisión usando nombres de ciudades
    //se puede agregar en la respuesta pero por una cuestión de incosistencia de datos preferí no mandar la información de ubicacion
    try {
        if (req.params.city) {
            const weather = (await axios.get(`${WEATHER_API}/weather?q=${req.params.city}&&appid=${process.env.API_KEY}`)).data
            return res.send(weather)
        }
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
        const response = (await axios.get(`${IP_API}${ip}`)).data
        const weather = (await axios.get(`${WEATHER_API}/weather?lat=${response.lat}&lon=${response.lon}&&appid=${process.env.API_KEY}`)).data
        return res.send(weather)

    }
    catch {
        return res.sendStatus(404)
    }


})
router.get('/forecast/:city?', async function (req, res) {
    try {
        if (req.params.city) {
            const weather = (await axios.get(`${WEATHER_API}/forecast?q=${req.params.city}&units=metric&lang=ES&appid=${process.env.API_KEY}`)).data
            return res.send(weather)
        }
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
        const response = (await axios.get(`${IP_API}${ip}`)).data
        const weather = (await axios.get(`${WEATHER_API}/forecast?lat=${response.lat}&lon=${response.lon}&units=metric&lang=ES&appid=${process.env.API_KEY}`)).data
        return res.send(weather)

    }
    catch {
        return res.sendStatus(404)
    }
})

export default router
