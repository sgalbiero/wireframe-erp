# Contratos entre módulos

Estes são contratos conceituais; o agente pode escolher nomes de funções e formato HTTP coerentes com a solução. Cada operação retorna resultado explícito ou erro tratável; regras não devem depender apenas da interface.

| Módulo | Responsabilidades e operações |
|---|---|
| Produtos | cadastrar produto com combinações, listar produtos, consultar combinações existentes e resolver código de etiqueta. |
| Estoque | consultar saldo, confirmar entrada e confirmar saída para combinação existente. |
| Etiquetas | apresentar código e quantidade simbólica da entrada confirmada; simular impressão sem hardware. |
| Vendas | listar e consultar vendas, validar carrinho, concluir venda e coordenar baixa atômica de estoque. |

## Dependências

Rotas recebem e validam formato HTTP; serviços aplicam regras e coordenam operações; repositórios encapsulam persistência. Vendas consulta produtos e estoque por interfaces públicas. A transação de conclusão deve abranger registro da venda e todas as baixas, sem gravações independentes que possam deixar dados parcialmente atualizados. A representação do carrinho pode ser local à interface ou à sessão, desde que o servidor nunca confie em preço ou saldo enviado pelo navegador.

## Erros previsíveis

Dados ausentes ou inválidos; combinação inexistente; código desconhecido; saldo insuficiente; carrinho vazio; operação duplicada; falha de persistência. Retornar mensagens compreensíveis sem detalhes internos e preservar dados do formulário ou carrinho sempre que possível.

## Organização

Seguir [arquitetura](../arquitetura.md). Não obrigar framework de interface, ORM ou banco externo. Escolhas técnicas devem favorecer simplicidade, operação local e consistência; registrar comandos e limitações reais no README ao implementar.
