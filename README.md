# Para Lia ✦

Uma viagem interativa de aniversário: universo, constelação, Terra, mar, jardim de girassóis, mundo dos insetos, piquenique e uma carta no final.

Feito em HTML, CSS e JavaScript puro, sem bibliotecas. Tudo é desenhado num `<canvas>`, e cada ambiente fica num arquivo próprio em `src/`.

## Estrutura

```
index.html          site pronto (gerado a partir de src/)
foto.jpg            a foto do coração e da carta
musicas/            uma música para cada ambiente
src/
  head.html         estilos e a estrutura da página
  core.js           motor: cenas, legendas, balões de fala, partículas, áudio e troca de disco
  s-universo.js     1. universo e planetas
  s-estrelas.js     2-3. constelação, foto e estrelas cadentes
  s-terra.js        4. Terra, Pernambuco ↔ Brasília e contagem regressiva
  s-mar.js          5. fundo do mar
  s-jardim.js       6. jardim de girassóis
  s-grama.js        7. mundo dos insetos
  s-piquenique.js   8. piquenique e bolo
  s-final.js        9. final e carta
  boot.js           início
  build.ps1         junta tudo no index.html
```

Os textos de cada ambiente ficam no topo do arquivo da cena, num objeto `T_...` (por exemplo `T_MAR` em `s-mar.js`).

## Editar e gerar de novo

Depois de mudar algo em `src/`, rode no PowerShell:

```powershell
.\src\build.ps1
```

Isso atualiza o `index.html`.

## Ver no computador

Abra o `index.html` no navegador. Se as músicas não tocarem abrindo direto do arquivo, sirva a pasta com qualquer servidor local.

## Publicar (GitHub Pages)

1. Suba esta pasta para um repositório no GitHub.
2. No repositório: **Settings → Pages → Branch: main / (root) → Save**.
3. Em um ou dois minutos o site fica em `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/`.
