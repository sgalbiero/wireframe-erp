# Estoque: especificação funcional

## Objetivo

Manter o saldo por combinação produto + cor + tamanho, com entrada e saída simples, sem local, fornecedor, motivo, detalhamento ou auditoria de movimentações.

## Fluxo

1. Selecionar produto por nome; após a seleção, apresentar imediatamente suas cores e tamanhos existentes. Seleções dependentes devem limpar opções incompatíveis quando o produto ou a cor mudar.
2. Selecionar combinação e consultar o saldo atual.
3. Selecionar **ENTRADA** ou **SAÍDA** e informar quantidade inteira positiva.
4. Confirmar: entrada soma ao saldo; saída subtrai. A operação deve ser persistida antes da confirmação ao usuário.
5. Entrada confirmada abre o modal de etiquetas; saída confirmada apresenta feedback e saldo atualizado.

## Validações

- Produto e combinação precisam existir; a quantidade deve ser inteira, positiva e finita.
- Saída não pode exceder o saldo. Mensagem informa o saldo disponível, mantendo a seleção.
- O servidor deve validar tudo novamente, inclusive combinações que não pertençam ao produto selecionado.
- Não registrar uma movimentação duas vezes por clique repetido ou reenvio acidental.
- Se a gravação falhar, não informar sucesso nem abrir modal de etiquetas; preservar o formulário quando possível.

## Aceite

Adicionar cinco unidades de uma combinação com saldo zero resulta em saldo cinco e abre o modal. Retirar duas resulta em saldo três. Tentar retirar quatro mantém saldo três e informa o erro. Saldos permanecem após reiniciar o servidor.
