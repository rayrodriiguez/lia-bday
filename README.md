# Para Lia ✦

fiz esse projetinho de aniversário pra Lia, transformando uma coisa que eu queria muito fazer por ela em uma viagem interativa. 💗

a ideia é passar por vários mundinhos, começando no universo e nas estrelas, passando pela Terra, pelo mar, por um jardim de girassóis, pelo mundo dos insetos e por um piquenique, até chegar na parte final, com uma cartinha feita pra ela.

o projeto foi feito com HTML, CSS e JavaScript, sem bibliotecas. desenhei os cenários usando `<canvas>` e deixei cada ambiente separado em seu próprio arquivo, pra ficar mais fácil mexer nos detalhes, nas animações e nos textos.

## ✦ como o projeto tá organizado

```text
index.html          site final, gerado a partir de src/
foto.jpg            foto usada no coração e na carta
*.mp3               músicas de cada ambiente
src/
  head.html         estilos e estrutura da página
  core.js           motor das cenas, textos, partículas,
                    balões, músicas e troca de disco
  s-universo.js     1. universo e planetas
  s-estrelas.js     2-3. constelação, foto e estrelas cadentes
  s-terra.js        4. Terra, Pernambuco ↔ Brasília
                    e contagem regressiva
  s-mar.js          5. fundo do mar
  s-jardim.js       6. jardim de girassóis
  s-grama.js        7. mundo dos insetos
  s-piquenique.js   8. piquenique e bolo
  s-final.js        9. final e cartinha
  boot.js           início de tudo
  build.ps1         junta os arquivos no index.html
```

