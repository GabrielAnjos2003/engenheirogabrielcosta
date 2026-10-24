# Portfólio — Gabriel dos Anjos Costa

Site de apresentação profissional desenvolvido em HTML, CSS e JavaScript. O projeto utiliza apenas tons de preto, branco e cinza e não possui seção comercial de serviços.

## Como abrir no VS Code

1. Extraia o arquivo ZIP.
2. Abra a pasta `portfolio-gabriel` no VS Code.
3. Abra o arquivo `index.html`.
4. Use a extensão **Live Server** para visualizar o site no navegador.

## Dados pessoais inseridos

O site já está configurado com:

- Telefone e WhatsApp: `(64) 9 9308-5516`
- Link do WhatsApp: `https://wa.me/5564993085516`
- Instagram: `@eng_gabriel_costa`

No arquivo `index.html`, ainda revise:

- `CREA-GO: preencher`
- `Catalão — Goiás`, caso queira alterar a localização

Caso deseje incluir um e-mail futuramente, adicione outro item dentro da seção `contact-list`.

## Como substituir as imagens

As imagens provisórias estão na pasta `assets`. Você pode:

1. Manter os nomes dos arquivos e substituir o conteúdo por suas imagens; ou
2. Inserir novas imagens e alterar o caminho no `index.html`.

Exemplo:

```html
<img src="assets/meu-projeto-estrutural.jpg" alt="Descrição do projeto" />
```

Recomendações:

- Use imagens horizontais.
- Proporção sugerida: 16:10.
- Resolução recomendada: 1600 × 1000 px ou superior.
- Formatos: `.jpg`, `.png` ou `.webp`.

O CSS aplica preto e branco automaticamente às imagens. Para exibir as cores originais, remova esta linha de `styles.css`:

```css
filter: grayscale(1) contrast(1.05);
```

## Como editar os projetos

Cada projeto possui três informações no `index.html`:

```html
data-title="Nome do projeto"
data-description="Descrição do projeto"
data-tools="Ferramentas utilizadas"
```

Altere esses textos conforme cada trabalho real.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub.
2. Envie todos os arquivos da pasta para o repositório.
3. Abra **Settings**.
4. Entre em **Pages**.
5. Em **Build and deployment**, selecione **Deploy from a branch**.
6. Escolha a branch `main` e a pasta `/root`.
7. Salve e aguarde a criação do endereço público.

## Estrutura do projeto

```text
portfolio-gabriel/
├── index.html
├── styles.css
├── script.js
├── README.md
└── assets/
```
