# Interface, acessibilidade e responsividade

## Direção visual

Wireframe de baixa fidelidade: tons neutros, bordas simples, texto legível e hierarquia clara. Priorizar estrutura e fluxo; não criar identidade visual ou acabamento de produto final. Usar português brasileiro e rótulos explícitos.

## Navegação e layout

Produtos, Estoque e Vendas sempre acessíveis. Otimizar para computador com informações e ações principais visíveis sem excesso de etapas. Em celular, adaptar a largura, empilhar controles quando necessário, permitir leitura de tabelas sem cortar conteúdo e manter ações acessíveis ao toque. Não ocultar funções essenciais.

## Acessibilidade

- Usar HTML semântico e rótulos associados aos campos; botões com nomes claros.
- Todas as ações disponíveis por teclado, ordem de foco lógica e foco visível.
- Modal de etiquetas recebe foco ao abrir, mantém navegação dentro dele enquanto aberto, permite fechar pelo teclado e devolve foco ao acionador ou controle apropriado.
- Não transmitir informação apenas por cor; associar erros aos campos e anunciar feedback relevante de modo acessível.
- O campo de código recebe foco inicial quando conveniente, mas não rouba foco durante outras ações nem bloqueia navegação.
- Controles e textos devem permanecer legíveis e utilizáveis com zoom e telas pequenas.

## Estados

Em cada tela prever vazio, preenchimento, sucesso e erro. Explicar erros próximos da ação e indicar como corrigir. Em falha de servidor, manter entradas sempre que possível. Confirmar estoque e venda sem mensagens ambíguas.
