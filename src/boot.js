resize();
cur = S.universo; curName = "universo";
requestAnimationFrame(frame);
$("startBtn").addEventListener("click", () => {
  audioInit(); audioResume(); unlockMusicFiles();

  if (!MUSICAS.piquenique) setTimeout(() => {
    renderTrackToUrl("piquenique", PICNIC.total * PICNIC.beat).then(url => { if (url) MUSICAS.piquenique = url; });
  }, 4000);
  $("start").classList.add("gone");
  $("mute").hidden = false;
  sfx.chime(4);
  setTimeout(() => $("start").remove(), 1600);
  setScene("universo");
});
