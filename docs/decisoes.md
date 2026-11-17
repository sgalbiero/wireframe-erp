# Decisões de produto e arquitetura

## Decisões confirmadas

- O cadastro contém nome, preço de custo e preço de venda. Cores são adicionadas primeiro e tamanhos depois, em etapas separadas para tornar o fluxo claro e permitir controle.
- Cada combinação cadastrada de produto, cor e tamanho tem um código compartilhado por suas unidades. Não criar identificador individual para cada unidade física. Exemplo: cinco unidades do mesmo modelo, cor e tamanho compartilham o código da combinação.
- Na entrada, gerar simbolicamente uma etiqueta por unidade adicionada. A ação de imprimir é simbólica.
- Produtos, saldos e vendas devem persistir após reiniciar o servidor. Usar armazenamento local simples, escolhido e documentado na implementação.
- A listagem de vendas apresenta identificador, data e total, além de permitir consultar itens e quantidades.

## Premissas de implementação

- Cores e tamanhos devem ser associados explicitamente para evitar combinações inexistentes. A interface deve mostrar claramente a cor à qual os tamanhos estão sendo adicionados.
- Preços pertencem ao produto; a venda registra o preço de venda aplicado em cada item no momento da conclusão, preservando o histórico caso o cadastro seja alterado depois.
- Quantidades são inteiros positivos; saídas e vendas não podem produzir saldo negativo. A conclusão baixa o saldo uma única vez.
- Fechar o modal de etiquetas não desfaz a entrada já confirmada.
- Não serão realizados testes com participantes nesta fase.
