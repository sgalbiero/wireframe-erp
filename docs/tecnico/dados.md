# Dados e persistência

## Armazenamento

O protótipo usa `localStorage`. Produtos, saldos e vendas persistem após recarregar ou fechar a página no mesmo navegador, mas não são compartilhados entre dispositivos, perfis ou navegadores. Não há backend ou banco externo. Dados reais de participantes e segredos não pertencem ao repositório.

A primeira abertura recebe dados fictícios de demonstração. A ação **Restaurar demonstração** substitui os dados locais pelos valores iniciais após confirmação explícita.

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
- Confirmar entrada, saída e venda de forma consistente na atualização do estado local.
- Impedir saldo negativo e conclusão repetida na interface.
- Identificadores e códigos sobrevivem ao recarregamento da página. Data/hora é armazenada em ISO e exibida em formato local brasileiro.
- Não substituir dados existentes automaticamente; a restauração exige ação do usuário.
