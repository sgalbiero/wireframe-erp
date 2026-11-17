# Dados e persistência

## Armazenamento

Persistência local obrigatória após reinício do processo. O agente implementador escolhe um mecanismo simples adequado a Node.js, documenta dependências e localização dos dados, e garante gravação consistente. Não exigir banco externo. Dados reais de participantes e segredos não pertencem ao repositório.

## Modelo lógico

| Entidade | Atributos mínimos |
|---|---|
| Produto | id, nome, preço de custo em centavos, preço de venda em centavos |
| Combinação | id, produtoId, cor, tamanho, código único e estável, saldo inteiro não negativo |
| Venda | id, data/hora, itens, total em centavos |
| Item de venda | combinaçãoId, cópia de nome/cor/tamanho, quantidade, preço unitário em centavos, subtotal em centavos |

O vínculo e os textos históricos permitem consultar vendas mesmo após futura alteração do cadastro. Uma combinação representa um tipo de item, não uma unidade física. Identificadores são internos e não precisam ser exibidos além do identificador da venda e do código de etiqueta.

## Integridade

- Código único por combinação; combinação única por produto, cor e tamanho, considerando normalização de comparação.
- Preços e totais inteiros em centavos; saldo e quantidades inteiros; não permitir negativos.
- Confirmar entrada, saída e venda de forma consistente. A venda deve gravar todos os itens e baixas ou nenhum deles, inclusive em falhas; escolher mecanismo com garantias compatíveis.
- Proteger contra reenvio da mesma operação e concorrência que resulte em saldo negativo. Validar no servidor.
- Identificadores e códigos sobrevivem ao reinício. Data/hora deve ser armazenada com fuso inequívoco e exibida em formato local brasileiro.
- Documentar criação inicial, localização e procedimento de limpeza dos dados de demonstração; não apagar dados existentes automaticamente.
