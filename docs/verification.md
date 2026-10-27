# Verificação local — registo inicial

Data: 27/10/2026. Ambiente: Windows, Node.js 24.22.1. Escopo: pasta da aplicação independente. Todos os dados introduzidos nos testes foram fictícios.

## Comandos executados

- `npm.cmd run check`: aprovado; sintaxe dos módulos JavaScript do projecto verificada.
- `npm.cmd run build`: aprovado; quatro páginas e página de erro 404 em `dist`.
- `npm.cmd test`: 12 testes aprovados, zero falhas. Testes de validação e limites, normalização, serviços válidos/inválidos, resumo Unicode, quatro rotas, links/âncoras/recursos, metadados, acessibilidade estrutural básica, 404, redireccionamento, HEAD, recusa de POST, MIME, isolamento da pasta servida e ausência de envio/persistência no código do cliente.
- `npm.cmd run preview`: executado localmente em http://127.0.0.1:4173/ para as verificações de browser. Não é publicação. O servidor de QA foi terminado após a validação; voltar a executar `npm.cmd run dev` para nova revisão.

## Browser: verificações efectivamente executadas

| Verificação | Resultado observado |
| --- | --- |
| Homepage, serviços, sobre e contacto | Páginas carregadas; homepage, serviços, sobre e contacto inspeccionados visualmente |
| Navegação homepage → serviços → contacto | Funcional; link do serviço Restauro pré-seleccionou a opção correcta |
| Pedido com campos vazios | Erros por campo, `aria-invalid`, resumo visível e foco transferido para o resumo |
| Link do resumo de erros | Abriu o campo correspondente com foco visível |
| Email inválido | Rejeitado; apenas o email ficou assinalado quando os restantes campos estavam válidos |
| Serviço não seleccionado | Rejeitado como obrigatório |
| Pedido válido | Resumo com os dados e serviço correctos; foco no resultado; mensagem explícita de não envio |
| Download | Evento de download observado; ficheiro real .txt lido e confirmado em UTF-8, com nome, serviço, mensagem fictícios e aviso de não envio |
| Alteração após preparar | Preview escondido e limpo, com pedido para preparar novamente; impede descarregar um resumo desactualizado |
| Limpar campos | Valores apagados, resultado escondido, foco no nome e mensagem acessível |
| Texto semelhante a HTML | Texto `<script>exemplo</script>` apareceu literalmente no resumo; zero elementos injectados |
| Teclado | Tab mostrou o skip link com foco; Enter navegou para o conteúdo; Tab no nome avançou para o email |
| Responsividade | As quatro páginas foram carregadas a 320, 390, 768 e 1280 píxeis; largura do documento não excedeu a viewport em nenhuma das 16 combinações |
| Imagens | SVG carregado na homepage e página sobre; dimensões e alt presentes |
| Consola | Não foram encontrados avisos ou erros nos registos observados durante estas verificações |

## Contraste e limites

Foram calculados os rácios das combinações principais de cores definidas no CSS: texto principal/fundo 10,69:1; texto secundário/fundo 5,67:1; argila/fundo 5,07:1; botão 11,46:1; texto/aviso verde 8,88:1; texto secundário/branco 6,08:1; erro/branco 7,02:1; resumo de erro 8,43:1; placeholder/branco 5,02:1; texto secundário da secção verde 8,19:1. Estes cálculos não equivalem a uma auditoria completa de acessibilidade ou de todas as combinações de estado.

Não foram executados testes com leitores de ecrã, utilizadores reais, todos os browsers/dispositivos, falha simulada de download ou JavaScript desactivado. A alternativa sem JavaScript e o bloqueio inicial da submissão foram inspeccionados no código, não ensaiados num browser sem scripts. Não existe suite automatizada de browser; a interacção foi verificada manualmente através das ferramentas de browser.

Não há backend, envio de email, integrações, autenticação ou armazenamento persistente para testar. Não se reivindica funcionamento comercial, validação com clientes ou resultados de negócio. O estado de carregamento não se aplica à preparação síncrona do resumo.

## Privacidade, recursos e preservação

Revisão do código: sem credenciais, tokens, contactos pessoais reais ou serviços externos. Todos os recursos usados são locais. O servidor local usa CSP com `connect-src 'none'` e `form-action 'none'`; aceita apenas GET e HEAD. São protecções de uma demonstração local, não uma auditoria de segurança completa.

Não foi feito `npm install`; o projecto não tem dependências npm. Nenhum repositório Git foi inicializado para esta aplicação. Não foram feitos commit, push, criação de repositórios GitHub ou deploy. A comparação de hashes dos 39 ficheiros de trabalho existentes no portfolio e do estado Git confirmou a preservação (excluindo dependências, controlo Git e saídas geradas).

## Revalidação para demonstração pública — 27/10/2026

A preparação está registada em [public-demo-readiness.md](public-demo-readiness.md). As observações acima referem-se à validação original; os testes actuais geram as suas próprias saídas temporárias.

- Sintaxe e build de produção: aprovados. Build final com BASE_PATH=/business-website/: quatro páginas, 404, cinco assets e .nojekyll.
- Suite actual: **17 testes aprovados, zero falhas**, incluindo os 12 existentes e cinco verificações de subpasta, refresh/404, CSP no HTML, validação do prefixo e conteúdo da saída. Os testes isolam os builds e não modificam a saída final dist.
- Servidor estático genérico de QA sobre uma subpasta física /business-website/, sem reescritas e sem cabeçalho CSP: quatro páginas revistas, navegação funcional, pre-selecção de Restauro correcta e refresh directo funcional.
- Browser: 16 combinações (quatro páginas × larguras 320, 390, 768 e 1280); sem overflow horizontal. Revisão visual desktop/mobile, SVGs carregados e alt presentes.
- Formulário: campos vazios, email inválido, serviço obrigatório, erros associados, foco no resumo de erros e link de erro para o campo, pedido válido, foco no resultado, invalidação após edição e limpeza com regresso do foco ao nome.
- Texto semelhante a script/imagem permaneceu literal no resumo, sem elementos injectados. Download real .txt lido em UTF-8, com dados fictícios e aviso de não envio. O registo HTTP do servidor de QA não mudou durante preparação e download: nenhum novo pedido foi recebido nessa sequência.
- Mobile: erros e resumo válido revistos. Teclado: skip link com foco visível e navegação para o conteúdo confirmados.
- Consola: zero avisos/erros nas quatro páginas e interacções normais observadas. A resposta 404 intencional foi testada separadamente e regressou correctamente à homepage com estilo carregado.
- Não foram testados leitores de ecrã, todos os browsers, JavaScript desactivado ou falha forçada de download; os limites anteriores mantêm-se. Sem publicação real, não se afirma ter validado o domínio/infraestrutura do GitHub.
- Não foi inicializado Git, não foi criado repositório remoto e não houve commit, push ou deploy. Portfolio preservado.

## Compatibilidade do teste no GitHub Actions

Na primeira execução em Linux, o teste de isolamento da pasta esperava o código 403 observado em Windows para um caminho com barra invertida codificada. Em Linux, esse carácter é literal e o servidor respondeu 404, sem expor o ficheiro. O teste passou a aceitar 403 ou 404 e a verificar também que o conteúdo de package.json não é devolvido. Não houve alteração do servidor ou do website para esta correcção.
