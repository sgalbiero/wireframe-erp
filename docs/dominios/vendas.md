# Vendas: especificação funcional

## Tela de vendas

Apresentar listagem de vendas concluídas com identificador, data/hora e total, acesso aos itens e ação **Nova venda**. Exibir estado vazio quando não houver vendas. Produtos sem saldo não podem ser vendidos; informar como proceder quando não houver estoque disponível.

## Nova venda

1. Exibir os produtos pelo nome em um dropdown, sem exigir conhecimento do SKU e sem expandir verticalmente o card.
2. Após selecionar o produto, exibir suas cores em um segundo dropdown. Ao selecionar a cor, mostrar automaticamente os tamanhos e saldos disponíveis como ações rápidas.
3. Manter o SKU como alternativa recolhida: um código exato inclui diretamente sua combinação. Inclusões repetidas incrementam a quantidade.
4. Exibir itens, quantidade, preço unitário e subtotal, além do total. Permitir corrigir quantidades ou remover itens sem exigir nova busca.
5. Informar produto desconhecido e saldo insuficiente sem limpar carrinho; não prender o foco no campo.
6. Ao concluir, validar novamente as quantidades e saldos, registrar venda e baixar estoque na mesma atualização do estado local. Apresentar confirmação e a venda na listagem.

## Regras

- O carrinho não altera o estoque antes da conclusão. Quantidade deve ser inteira e positiva e não exceder o saldo disponível.
- Não concluir carrinho vazio. Uma conclusão repetida não deve gerar venda duplicada nem segunda baixa.
- Persistir identificador, data/hora, combinação, nome/cor/tamanho apresentados, quantidade, preço unitário aplicado e total. Preservar os dados históricos mesmo se o cadastro mudar.
- Calcular moeda em centavos; total é soma de preço unitário de venda multiplicado por quantidade. Preço de custo não compõe o total da venda.
- Se qualquer item estiver sem saldo suficiente ou houver falha de gravação, não registrar venda nem efetuar baixa parcial; manter itens para correção.
- Pagamento real, emissão fiscal, descontos, trocas e cancelamento de venda concluída não estão no escopo definido.

## Aceite

Selecionar um produto pelo nome e uma cor mostra imediatamente os tamanhos disponíveis sem exigir o SKU. Duas inclusões da mesma variação mostram duas unidades. Uma venda concluída aparece na listagem com total correto e reduz o saldo em duas unidades, inclusive após recarregar a página. Produto ou código inválido e tentativa de venda acima do saldo não alteram o estoque.
