# Challenge-ticmas

Backend rapido con express nodejs.

Para inicializar, ejecutar los siguientes comandos

> npm install

> npm run dev 

a continuación los endpoints y como ejecutarlos correctamente

GET /v1/cuenta
acá hace una vista previa a la única cuenta del usuario con unos datos básicos

GET /v1/historial
devuelve un array de objetos con el historial de transacciones de debito(acreditaciones y debitaciones), credito y pagos de credito

POST /v1/debito
requiere el siguiente json
{"monto": number, "operacion": boolean}
el monto, siempre de un valor positivo con el que se trabaja segun el tipo de operacion
operacion true es una operacion de acreditación, es decir, se le suma saldo al debito
operacion false es una operacion de debitaciones, es decir, se le resta al saldo

POST /v1/credito
requiere el siguiente json
{"credito": number, "cuotas": boolean, "nombre": string}
el credito es el valor total del prestamo a pedir, se resta del limite de la tarjeta según el valor de las cuotas establecidas.
se utiliza el nombre para identificar el credito (como si de un id se tratase) no tiene control de nombres duplicados

POST /v1/pago/:nombre
no requiere json, requiere el parametro que es el nombre del credito a pagar
este endpoint simula hacer un pago de una cuota asociada al nombre del credito debitando directamente sobre el saldo de la cuenta, en caso de no tener saldo suficiente
devuelve un mensaje de error
