
Add-Type -AssemblyName System.Drawing

$cropsDir = "c:\Users\MSI\Downloads\ferm1\public\assets\crops"
$files = Get-ChildItem $cropsDir -Filter *.png

foreach ($file in $files) {
    Write-Host "Processing $($file.Name)..."
    $bmp = [System.Drawing.Bitmap]::FromFile($file.FullName)
    $newBmp = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height)
    $g = [System.Drawing.Graphics]::FromImage($newBmp)
    $g.DrawImage($bmp, 0, 0)
    $g.Dispose()
    $bmp.Dispose()

    # Make white transparent
    # Simple threshold: if R,G,B > 240, make transparent
    for ($x=0; $x -lt $newBmp.Width; $x++) {
        for ($y=0; $y -lt $newBmp.Height; $y++) {
            $c = $newBmp.GetPixel($x, $y)
            if ($c.R -gt 230 -and $c.G -gt 230 -and $c.B -gt 230) {
                $newBmp.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
            }
        }
    }
    
    $newBmp.Save($file.FullName, [System.Drawing.Imaging.ImageFormat]::Png)
    $newBmp.Dispose()
}

Write-Host "Done!"
