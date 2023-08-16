import CaixaHelper from "./helpers/caixa.helper.js";

class CaixaDaLanchonete {
    caixaHelper

    constructor() {
        this.caixaHelper = new CaixaHelper()
    }

    calcularValorDaCompra(metodoDePagamento, itens) {
        return this.caixaHelper.finalizarPedido(metodoDePagamento, itens)
    }

}

export { CaixaDaLanchonete };
