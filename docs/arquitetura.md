# Arquitetura e implementação

## Diretrizes

Usar Node.js e Express para um wireframe navegável de baixa fidelidade. Organizar o código em módulos desacoplados, mantendo regras de negócio e armazenamento independentes das rotas HTTP e da interface. Adotar a solução mais simples que permita demonstrar os fluxos definidos em [requisitos](requisitos.md), sem infraestrutura de produção desnecessária.

## Organização sugerida

```text
src/
  app.js                 # configuração do Express
  server.js              # inicialização do servidor
  modules/
    products/            # produtos e combinações de cor/tamanho
    inventory/           # saldo, entrada e saída
    labels/              # códigos e impressão simbólica
    sales/               # venda e listagem
  shared/                # utilidades efetivamente compartilhadas
  views/                 # telas ou templates simples
  public/                # estilos e scripts de interface
```

A estrutura orienta responsabilidades, sem exigir arquivos vazios. Rotas/controladores tratam HTTP, serviços coordenam regras e repositórios isolam armazenamento. Evitar acesso direto à implementação interna de outro módulo; expor funções ou contratos claros. Não criar abstrações sem uso.

## Modelo conceitual inicial

- **Produto:** nome, preços de custo e venda e conjunto de combinações cadastradas de cor e tamanho. O cadastro apresenta cores antes dos tamanhos.
- **Combinação:** identificador estável, cor, tamanho e associação ao produto. Apenas combinações existentes devem ser selecionáveis.
- **Saldo:** quantidade atual por combinação. Entrada e saída alteram o saldo, sem necessidade de registro detalhado ou auditoria.
- **Código de etiqueta:** vínculo inequívoco com a combinação vendável. Um código identifica a combinação e é compartilhado por todas as suas unidades.
- **Venda:** identificador, data, itens, quantidades, preços aplicados e total. A conclusão baixa os saldos e torna a venda visível na listagem.

## Consistência e limites

- Validar quantidade inteira positiva e saldo suficiente no servidor, além da interface.
- No fechamento, verificar novamente todos os saldos, atualizar estoque e registrar venda como uma única operação lógica. Evitar conclusão duplicada e alterações parciais em caso de falha.
- A entrada deve ser confirmada antes do modal de impressão; fechar o modal não reverte o saldo. A impressão é simbólica e não deve chamar ou prometer integração física.
- O código exibido na etiqueta simulada deve ser reconhecido pelo fluxo de venda. Permitir entrada manual além do leitor que funciona como teclado, sem alegar suporte a hardware não verificado.
- Persistir produtos, saldos e vendas localmente após reinício; documentar o armazenamento adotado e como reiniciar os dados.
- Armazenar valores monetários em centavos inteiros ou equivalente exato; preservar o preço aplicado em cada venda.

## Preparação para implementação

Registrar no README pré-requisitos, instalação, execução, endereço local, persistência e limitações reais. Não inserir segredos ou dados confidenciais de participantes no repositório. Verificar tecnicamente o fluxo completo, responsividade, acessibilidade básica, erros e consistência de estoque e venda; isso é diferente de realizar testes com participantes, que não ocorrerão agora. Escolher bibliotecas, mecanismo de armazenamento local e representação do código conforme a simplicidade necessária ao protótipo.

