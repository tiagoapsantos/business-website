# Evidências para um futuro estudo de caso

Data: 27/10/2026. Nota factual preparatória; não é um estudo de caso definitivo e não altera o portfolio.

## Problema e âmbito

Transformar o resumo conceptual de um pequeno website empresarial num artefacto executável. O cenário escolhido é o atelier fictício Forma & Grão. Não se alegam clientes, conversões, resultados de negócio ou experiência comercial.

## Arquitectura e funcionalidades

Quatro páginas estáticas geradas por `src/render.mjs` com conteúdo partilhado de `src/content.mjs`. CSS próprio e ilustração SVG. Formulário com validação pura em `src/assets/validation.js` e interacção em `src/assets/main.js`: erros acessíveis, resumo textual, download real em .txt, pré-selecção de serviço, limpeza e invalidação do resumo após alterações. Sem backend nem envio; esta limitação está visível na interface.

## Decisões e provas

Node nativo e zero dependências porque não são necessários servidor de aplicação ou framework. A lógica de validação é separada do DOM e partilhada com os testes. `tests/validation.test.mjs` cobre limites e normalização; `tests/site.test.mjs` cobre páginas, links, recursos e HTTP. Ver `docs/verification.md` para resultados realmente executados. Existência de testes não equivale a resultado aprovado.

O código foi desenvolvido nesta tarefa com assistência de IA; os textos e a identidade são fictícios. Não há autoria prévia ou resultados profissionais a reivindicar. O portfolio original foi preservado.

## Capturas a reunir após validação

- Homepage em desktop e mobile, mostrando a marca e o aviso de demonstração.
- Serviços com ligações para o formulário.
- Erros do formulário e resumo válido, sempre com dados fictícios.
- Vista sobre e navegação/foco por teclado.

## Limites

Sem testes de backend, entrega de email ou serviços reais, porque não existem. Sem validação com utilizadores ou leitores de ecrã. Não há publicação nem URL público. Este documento só deve ser promovido para estudo de caso depois de rever o registo de verificações e as capturas reais.

## Preparação para demonstração pública — 27/10/2026

Build agora configurável para subpasta via BASE_PATH, com página 404 e recursos ajustados e marcador .nojekyll. A política CSP passou a acompanhar o HTML estático. Suite ampliada para 17 testes aprovados; revisão de browser e download repetidos sob uma subpasta física servida sem regras especiais. Ver [public-demo-readiness.md](public-demo-readiness.md) e a secção de revalidação em [verification.md](verification.md).

O projecto está preparado para uma publicação futura em GitHub Pages, mas **continua sem repositório Git inicializado, sem repositório remoto e sem URL público**. O Portfolio não foi alterado nesta preparação. Não se atribui uma demonstração online antes de ela existir.
