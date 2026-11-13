# Novo site Ulox — Guia de publicação

Site institucional one-page da **Ulox Garantia Locatícia**, para substituir o site atual em **www.ulox.com.br**.

## O que é

Site **100% estático**: HTML, CSS, JavaScript puro, imagens e fontes.

- Não usa banco de dados, PHP, Node, WordPress nem build (nada de `npm install`).
- Não depende de framework nem de bibliotecas externas.
- Funciona em qualquer hospedagem: cPanel/Apache, Nginx, Hostinger, Locaweb, KingHost, Vercel, Netlify, Cloudflare Pages, S3 etc.

## Estrutura

```
site/
├── index.html            ← página única (todo o conteúdo)
├── css/style.css         ← estilos (tema claro e escuro)
├── js/main.js            ← interações (menu, tema, depoimentos, formulário)
└── assets/
    ├── fonts/            ← Montserrat (6 pesos, .ttf)
    └── img/              ← logos e fotos otimizadas (fotos/)
```

## Como publicar (passo a passo)

1. **Faça backup do site atual** (baixe a pasta pública inteira, normalmente `public_html/` ou `www/`).
2. **Apague ou mova** os arquivos do site antigo da pasta pública.
3. **Envie o CONTEÚDO da pasta `site/`** para a raiz da pasta pública, de modo que o `index.html` fique em `public_html/index.html`. Não envie a pasta `site` em si, só o que está dentro dela.
4. Confira se o domínio abre com **HTTPS** (o certificado SSL da hospedagem atual continua valendo).
5. **Limpe o cache** do CDN ou da hospedagem, se houver (por exemplo, Cloudflare → Purge Everything).
6. Abra https://www.ulox.com.br e teste:
   - menu e links de âncora;
   - botão de tema (lua/sol) no cabeçalho;
   - formulário "Quero ser parceiro", que deve abrir o WhatsApp com a mensagem preenchida;
   - versão no celular.

> **Atenção:** se o site atual for WordPress ou outro CMS, o servidor pode ter um `.htaccess` com regras de reescrita. Depois de remover o WordPress, revise ou remova esse `.htaccess` para que ele não redirecione as páginas para o `index.php` antigo.

### Testar no computador antes de publicar

Basta abrir o `index.html` no navegador. Para um teste mais fiel, sirva a pasta com um servidor local, por exemplo:

```
npx serve site
```

ou

```
python -m http.server --directory site 8080
```

## Configurações que podem precisar de ajuste

| O quê | Onde | Valor atual |
|---|---|---|
| Número de WhatsApp (formulário) | `js/main.js`, constante `WHATSAPP` | `553298277974` |
| Número de WhatsApp (botões e links) | `index.html`, links `wa.me/553298277974` | idem |
| Telefone 0800 e e-mails | `index.html`, rodapé | 0800 878 2745 · comercial@ / privacidade@ulox.com.br |
| Domínio para compartilhamento/SEO | `index.html`, `<head>` (og:url, og:image, canonical, JSON-LD) | https://www.ulox.com.br/ |
| Cores da marca e do tema escuro | `css/style.css`, bloco `:root` no topo | Verde #54A89D · Cinza #1F1F1F · Branco #F5F5F5 |

**Formulário:** não há backend. Ao enviar, o formulário valida os campos e abre o WhatsApp da Ulox com os dados preenchidos (mesmo comportamento do site atual). Se quiserem receber os dados também por e-mail ou num CRM, é preciso integrar um serviço (Formspree, RD Station, HubSpot, endpoint próprio etc.) no trecho "Formulário -> WhatsApp" do `js/main.js`.

**Tema escuro:** o padrão é o tema claro. A escolha do visitante fica salva no navegador dele (`localStorage`, chave `ulox-theme`).

## Pendências antes de publicar (conteúdo)

- [ ] **Depoimento do "Carlos Prado — Prado & Lima Imóveis" é ilustrativo (fictício).** Substituir por um depoimento real ou remover; está marcado com um comentário no `index.html`. Publicar depoimento fictício como se fosse real é vedado pelo CDC e pelo CONAR.
- [ ] **Fotos dos depoimentos:** as fotos são de banco de imagens e aparecem junto do nome de clientes reais (Marina Mendes e Rosinei Dias Gomes). O ideal é usar fotos reais dessas pessoas, com autorização, ou só as iniciais.
- [ ] **Foto do card "Proprietário"** ainda é carregada do Unsplash (link externo). O ideal é trocá-la por uma foto própria em `assets/img/fotos/` e atualizar o `src` no `index.html`.
- [ ] **Link "Termos de Uso"** no rodapé está vazio (`href="#"`).
- [ ] **Facebook e YouTube** no rodapé apontam para perfis "ucred". Confirmar se são os perfis corretos da Ulox.
- [ ] **Respostas da seção Dúvidas:** revisar com o time da Ulox (algumas foram redigidas a partir do site atual).
- [ ] **Logos das imobiliárias parceiras:** hoje aparecem só os nomes em texto; podem ser trocados por logos.

## Otimizações opcionais

- Converter as fontes `.ttf` para `.woff2` (cerca de 70% menores) e atualizar os `@font-face` no topo do `style.css`.
- Ativar compressão gzip/brotli e cache longo para `/assets/` na hospedagem.
- Se usarem Google Analytics, Meta Pixel ou Tag Manager, colar os scripts antes de `</head>` no `index.html`.
