# Produtos: especificação funcional

## Objetivo

Cadastrar o calçado e suas combinações comercializáveis para uso no estoque e na venda. Cada produto contém nome, preço de custo e preço de venda. Cores são informadas antes de tamanhos, em seções ou etapas separadas e claramente identificadas.

## Dados

| Campo | Regra |
|---|---|
| Nome | Obrigatório; texto sem espaços apenas; apresentar tal como cadastrado. |
| Preço de custo | Obrigatório; valor monetário não negativo. |
| Preço de venda | Obrigatório; valor monetário não negativo; usado nas vendas. |
| Cores | Pelo menos uma cor não vazia. |
| Tamanhos | Pelo menos um tamanho para cada cor criada; cada combinação deve ser explícita. |

Aceitar valores monetários no formato brasileiro e convertê-los para centavos no servidor. A regra de preços iguais a zero é uma premissa do protótipo, sujeita a revisão. Não exigir fornecedor, categoria, localização ou outros dados não solicitados.

## Fluxo

1. Abrir Produtos e escolher cadastro.
2. Preencher nome e preços.
3. Adicionar uma ou mais cores; mostrar as cores adicionadas e permitir correção antes de salvar.
4. Para cada cor, adicionar os tamanhos correspondentes. Mostrar claramente a cor em edição; não criar automaticamente o produto cartesiano entre cores e tamanhos.
5. Exibir resumo das combinações, validar e salvar.
6. Confirmar o cadastro e oferecer **Adicionar estoque**. Se aceito, abrir Estoque com o produto selecionado; permitir permanecer em Produtos.

## Regras e estados

- Comparar cores e tamanhos sem distinção de maiúsculas ou espaços periféricos para evitar duplicatas na mesma associação; manter apresentação legível.
- Não salvar produto incompleto; preservar os campos preenchidos quando houver erro.
- Listar produtos cadastrados e exibir estado vazio com ação para cadastrar.
- Cada combinação recebe identificador interno e código de etiqueta estável. Não criar registros individuais por unidade.
- Edição e exclusão após salvamento não foram definidas como necessárias; não presumir exclusão física de dados vinculados a vendas.

## Aceite

Um produto com duas cores pode ter tamanhos diferentes para cada cor; somente as combinações informadas aparecem no estoque. Campos inválidos impedem salvamento e apontam o erro. Após salvar, o convite para adicionar estoque não força a navegação.
