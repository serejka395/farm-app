
Add-Type -AssemblyName System.Drawing

$animDir = "c:\Users\MSI\Downloads\ferm1\public\assets\animals"
$files = Get-ChildItem $animDir -Filter *.png

foreach ($file in $files) {
    Write-Host "Processing $($file.Name)..."
    try {
        $bmp = [System.Drawing.Bitmap]::FromFile($file.FullName)
        $newBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)
        $g = [System.Drawing.Graphics]::FromImage($newBmp)
        $g.DrawImage($bmp, 0, 0)
        $g.Dispose()
        $bmp.Dispose() # Release original file

        $transparentCount = 0
        for ($x=0; $x -lt $newBmp.Width; $x++) {
            for ($y=0; $y -lt $newBmp.Height; $y++) {
                $c = $newBmp.GetPixel($x, $y)
                # Fuzzy match for white
                if ($c.R -gt 240 -and $c.G -gt 240 -and $c.B -gt 240) {
                    $newBmp.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
                    $transparentCount++
                }
            }
        }
        
        Write-Host "  Made $transparentCount pixels transparent."
        $newBmp.Save($file.FullName, [System.Drawing.Imaging.ImageFormat]::Png)
        $newBmp.Dispose()
    } catch {
        Write-Error "Failed to process $($file.Name): $_"
    }
}

Write-Host "Pet background removal complete!"
