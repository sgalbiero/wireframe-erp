# Fluxos e especificações de interface

Esta especificação traduz as decisões recebidas. Consulte também [decisões](decisoes.md).

## Navegação

Disponibilizar acesso direto a **Produtos**, **Estoque** e **Vendas** em computador e celular. A página inicial pode levar a uma dessas áreas sem criar uma etapa obrigatória. Exibir estados vazios que orientem a próxima ação.

## 1. Cadastro de produto

1. Acessar Produtos e iniciar cadastro.
2. Informar nome, preço de custo e preço de venda; adicionar as cores e, em seguida, informar uma única vez os tamanhos disponíveis para todas elas; salvar.
3. Validar campos obrigatórios e mostrar mensagens junto aos campos quando necessário.
4. Confirmar o salvamento e oferecer **Adicionar estoque** e uma opção para permanecer na área de produtos.
5. Se aceitar, abrir Estoque com o produto ou combinação recém-cadastrada pré-selecionada quando possível.

Cada combinação deve ser explícita e única; não gerar combinações inexistentes automaticamente. Não inserir fornecedor, categoria ou local de estoque.

## 2. Entrada e saída de estoque

1. Acessar Estoque, selecionar um produto pelo nome e visualizar imediatamente as cores e tamanhos disponíveis para ele.
2. Escolher uma combinação existente, selecionar **Entrada** ou **Saída** e informar quantidade inteira positiva.
3. Exibir o saldo da combinação, validar e confirmar a movimentação.
4. Na saída, atualizar o saldo e mostrar confirmação. Na entrada, atualizar o saldo e abrir o modal de etiquetas.

Não apresentar tela de auditoria ou exigir motivo de movimentação. Tratar ausência de produtos, combinação não selecionada, quantidade inválida e saída acima do saldo.

## 3. Modal de etiquetas

Após a entrada confirmada, identificar a combinação e informar que a impressão é simbólica. **IMPRIMIR** executa a ação simulada e mostra que ela foi concluída. Fechar ou cancelar o modal não reverte o estoque que já foi adicionado. Gerar simbolicamente uma etiqueta por unidade da entrada. Unidades da mesma combinação compartilham código, que deve ser reconhecido na venda.

## 4. Venda e listagem

1. Em Vendas, exibir listagem e ação **Nova venda**. Se não houver vendas, indicar isso claramente.
2. Iniciar venda, selecionar o produto pelo nome e a cor para escolher o tamanho; manter o código da etiqueta como alternativa recolhida, aceitando leitor que envia texto ou digitação manual.
3. Ao receber um código válido, identificar nome, cor e tamanho e incluir o item. Bipes repetidos da mesma combinação aumentam a quantidade, desde que haja saldo.
4. Exibir itens, quantidades, preços de venda e total; permitir corrigir ou remover itens. Informar código desconhecido ou saldo insuficiente sem limpar a venda.
5. Ao concluir, validar novamente o saldo, efetuar baixa uma única vez, confirmar e exibir a venda na listagem.

Como hipótese de implementação, a confirmação do código pode ocorrer pelo Enter enviado por leitor ou digitado pelo usuário; o mecanismo exato deve ser verificável no protótipo. A listagem mostra identificador, data e total, com acesso aos itens da venda.

## Estados e acessibilidade

As telas precisam funcionar em computador e celular, com controles tocáveis, rótulos visíveis, navegação por teclado e foco evidente. O modal deve receber foco ao abrir, permitir fechamento pelo teclado e devolver foco ao controle adequado. Os avisos de sucesso e erro devem ser claros e acessíveis. O campo de código não deve prender o foco nem impedir que o usuário acesse os demais controles.

