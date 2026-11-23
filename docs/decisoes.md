# Decisões de produto e arquitetura

## Decisões confirmadas

- O cadastro contém nome, preço de custo e preço de venda. Cores são adicionadas primeiro e os tamanhos são informados uma única vez, em etapas separadas para tornar o fluxo claro.
- Cada combinação cadastrada de produto, cor e tamanho tem um código compartilhado por suas unidades. Não criar identificador individual para cada unidade física. Exemplo: cinco unidades do mesmo modelo, cor e tamanho compartilham o código da combinação.
- Na entrada, gerar simbolicamente uma etiqueta por unidade adicionada. A ação de imprimir é simbólica.
- Produtos, saldos e vendas persistem no navegador por `localStorage`. Não há persistência compartilhada entre dispositivos e não será usado banco de dados nesta etapa.
- A listagem de vendas apresenta identificador, data e total, além de permitir consultar itens e quantidades.
- O protótipo usa React, TypeScript e Vite, é publicado como site estático e não possui backend.
- A aplicação possui uma visão geral, mas abre Produtos por padrão para facilitar o início dos testes.
- Edição e exclusão não fazem parte desta versão; os fluxos cobrem criação e operação.
- O nome do produto aceita espaços e deve conter texto após remover espaços periféricos.
- O preço de venda deve ser maior que zero. O preço de custo pode ser zero nesta etapa.
- O código segue o formato `SKU-{produto}-{cor}-{tamanho}`, por exemplo `SKU-001-PRETO-38`.
- Dados iniciais de demonstração são carregados na primeira abertura e podem ser restaurados pela interface.
- O acesso é público, sem autenticação e sem dados reais de participantes.

## Premissas de implementação

- Ao salvar, cada tamanho informado é combinado com todas as cores do produto. Todas as combinações começam sem saldo; a entrada de estoque define quais delas a loja efetivamente possui.
- Preços pertencem ao produto; a venda registra o preço de venda aplicado em cada item no momento da conclusão, preservando o histórico caso o cadastro seja alterado depois.
- Quantidades são inteiros positivos; saídas e vendas não podem produzir saldo negativo. A conclusão baixa o saldo uma única vez.
- Fechar o modal de etiquetas não desfaz a entrada já confirmada.
- Não serão realizados testes com participantes nesta fase.
- A interface é responsiva para computador e celular. Não simula câmera nem promete integração com leitor físico.
