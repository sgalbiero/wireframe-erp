# Guia do projeto

Wireframe navegável de baixa fidelidade para um trabalho de Interação Humano-Computador (IHC), implementado com React, TypeScript e Vite. A referência acadêmica é `Projeto Final IHC - Do problema à solução .pdf`.

O potencial cliente identificado é a loja de calçados LUIZERA, na Rua Pará de Minas, 311, Centro (Fartura), Nova Serrana - MG. A proposta é simplificar o controle de vendas e as atividades associadas: cadastro de produto com nome, preços de custo e venda, cores e tamanhos; entrada e saída de estoque; impressão simbólica de etiquetas; e venda rápida por código. A interface prioriza computador e também deve ser acessível em dispositivos móveis.

## Documentação

Consulte o [índice completo por responsabilidade](docs/README.md), incluindo especificações de produtos, estoque, etiquetas, vendas, dados, interface e critérios de aceite.

- [Requisitos](docs/requisitos.md): escopo funcional e restrições.
- [Fluxos e interface](docs/escopo-e-fluxos.md): etapas, estados e comportamento esperado.
- [Arquitetura](docs/arquitetura.md): responsabilidades e orientações técnicas.
- [Decisões](docs/decisoes.md): escolhas confirmadas e premissas de implementação.
- [Pendências acadêmicas](docs/pendencias.md): entregáveis previstos pelo trabalho.
- [Pesquisa e testes](docs/pesquisa-e-testes.md): modelos para uso futuro.

## Execução

```bash
npm install
npm run dev
```

Para gerar a versão estática usada na Vercel, execute `npm run build`. Os arquivos são produzidos em `dist/`.

## Persistência e demonstração

Produtos, saldos e vendas são armazenados no `localStorage` do navegador. Os dados não são compartilhados entre dispositivos ou navegadores. A primeira abertura carrega dados de demonstração, e a interface possui uma ação para restaurá-los.

O protótipo não usa backend, banco de dados, autenticação, impressão real ou integração com leitor. O campo SKU aceita digitação e dispositivos que funcionem como teclado.


