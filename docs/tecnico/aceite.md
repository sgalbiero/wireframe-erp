# Roteiro de implementação e aceite técnico

## Ordem sugerida

1. Configurar Node.js e Express, inicialização local, estrutura modular e armazenamento persistente.
2. Implementar cadastro de produtos, cores e tamanhos e geração de códigos por combinação.
3. Implementar consulta de saldo e movimentos de entrada/saída; adicionar modal de etiquetas simbólicas.
4. Implementar venda por código, carrinho, conclusão consistente e listagem persistente.
5. Aplicar responsividade e acessibilidade básicas, preencher instruções de execução e verificar o fluxo completo.

## Cenário integrado

Cadastrar um calçado com preço de custo e venda, duas cores e tamanhos específicos por cor. Aceitar a sugestão para abrir estoque. Dar entrada de cinco unidades em uma combinação e conferir o modal e código. Fechar modal e confirmar saldo. Registrar uma saída e conferir saldo. Abrir nova venda, informar código duas vezes, conferir identificação e total, concluir e consultar venda na listagem. Reiniciar o servidor e verificar produto, saldo e venda.

## Cenários negativos

Campos incompletos; cor ou combinação duplicada; quantidade zero, negativa ou fracionária; saída acima do saldo; código desconhecido; carrinho vazio; venda acima do saldo; falha ao persistir; tentativa de conclusão duplicada. Nenhum desses casos deve causar baixa parcial ou perda silenciosa de dados.

## Verificações adicionais

Verificar navegação por teclado, modal, foco, mensagens, layout de computador e celular e entrada manual do código. Registrar limitações de dispositivo e impressão. Essas verificações técnicas não são testes de usabilidade com participantes; estes não serão realizados agora.
