$src = $PSScriptRoot
$root = Split-Path -Parent $src
$order = @("core.js", "s-universo.js", "s-estrelas.js", "s-terra.js", "s-mar.js", "s-jardim.js", "s-grama.js", "s-piquenique.js", "s-final.js", "boot.js")
$utf8 = New-Object System.Text.UTF8Encoding($false)

$js = New-Object System.Text.StringBuilder
foreach ($f in $order) {
  $p = Join-Path $src $f
  if (Test-Path $p) { [void]$js.Append([IO.File]::ReadAllText($p, $utf8)); [void]$js.Append("`n") }
  else { Write-Host "faltando: $f" }
}
$script = "<script>`n" + $js.ToString() + "</script>`n"
$head = [IO.File]::ReadAllText((Join-Path $src "head.html"), $utf8)

[IO.File]::WriteAllText((Join-Path $root "ceu-amarelo.html"), $head + "`n" + $script, $utf8)

$cut = $head.IndexOf("</style>") + "</style>".Length
$headPart = $head.Substring(0, $cut) -replace '<meta name="claude:viewport-fit-sides"[^>]*>\r?\n?', ''
$bodyPart = $head.Substring($cut)
$meta = @"
<meta charset="utf-8">
<meta name="description" content="uma coisinha que eu fiz pra você">
<meta property="og:title" content="Para Lia">
<meta property="og:description" content="uma coisinha que eu fiz pra você ✦">
<meta name="theme-color" content="#05060f">
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✦</text></svg>">
"@
$page = "<!doctype html>`n<html lang=`"pt-BR`">`n<head>`n" + $meta + "`n" + $headPart + "`n</head>`n<body>" + $bodyPart + "`n" + $script + "</body>`n</html>`n"
[IO.File]::WriteAllText((Join-Path $root "index.html"), $page, $utf8)
Write-Host ("ok: index.html " + (Get-Item (Join-Path $root "index.html")).Length + " bytes")
