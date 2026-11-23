# Produtos: especificação funcional

## Objetivo

Cadastrar o calçado e suas combinações comercializáveis para uso no estoque e na venda. Cada produto contém nome, preço de custo e preço de venda. Cores são informadas antes dos tamanhos, que são definidos uma única vez para todas elas, em seções ou etapas separadas e claramente identificadas.

## Dados

| Campo | Regra |
|---|---|
| Nome | Obrigatório; aceitar espaços internos, remover espaços periféricos e rejeitar texto vazio. |
| Preço de custo | Obrigatório; valor monetário não negativo. |
| Preço de venda | Obrigatório; valor monetário maior que zero; usado nas vendas. Se ficar abaixo do custo, sinalizar visualmente sem impedir o avanço. |
| Cores | Pelo menos uma cor não vazia. |
| Tamanhos | Pelo menos um tamanho; valores duplicados são desconsiderados. |

Aceitar valores monetários no formato brasileiro e convertê-los para centavos. O preço de custo pode ser zero no protótipo; o preço de venda deve ser maior que zero. Não exigir fornecedor, categoria, localização ou outros dados não solicitados.

## Fluxo

1. Abrir Produtos e escolher cadastro.
2. Preencher nome e preços.
3. Adicionar uma ou mais cores; mostrar as cores adicionadas e permitir correção antes de salvar.
4. Adicionar os tamanhos um a um, digitando o valor e pressionando Enter ou escolhendo Adicionar. Exibir cada tamanho abaixo do campo e permitir removê-lo. Ao salvar, criar automaticamente todas as combinações entre as cores e os tamanhos, cada uma com saldo zero.
5. Exibir resumo das combinações, validar e salvar.
6. Confirmar o cadastro e oferecer **Adicionar estoque**. Se aceito, abrir Estoque com o produto selecionado; permitir permanecer em Produtos.

## Regras e estados

- Comparar cores e tamanhos sem distinção de maiúsculas ou espaços periféricos para evitar duplicatas; manter apresentação legível.
- Destacar com borda vermelha e mensagem o preço de venda abaixo do custo, mas permitir a continuação do cadastro.
- Manter o cadastro compacto para que cada etapa caiba na tela de um computador durante os testes, preservando rolagem apenas como contingência para telas menores ou muitos valores.
- Não salvar produto incompleto; preservar os campos preenchidos quando houver erro.
- Listar produtos cadastrados e exibir estado vazio com ação para cadastrar.
- Cada combinação recebe identificador interno e código de etiqueta estável. Não criar registros individuais por unidade.
- Edição e exclusão após salvamento não fazem parte desta versão.

## Aceite

Um produto com duas cores e três tamanhos gera seis combinações com saldo inicial zero. A entrada de estoque determina quais combinações estão efetivamente disponíveis na loja. Campos inválidos impedem salvamento e apontam o erro. Após salvar, o convite para adicionar estoque não força a navegação.
