import { readFile } from 'fs/promises';

const cardapio = JSON.parse(
  await readFile(new URL('../../cardapio.json', import.meta.url))
);

class CaixaHelper {
  itensExtra = ['chantily', 'queijo']
  metodosDePagamento = ['dinheiro', 'debito', 'credito']

  verificarDescontos = (metodoDePagamentoEscolhido) => {
    switch(metodoDePagamentoEscolhido) {
      case 'dinheiro':
        return 0.95
      case 'debito':
        return 1
      case 'credito':
        return 1.03
    }
  }

  formatarItens = (itens) => itens.map((item, i) => {
    const itemSplitted = item.split(',')
    return ({
      key: i,
      code: itemSplitted[0],
      quantity: parseInt(itemSplitted[1])
    })
  })

  calcularValor = (itens) => {
    itens = this.formatarItens(itens)

    const precoTotalItens = itens.map((item) => {
      const precoTotal = cardapio.find(card => card.code === item.code).value * item.quantity
      return precoTotal
    })

    return precoTotalItens.reduce((acc, curr) => acc + curr)
  }

  formatarValor = (metodoDePagamento, itens) => {
    const total = this.calcularValor(itens)

    const totalComDescontos = total * this.verificarDescontos(metodoDePagamento)

    return `R$ ${totalComDescontos.toFixed(2).replace('.', ',')}`
  }

  validarPedido = (metodoDePagamentoEscolhido, itens) => {
    itens = this.formatarItens(itens)
    let error

    if (!itens.length) error = 'Não há itens no carrinho de compra!'

    itens.forEach((item, i) => {
      if (!cardapio.some(card => card.code === item.code))
        error = 'Item inválido!'
      if (
        item.code === this.itensExtra[0] &&
        !itens.some(itemPrincipal => itemPrincipal.code === 'cafe')
      )
        error = 'Item extra não pode ser pedido sem o principal'
      else if (
        item.code === this.itensExtra[1] &&
        !itens.some(itemPrincipal => itemPrincipal.code === 'sanduiche')
      )
        error = 'Item extra não pode ser pedido sem o principal'

      if (!this.metodosDePagamento.includes(metodoDePagamentoEscolhido))
        error = 'Forma de pagamento inválida!'
    })

    if (itens.length === 1 && this.itensExtra.includes(itens[0].code))
      error = 'Item extra não pode ser pedido sem o principal'

    if (itens.some(item => item.quantity === 0)) error = 'Quantidade inválida!'

    return error
  }

  finalizarPedido = (metodoDePagamento, itens) => {
    const resultadoValidacaoPedido = this.validarPedido(metodoDePagamento, itens)

    if (resultadoValidacaoPedido) return resultadoValidacaoPedido;

    const totalPedido = this.formatarValor(metodoDePagamento, itens)

    return totalPedido
  }

  
}

export default CaixaHelper