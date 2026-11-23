# Contratos entre áreas do protótipo

Os contratos são locais à aplicação e não representam uma API HTTP. Cada fluxo atualiza um único estado persistido no navegador.

| Área | Responsabilidades e operações |
|---|---|
| Produtos | cadastrar produto com combinações, listar produtos e gerar SKU estável por combinação. |
| Estoque | consultar saldo e confirmar entrada ou saída para combinação existente. |
| Etiquetas | apresentar SKU e quantidade simbólica da entrada confirmada; simular impressão sem hardware. |
| Vendas | resolver SKU, manter carrinho, validar saldo, concluir venda e listar vendas salvas. |

## Dependências

Produtos fornece as combinações usadas por Estoque e Vendas. Estoque altera o saldo da combinação. Etiquetas recebe os dados da entrada confirmada. Vendas consulta os produtos, preserva o preço aplicado e atualiza a venda e os saldos na mesma alteração do estado local.

## Erros previsíveis

Dados ausentes ou inválidos; combinação inexistente; SKU desconhecido; saldo insuficiente; carrinho vazio e falha de acesso ao armazenamento do navegador. Apresentar mensagens compreensíveis e preservar formulário ou carrinho sempre que possível.

## Limites

Não há servidor, API, banco, ORM ou concorrência multiusuário nesta etapa. Os módulos conceituais orientam a separação dos fluxos sem exigir abstrações sem uso.
