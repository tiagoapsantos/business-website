# Forma & Grão — preparação para demonstração pública

Registo histórico da preparação anterior à publicação. Data: 27/10/2026. **Conclusão: pronto para publicação estática futura, após revisão. A aplicação não foi publicada.**

## 1. Estado inicial e preservação

A pasta da aplicação foi confirmada e foram lidos README.md, docs/verification.md, docs/evidence-for-portfolio.md, todos os módulos de conteúdo/renderização, scripts, testes e recursos estáticos. Existiam 17 ficheiros de trabalho e uma saída dist com 10 ficheiros. Não existiam dependências npm, lockfile, node_modules, .env ou repositório Git inicializado. Nenhum ficheiro de trabalho desconhecido foi descartado. Sem Git, não é possível atribuir alterações anteriores a um autor; os 17 originais foram preservados fora do projecto, na área de QA do chat, antes da primeira edição.

A verificação inicial de sintaxe passou e os 12 testes existentes passaram. O Portfolio estava limpo; foi criado um inventário de hashes dos seus 45 ficheiros de trabalho, excluindo controlo Git, dependências e saídas geradas, para confirmar preservação no final.

## 2. Arquitectura e saída de produção

- Node.js nativo gera HTML com templates e conteúdo partilhado. Não existe aplicação Node em produção.
- Quatro páginas: início, serviços, sobre e contacto, cada uma com index.html no seu directório; mais 404.html.
- CSS próprio, módulos ES do browser, fontes de sistema e dois SVGs locais. Sem CDN, fontes remotas, bibliotecas de terceiros, scripts de analytics ou integrações.
- O formulário valida, apresenta um resumo textual e permite descarregar TXT UTF-8. Não há email enviado, orçamento, encomenda ou backend.
- A saída a publicar é **apenas o conteúdo de dist**, actualmente com 11 ficheiros: cinco HTML, cinco assets e .nojekyll. Não publicar src, scripts, tests, docs ou package.json como artefacto do website.
- BASE_PATH define o ponto de montagem, por exemplo /business-website/. O build final nesta preparação usa esse prefixo. Não se assume disponibilidade da raiz do domínio.

## 3. Auditoria de segurança e privacidade

Não foram encontrados chaves, tokens, credenciais, ficheiros de segredo, dados de clientes, contactos reais ou endpoints privados no código, recursos e documentação inspeccionados. As referências ao caminho pessoal da máquina foram retiradas da documentação de trabalho. A marca e os serviços são identificados como fictícios no cabeçalho, rodapé, texto das páginas e formulário. Os exemplos usam Alex Demonstração e alex@example.com.

A lógica do formulário chama preventDefault, valida limites e serviços conhecidos e escreve o resultado com textContent. Não executa HTML introduzido. O download tem nome fixo, MIME text/plain;charset=utf-8 e conteúdo textual criado por Blob; o object URL é revogado. Não há fetch, XMLHttpRequest, sendBeacon, WebSocket, cookies, localStorage ou sessionStorage no cliente. Os dados permanecem na memória da página. O ficheiro descarregado fica no dispositivo do visitante, e limpar o formulário não o apaga.

Foi corrigida uma diferença entre preview e alojamento público: a CSP passou a estar no início do head de todos os HTML, incluindo 404. Contém connect-src 'none', form-action 'none', base-uri 'none' e object-src 'none', além da restrição dos recursos à própria origem. A prevenção de submissões nativas deixa de depender do cabeçalho do servidor local. O botão de preparação continua desactivado no HTML até a inicialização do JavaScript.

Confirmação no browser, servido sem cabeçalho CSP: resumo e descarga com dados fictícios funcionaram, o TXT foi lido e o registo HTTP não recebeu qualquer novo pedido nessa sequência. O payload textual semelhante a script/imagem não criou elementos DOM. Isto confirma o percurso testado juntamente com a revisão do código; não é uma auditoria de segurança universal.

O alojamento estático recebe os pedidos normais de navegação e recursos e poderá manter os seus próprios registos de acesso; a aplicação não lhe transmite os campos do formulário. O isolamento por frame-ancestors continua a ser apenas um cabeçalho do preview: essa directiva não funciona numa meta CSP, pelo que não se promete a mesma protecção no Pages. Ver [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors).

## 4. Compatibilidade com GitHub Pages

**GitHub Pages é adequado à arquitectura estática deste projecto.** A recomendação é um repositório de projecto separado, com build em GitHub Actions e upload do conteúdo de dist. Não foi criado workflow nem configurado qualquer serviço. As instruções futuras estão no README e baseiam-se na [documentação oficial do GitHub](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

Os href, src e action dos templates são ajustados por um prefixo local validado. Queries como servico=restauro e fragmentos mantêm-se. O import de validation.js é relativo ao módulo main.js. Não há base HTML que altere a resolução de âncoras. A 404 usa caminhos prefixados mesmo quando é apresentada num endereço inexistente profundo. As páginas internas têm ficheiros físicos; não exigem reescritas ou fallback SPA.

A compatibilidade foi testada para além do localhost na raiz: um build prefixado foi colocado fisicamente sob business-website/ e servido como ficheiros estáticos, sem regras de encaminhamento específicas da aplicação e sem CSP no cabeçalho. O mesmo artefacto é o que poderá ser alojado no Pages. Refresh directo, CSS, módulos, imagens e navegação funcionaram sob essa subpasta.

Isto demonstra compatibilidade técnica, não uma publicação já verificada no GitHub. Após escolher o nome real do repositório, ajustar BASE_PATH, gerar de novo e validar a infra-estrutura publicada numa fase autorizada. Nenhum URL público foi inventado. A raiz do website profissional não foi utilizada.

## 5. Alterações aplicadas

1. src/paths.mjs: normalização segura do prefixo, ajuste dos URLs locais e política CSP comum.
2. src/render.mjs: aplicação do prefixo às páginas e inclusão da CSP; geração da 404 com os mesmos princípios.
3. scripts/build.mjs: BASE_PATH, saída configurável para testes isolados, 404 e .nojekyll.
4. scripts/serve.mjs: preview sob o prefixo escolhido, mantendo isolamento da pasta, MIME, métodos GET/HEAD e protecções locais.
5. tests/site.test.mjs: builds isolados e cinco novas verificações relevantes para publicação, conservando os testes anteriores.
6. README.md: execução, build, estrutura a publicar, prefixo, privacidade e passos de publicação futura.
7. docs/verification.md: registo inicial preservado e nova secção com os resultados actuais.
8. docs/evidence-for-portfolio.md: nota factual de preparação, sem atribuir URL ou publicação inexistente.
9. docs/public-demo-readiness.md: este relatório.

Não foram alterados conteúdo/serviços, estilos, ilustrações, validação ou interacção do formulário, package.json ou dependências. O Portfolio e as outras aplicações foram preservados. dist foi regenerado; os recursos copiados mantêm o conteúdo original.

## 6. Testes executados

| Verificação | Resultado |
| --- | --- |
| Sintaxe, npm run check | Passou |
| Build original na raiz | Quatro páginas e 404 geradas |
| Build final com BASE_PATH=/business-website/ | Passou; 11 ficheiros de produção, incluindo .nojekyll |
| Suite, npm test | 17 testes passaram; zero falhas |
| Novos testes | Links/assets/imports/queries/âncoras em subpasta física, refresh/404, CSP no HTML, rejeição de prefixos inválidos e inventário da saída |
| Preview com BASE_PATH e porta alternativa | Quatro páginas HTTP 200; rota fora do prefixo HTTP 404 |
| Servidor estático genérico sem CSP no cabeçalho | Aplicação funcional; CSP presente no HTML |
| Desktop e mobile | Quatro páginas revistas a 1280 e 390 píxeis; verificação de largura também a 768 e 320: 16 combinações sem overflow |
| Refresh directo | Repetido nas quatro páginas da subpasta, sem perda de CSS ou módulos |
| Navegação | Início → serviços → contacto; Restauro pré-seleccionado; 404 profunda → início |
| Validação | Campos vazios, email inválido, serviço obrigatório, mensagens por campo e resumo acessível |
| Foco | Skip link visível com Tab, Enter para conteúdo; erro → campo; foco no resumo gerado; limpar → nome |
| Preparação e download | Resumo correcto e TXT real lido em UTF-8, sem novos pedidos no registo HTTP durante essas acções |
| Segurança do texto | Marcação semelhante a HTML permaneceu texto, sem elementos injectados |
| Edição e limpeza | Resumo invalidado ao editar; limpeza eliminou os valores e restaurou o foco |
| Mobile do formulário | Erros e resumo válido revistos |
| Consola | Zero avisos/erros durante as páginas e acções normais observadas; 404 intencional testada separadamente |

## 7. Limitações conhecidas

- Apenas português europeu. Sem backend, autenticação, persistência, entrega de mensagens ou serviços comerciais reais.
- Sem testes com leitores de ecrã, utilizadores reais, todos os browsers/dispositivos, JavaScript desactivado ou falha forçada de download. A alternativa sem JavaScript foi inspeccionada no código.
- Noindex/nofollow exprime a intenção de não indexar, mas não é autenticação nem impede acesso público.
- O build preserva ficheiros adicionais já existentes em dist. A saída actual foi inventariada e contém apenas os 11 ficheiros esperados; uma publicação futura deve partir de checkout limpo e publicar só o artefacto verificado.
- Build e preview devem usar o mesmo BASE_PATH. Mudar o nome do futuro repositório exige regenerar os caminhos.
- A disponibilidade pública, configuração Pages e resposta efectiva da CDN só poderão ser confirmadas depois de uma publicação autorizada.

## 8. Estado final e conclusão

Preparação local concluída; build estático para /business-website/ pronto para revisão. Nenhum Git foi inicializado, nenhum repositório GitHub foi criado e não houve commit, push, deploy, alterações de conta, serviços externos ou alterações ao Portfolio. Não existe URL público desta aplicação.

**Pronto para publicação estática em GitHub Pages**, após aprovação desta revisão e definição do nome/prefixo do repositório. Não há bloqueio técnico conhecido nesta preparação. A publicação e a ligação a partir do Portfolio ficam para uma fase separada e autorizada.

Comparação final de preservação: os 45 ficheiros de trabalho inventariados no Portfolio mantêm os mesmos hashes, sem ficheiros adicionados ou removidos. Na aplicação, a comparação com o inventário inicial confirma exactamente sete ficheiros modificados e dois novos, listados na secção 5, sem remoções. Não foram instaladas dependências nem inicializado Git. Os links locais da documentação resolvem. O registo do servidor estático de QA contém apenas pedidos GET durante a revisão.

## Fase de publicação autorizada

Após esta preparação, o utilizador autorizou criar o repositório público https://github.com/tiagoapsantos/business-website e publicar o build em https://tiagoapsantos.github.io/business-website/. A configuração está em `.github/workflows/deploy.yml`; Pages usa GitHub Actions. O workflow executa sintaxe, os 17 testes e build com BASE_PATH=/business-website/, e publica exclusivamente dist. Não há instalação de dependências nem alteração visual. O resultado efectivo do deploy e das verificações online é registado no GitHub Actions e no relatório final do chat. As afirmações de ausência de Git/URL nas secções anteriores descrevem a fase histórica de preparação.
