import { CaixaDaLanchonete } from "./caixa-da-lanchonete.js";

const caixaDaLanchonete = new CaixaDaLanchonete()

const result = caixaDaLanchonete.calcularValorDaCompra('credito', ['cafe,1', 'sanduiche,1', 'queijo,1'])

console.log(result)