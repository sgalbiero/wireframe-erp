# Etiquetas: especificação funcional

## Objetivo

Simular a impressão das etiquetas após uma entrada de estoque e fornecer códigos coerentes com a venda, sem usar impressora real.

## Regras

- Cada combinação produto/cor/tamanho possui um código estável e único no protótipo; unidades iguais compartilham o mesmo código.
- Uma entrada de N unidades gera uma representação simbólica de N etiquetas da combinação. Não criar identificadores individuais por unidade.
- Após confirmar entrada, abrir modal com produto, cor, tamanho, quantidade e código legível. A representação pode agrupar etiquetas idênticas em uma prévia com quantidade, sem renderizar milhares de elementos.
- **IMPRIMIR** executa ação simbólica e mostra confirmação explícita. Não chamar impressão do navegador nem alegar impressão física.
- Fechar ou cancelar o modal não reverte a entrada já salva. O usuário deve ser informado desse comportamento.
- O código deve ser copiável ou digitável para simular a leitura na venda. Não prometer um padrão de código de barras ou compatibilidade com hardware sem implementação e verificação.

## Aceite

Uma entrada de cinco unidades mostra cinco etiquetas simbólicas com o mesmo código. Ao informar esse código na venda, a combinação correta é reconhecida. Fechar o modal mantém as cinco unidades no estoque.
