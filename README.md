# Forma & Grão — Business Website

Website empresarial demonstrativo e independente do portfolio. **Forma & Grão é uma marca fictícia** de mobiliário por medida, restauro e planeamento de interiores. Não existe empresa, atendimento comercial, cliente ou serviço real associado. Todos os textos e a ilustração foram criados para este exercício com assistência de IA; não representam trabalho comercial anterior.

## Repositório e publicação

- Repositório público: https://github.com/tiagoapsantos/business-website
- Endereço atribuído pelo GitHub Pages: https://tiagoapsantos.github.io/business-website/
- O único workflow é `.github/workflows/deploy.yml`, executado em push para `main`: sintaxe, testes, build com `BASE_PATH=/business-website/`, upload de `dist` e deploy via acções oficiais. Não instala dependências, porque o projecto não as tem.
- O job de build tem apenas leitura de conteúdo. O job de deploy tem `pages: write` e `id-token: write`. Pages está configurado para GitHub Actions; não existe mecanismo alternativo de publicação.
- Estado de cada publicação: https://github.com/tiagoapsantos/business-website/actions

## Origem, hipóteses e âmbito mínimo

O conceito do portfolio apenas definia um site responsivo para apresentar um pequeno negócio, com tags Web, Design e Conceito. A auditoria de 27/10/2026 não identificou implementação. Na auditoria inicial foram pesquisadas pastas de projectos e localizações de trabalho acessíveis. Não foi encontrada implementação nesse âmbito limitado; não se presume que todo o disco tenha sido pesquisado.

Decisões novas e reversíveis: negócio fictício de mobiliário (permite explicar serviços e abordagem sem inventar clientes), identidade própria verde-floresta/argila/linho, português europeu, quatro páginas e um formulário inteiramente local. Não eram requisitos do resumo original; foram escolhidas para concretizar o pedido actual. Não se introduziram preços, contactos comerciais ficticiamente activos, testemunhos, certificações ou resultados.

- **Objectivo:** apresentar claramente um pequeno negócio e permitir explorar um pedido, sem fingir uma transacção.
- **Público do cenário:** pessoas a explorar mobiliário ou renovação para casa; público real desta aplicação: avaliadores de um projecto de desenvolvimento Web.
- **Páginas:** `/`, `/servicos/`, `/sobre/`, `/contacto/`, mais uma resposta 404.
- **Essenciais:** catálogo com três serviços, ligações contextualizadas para contacto, navegação acessível, formulário validado, resumo descarregável, layout responsivo.
- **Dados:** textos de demonstração, ilustração SVG original, exemplos de contacto em example.com. Não há dados de clientes.
- **Aceitação:** quatro páginas acessíveis; links/recursos/âncoras válidos; erros por campo e foco no resumo; dados válidos geram texto e um ficheiro; nenhuma comunicação de dados; sem deslocamento horizontal em desktop/tablet/mobile; navegação por teclado; build e testes aprovados.

## Stack e decisões

HTML semântico gerado por pequenos módulos JavaScript reutilizáveis, CSS organizado por componentes e módulos JavaScript no navegador. Node.js nativo gera a saída estática e serve o preview. A escolha evita instalar frameworks, bibliotecas ou um backend sem necessidade. A complexidade da interface não justifica um compilador TypeScript; validação isolada, testes e módulos pequenos tornam o comportamento verificável. Não há dependências npm nem fontes ou imagens remotas. A ilustração SVG é vectorial e inclui dimensões e texto alternativo no HTML.

O formulário tem validação no cliente; como não existe backend, não há validação de servidor ou serviço de envio. A alternativa funcional é **preparar, rever e descarregar um ficheiro .txt**. O resumo é apresentado com `textContent`, sem executar HTML introduzido. Não são usados localStorage, cookies, analytics ou APIs. Os dados ficam em memória até limpar/recarregar. Ficheiros descarregados ficam sob controlo do utilizador. Sem JavaScript, a navegação funciona e o formulário explica a limitação, mantendo a submissão desactivada. A política CSP incluída no HTML bloqueia submissões nativas e ligações de rede por scripts também em alojamento estático. O servidor de preview repete essa política num cabeçalho. Se um dia houver backend, validação de servidor e definição de privacidade serão requisitos novos.

## Requisitos e execução

Node.js 22 ou superior e npm (desenvolvido/verificado com Node 24). Não precisa de conta, chaves, instalação de dependências, acesso à Internet ou `npm install`.

```powershell
cd 'caminho/para/business-website'
npm.cmd run dev
```

Abrir http://127.0.0.1:4173/. `dev` gera os ficheiros antes de iniciar. Não há hot reload: após editar, execute o build e actualize a página; o servidor lê a saída em cada pedido.

```powershell
npm.cmd run check
npm.cmd run build
npm.cmd test
npm.cmd run preview
```

Os testes geram builds isolados em pastas temporárias, tanto na raiz como sob `/business-website/`; não dependem do conteúdo de `dist`. `preview` não faz build. Para outra porta em PowerShell: `$env:PORT = '4174'`, seguido de `npm.cmd run preview`. O servidor ouve apenas em 127.0.0.1; Ctrl+C termina-o. A saída `dist` pode ser servida por qualquer servidor estático com suporte a directórios e página 404, sem executar o servidor Node em produção.

## Estrutura

- `src/content.mjs`: serviços e metadados das rotas.
- `src/render.mjs`: componentes partilhados e conteúdo das quatro páginas.
- `src/assets/styles.css`: sistema visual, componentes, foco e media queries.
- `src/assets/main.js`: formulário, foco, erros, preview e download.
- `src/assets/validation.js`: validação e geração do resumo, partilhadas com os testes.
- `src/assets/atelier.svg`: ilustração original do ambiente; `favicon.svg`: identidade gráfica.
- `scripts/build.mjs`: geração estática para `dist`, com prefixo `BASE_PATH` validado, página 404 e `.nojekyll`, sem apagar pastas existentes.
- `src/paths.mjs`: prefixo de publicação e política CSP incluída no HTML.
- `scripts/serve.mjs`: servidor estático local com suporte ao mesmo prefixo; tipos MIME, 404, métodos restritos e protecção de caminhos.
- `scripts/check.mjs`: verificação de sintaxe com o Node instalado.
- `tests/`: testes de validação, limites, resumo, HTML, recursos e servidor.
- `docs/verification.md`: resultados efectivamente executados e limites.
- `docs/evidence-for-portfolio.md`: inventário factual para um estudo de caso futuro.

## Limitações e futuro

Sem envio de mensagens, caixa de email, backend, orçamento, encomenda, conta ou armazenamento persistente. Nenhum preço, disponibilidade, promessa comercial ou trabalho de cliente é real. O resumo é um pedido de demonstração, não um contacto enviado. Não existe estado de carregamento artificial: a preparação é síncrona. O estado inicial explica o formulário; erros, resultado pronto, alterações que invalidam o resumo, limpeza e falha de download têm tratamento próprio.

O site é apenas PT-PT. Sem tradução automática, CMS ou edição visual. A validação de email é sintáctica, não confirma uma caixa real. A acessibilidade básica não substitui testes com leitores de ecrã e utilizadores. Não há suite automatizada de browser instalada; testes manuais de browser e os seus limites são registados separadamente.

Possíveis próximos passos, **não implementados**: tradução EN, ensaios com leitores de ecrã, exemplos adicionais de mobiliário identificados como ilustrações, eventual backend somente com requisitos reais e configuração própria. A fase inicial de preparação não incluiu commit, push ou deploy. A configuração de publicação actual está descrita acima. O portfolio não foi modificado por este projecto.

## Build para GitHub Pages

O website está preparado para alojamento estático num **site de projecto**, sem ocupar o domínio raiz do portfolio. A recomendação é GitHub Pages com um workflow de build próprio. O repositório e o único workflow foram preparados na fase de publicação autorizada. Ver o relatório completo em [docs/public-demo-readiness.md](docs/public-demo-readiness.md).

Para preparar uma demonstração sob a subpasta de exemplo `/business-website/`, em PowerShell:

```powershell
$env:BASE_PATH = '/business-website/'
npm.cmd run check
npm.cmd run build
npm.cmd test
npm.cmd run preview
```

Abrir **http://127.0.0.1:4173/business-website/**. Este endereço é apenas local. Definir PORT antes do preview se necessário. O mesmo BASE_PATH deve estar definido no build e no preview; caso contrário, os links não corresponderão à pasta servida. Ao terminar a sessão de configuração: `Remove-Item Env:BASE_PATH` (devolve os comandos seguintes ao prefixo raiz). `npm run dev` também respeita BASE_PATH e volta a gerar o build.

No terminal de CI, definir a variável de ambiente BASE_PATH como `/nome-do-repositorio/` antes do build; se o nome mudar, voltar a gerar. São aceites segmentos com letras ASCII, números, hífen ou underscore, com barra inicial e barra final opcional; URLs, travessias, queries e fragmentos não são aceites. O valor por omissão continua a ser `/` para desenvolvimento local na raiz.

**Publicar apenas o conteúdo de dist**, com index.html no topo do artefacto:

```text
dist/
  .nojekyll
  index.html
  404.html
  assets/
    styles.css
    main.js
    validation.js
    atelier.svg
    favicon.svg
  servicos/index.html
  sobre/index.html
  contacto/index.html
```

Não criar uma pasta business-website dentro de dist para publicação no Pages: o prefixo é o ponto de montagem da plataforma, já incluído nos URLs. Os módulos do browser continuam a usar imports relativos entre assets. As páginas internas são directórios com index.html, por isso não precisam de fallback SPA. A 404 usa URLs com prefixo para funcionar também em caminhos inexistentes profundos. Node é necessário para gerar/verificar o site, **não para o servir em produção**. CSS, fontes do sistema e SVGs são locais. O download TXT é um Blob criado no browser; não depende de endpoint.

O build escreve os ficheiros conhecidos sem apagar outros ficheiros em dist. Antes de publicar, confirmar que a saída contém apenas os 11 ficheiros acima; um checkout novo em CI evita resíduos de builds antigos.

O procedimento de preparação abaixo fica documentado para referência. Nesta publicação, o repositório escolhido é business-website e o prefixo é /business-website/:

1. Rever este relatório e escolher o nome do repositório de projecto e o prefixo correspondente. Não usar o repositório do portfolio para esta aplicação.
2. Inicializar Git e criar um repositório público só depois da autorização. Rever os ficheiros e excluir saídas locais conforme .gitignore.
3. Criar um workflow para obter o código, preparar Node 24, executar check, build e test com BASE_PATH definido, e carregar **dist** com upload-pages-artifact. Não é necessário npm install; npm ci não se aplica sem lockfile e sem dependências.
4. Configurar a origem do Pages como GitHub Actions e usar deploy-pages, com permissões e ambiente indicados pela documentação oficial. Usar as versões actuais das acções ao configurar; não foram fixadas nem instaladas nesta preparação.
5. Confirmar o workflow, abrir o endereço efectivamente atribuído pelo GitHub e repetir navegação, refresh, formulário e download. Só depois acrescentar esse endereço ao Portfolio, numa tarefa separada.

O endereço atribuído à aplicação consta da secção de publicação. Noindex/nofollow mantém a demonstração fora da intenção de indexação; não impede acesso público nem constitui autenticação.

Referências oficiais consultadas: [criar um site GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site), [origem de publicação e workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
