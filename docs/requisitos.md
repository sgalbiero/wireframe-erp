# Requisitos do wireframe

## Objetivo e público

Criar um wireframe navegável de baixa fidelidade para validar futuramente um fluxo rápido de controle de estoque e vendas no comércio de calçados. O potencial cliente identificado é a loja **LUIZERA**, situada na Rua Pará de Minas, 311, Centro (Fartura), Nova Serrana - MG. A identificação da loja não comprova a realização de entrevistas ou validação.

O uso principal será em computador. A interface também deve ser utilizável e acessível em dispositivos móveis. A prioridade é clareza, poucas ações e agilidade no atendimento, sem investimento em identidade visual nesta etapa.

## Escopo funcional

### RF01 — Produtos

- Permitir cadastrar um produto com **nome, preço de custo e preço de venda**; adicionar primeiro as cores e, depois, informar os tamanhos uma única vez, em etapas separadas. Criar cada combinação entre as cores e os tamanhos informados, inicialmente sem estoque.
- Após salvar, confirmar o cadastro e recomendar o redirecionamento para adicionar estoque, permitindo que o usuário aceite ou permaneça na área de produtos.
- Disponibilizar os produtos cadastrados para seleção na movimentação de estoque.
- Impedir combinações duplicadas do mesmo produto, cor e tamanho e apresentar mensagem clara.

### RF02 — Estoque

- Disponibilizar uma tela simples para selecionar o produto desejado e apresentar imediatamente as opções existentes de cor e tamanho associadas a ele.
- Permitir selecionar **entrada** ou **saída** e informar a quantidade para a combinação escolhida.
- Ao confirmar, atualizar o saldo correspondente e apresentar feedback claro.
- Não incluir localização de estoque, fornecedor, categorias, detalhamento de movimentações ou auditoria.
- Como regra inicial para o protótipo, impedir saldo negativo e informar quando a quantidade de saída exceder o saldo. Validar essa regra com a equipe.

### RF03 — Etiquetas

- Após confirmar uma entrada de estoque, abrir um modal para imprimir etiquetas referentes à entrada.
- O botão **IMPRIMIR** executa uma ação simbólica e apresenta confirmação; não há impressão física real.
- Cada etiqueta simulada deve possuir um código que permita identificar a combinação correta de produto, cor e tamanho na venda. Usar o mesmo código para unidades da mesma combinação e gerar simbolicamente uma etiqueta por unidade adicionada.
- Permitir fechar o modal sem desfazer a entrada já confirmada, deixando esse efeito claro.

### RF04 — Vendas

- Com estoque disponível, permitir iniciar uma nova venda pela tela **VENDAS**.
- Permitir escolher produto, cor e tamanho pelo nome e manter o código da etiqueta como alternativa recolhida, pronta para receber leitura ou digitação. O código reconhece nome, cor e tamanho e adiciona a combinação à venda.
- Permitir digitar o código como alternativa para dispositivos móveis e para testes sem leitor físico.
- Exibir itens e quantidades da venda, permitir corrigir ou remover itens e concluir a operação.
- Ao concluir, baixar o estoque correspondente, confirmar o resultado e apresentar a venda na listagem da tela **VENDAS**, com identificador, data e total e acesso aos itens e quantidades.
- Não permitir conclusão com quantidade superior ao saldo. Informar código desconhecido e outros problemas sem perder os itens já adicionados.
- Exibir preço de venda e total; salvar o preço aplicado na venda. Meios de pagamento não são necessários no escopo definido.

## Requisitos de interação e qualidade

- Interface de baixa fidelidade, com hierarquia clara, linguagem simples, controles identificados e mensagens compreensíveis.
- Layout adequado a computador e adaptável a celular, sem perda das ações essenciais.
- Navegação por teclado, foco visível, rótulos associados a campos e modal operável por teclado; mensagens e estados devem ser perceptíveis sem depender apenas de cor.
- Manter o foco na entrada de código quando adequado, sem impedir correções ou navegação acessível.
- Os dados de produtos, saldos e vendas devem persistir no mesmo navegador após recarregar ou fechar a página. A impressão é simulada; nenhuma integração com impressora, pagamento ou serviços externos é exigida.
- Não realizar testes com participantes neste momento. A documentação de pesquisa e avaliação permanece para uma fase futura.

## Fora do escopo atual

Localização de estoque, fornecedor, categorias, histórico detalhado ou auditoria de movimentações, impressão real, integração fiscal, pagamento real e acabamento visual de alta fidelidade. Recursos adicionais dependem de decisão explícita da equipe.

