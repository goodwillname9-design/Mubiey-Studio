# Downloads free (Open Font License) Arabic calligraphy fonts from Google Fonts into public\assets\fonts\ar
# Run from the project root:  powershell -ExecutionPolicy Bypass -File scripts\get-arabic-fonts.ps1
$dir = "public\assets\fonts\ar"
New-Item -ItemType Directory -Force $dir | Out-Null
$base = "https://raw.githubusercontent.com/google/fonts/main/ofl"
$fonts = [ordered]@{
  ruqaa        = "arefruqaa/ArefRuqaa-Regular.ttf"
  kufi         = "reemkufi/ReemKufi%5Bwght%5D.ttf"
  nastaliq     = "notonastaliqurdu/NotoNastaliqUrdu%5Bwght%5D.ttf"
  lateef       = "lateef/Lateef-Regular.ttf"
  scheherazade = "scheherazadenew/ScheherazadeNew-Regular.ttf"
  katibeh      = "katibeh/Katibeh-Regular.ttf"
  mirza        = "mirza/Mirza-Regular.ttf"
  rakkas       = "rakkas/Rakkas-Regular.ttf"
  lalezar      = "lalezar/Lalezar-Regular.ttf"
}
foreach ($k in $fonts.Keys) {
  $out = Join-Path $dir "$k.ttf"
  try {
    Invoke-WebRequest "$base/$($fonts[$k])" -OutFile $out -ErrorAction Stop
    $kb = [math]::Round((Get-Item $out).Length / 1KB)
    Write-Host "OK      $k ($kb KB)"
  } catch {
    if (Test-Path $out) { Remove-Item $out -Force }
    Write-Host "FAILED  $k  -> download it manually and save as $out"
  }
}
Write-Host ""
Write-Host "Done. Run: git add public/assets/fonts/ar ; git commit -m 'Add Arabic fonts' ; git push"
