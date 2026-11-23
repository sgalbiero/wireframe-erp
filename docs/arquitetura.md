# Arquitetura e implementação

## Diretrizes

O projeto é um wireframe navegável de baixa fidelidade implementado como aplicação estática com React, TypeScript e Vite. A solução roda inteiramente no navegador, pode ser publicada na Vercel e não depende de backend, banco de dados ou serviços externos.

Manter regras e estado separados da apresentação quando isso simplificar os fluxos. Evitar infraestrutura ou abstrações de produção que não contribuam para os testes do protótipo.

## Organização

```text
src/
  App.tsx                  # composição, navegação e estado compartilhado
  components/ui.tsx        # componentes reutilizáveis de interface
  features/overview/       # visão geral
  features/products/       # cadastro e listagem de produtos
  features/inventory/      # estoque e etiquetas
  features/sales/          # busca, carrinho e histórico de vendas
  data.ts                  # dados fictícios iniciais
  storage.ts               # leitura, gravação e restauração do localStorage
  types.ts                 # tipos de produto, combinação, venda e navegação
  utils.ts                 # formatação, identificadores e normalização de busca
  styles.css               # linguagem visual e responsividade
  main.tsx                 # inicialização da aplicação
```

Cada pasta em `features/` concentra o fluxo e as regras de apresentação de um domínio. `App.tsx` não implementa telas; ele apenas mantém o estado persistido, controla a navegação e conecta os módulos.

O Vite produz a versão estática em `dist/`. A aplicação abre Produtos por padrão, mantendo Visão geral, Estoque e Vendas acessíveis pela navegação principal.

## Modelo conceitual

- **Produto:** nome, preços de custo e venda e combinações cadastradas de cor e tamanho.
- **Combinação:** identificador estável, cor, tamanho, saldo e SKU no formato `SKU-{produto}-{cor}-{tamanho}`.
- **Saldo:** quantidade atual por combinação. Entrada soma e saída subtrai.
- **Etiqueta:** prévia simbólica associada a uma entrada; unidades da mesma combinação compartilham o SKU.
- **Venda:** identificador, data, itens, quantidades, preços aplicados e total. A conclusão reduz os saldos locais.

## Persistência e limites

- O `localStorage` mantém os dados no mesmo navegador após recarregamento ou fechamento da página.
- Dados não são sincronizados entre dispositivos, usuários ou navegadores.
- A restauração dos dados de demonstração é explícita e confirmada pelo usuário.
- Não há autenticação, impressão real, leitura por câmera, pagamento, integração fiscal ou garantias de concorrência multiusuário.
- Valores monetários são armazenados como centavos inteiros.
- Quantidades são inteiros positivos e nenhuma operação pode produzir saldo negativo.

## Verificação

Executar `npm run build` e verificar cadastro, estoque, etiquetas, venda, restauração, recarregamento, teclado e layouts de computador e celular. Essas verificações técnicas não substituem testes de usabilidade com participantes.
