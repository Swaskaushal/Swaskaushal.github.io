# ============================================================
#  update-cv.ps1  —  convert your latest CV (.docx) to the
#  PDF the website links to, then optionally publish.
#
#  Usage:
#    ./update-cv.ps1 "C:\path\to\CV_Kaushal.docx"
#    ./update-cv.ps1 "C:\path\to\CV_Kaushal.docx" -Publish
# ============================================================
param(
    [Parameter(Mandatory = $true)][string]$DocxPath,
    [switch]$Publish
)

$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot

if (-not (Test-Path $DocxPath)) { Write-Host "File not found: $DocxPath" -ForegroundColor Red; exit 1 }

$outPdf = Join-Path $PSScriptRoot "assets\Swas_Kaushal_CV.pdf"

Write-Host "Converting CV to PDF..." -ForegroundColor Cyan
$word = New-Object -ComObject Word.Application
$word.Visible = $false
try {
    $doc = $word.Documents.Open((Resolve-Path $DocxPath).Path, $false, $true)
    # 17 = wdFormatPDF
    $doc.SaveAs([ref]$outPdf, [ref]17)
    $doc.Close($false)
    Write-Host "Saved: $outPdf" -ForegroundColor Green
} finally {
    $word.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
}

if ($Publish) { & "$PSScriptRoot\publish.ps1" "Update CV" }
