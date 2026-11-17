# Vendas: especificação funcional

## Tela de vendas

Apresentar listagem de vendas concluídas com identificador, data/hora e total, acesso aos itens e ação **Nova venda**. Exibir estado vazio quando não houver vendas. Produtos sem saldo não podem ser vendidos; informar como proceder quando não houver estoque disponível.

## Nova venda

1. Destacar campo de código; dar foco inicial quando apropriado e aceitar texto seguido de Enter, inclusive digitado manualmente.
2. Resolver código para produto, cor e tamanho. Incluir uma unidade por leitura válida; leituras repetidas incrementam a quantidade.
3. Exibir itens, quantidade, preço unitário e subtotal, além do total. Permitir corrigir quantidades ou remover itens sem exigir leitura novamente.
4. Informar código desconhecido e saldo insuficiente sem limpar carrinho; não prender o foco no campo.
5. Ao concluir, validar novamente as quantidades e saldos no servidor, registrar venda e baixar estoque como operação única. Apresentar confirmação e a venda na listagem.

## Regras

- O carrinho não altera o estoque antes da conclusão. Quantidade deve ser inteira e positiva e não exceder o saldo disponível.
- Não concluir carrinho vazio. Uma conclusão repetida não deve gerar venda duplicada nem segunda baixa.
- Persistir identificador, data/hora, combinação, nome/cor/tamanho apresentados, quantidade, preço unitário aplicado e total. Preservar os dados históricos mesmo se o cadastro mudar.
- Calcular moeda em centavos; total é soma de preço unitário de venda multiplicado por quantidade. Preço de custo não compõe o total da venda.
- Se qualquer item estiver sem saldo suficiente ou houver falha de gravação, não registrar venda nem efetuar baixa parcial; manter itens para correção.
- Pagamento real, emissão fiscal, descontos, trocas e cancelamento de venda concluída não estão no escopo definido.

## Aceite

Duas leituras do mesmo código mostram duas unidades. Uma venda concluída aparece na listagem com total correto e reduz o saldo em duas unidades, inclusive após reiniciar o servidor. Código inválido e tentativa de venda acima do saldo não alteram o estoque.
