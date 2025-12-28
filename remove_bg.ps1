
Add-Type -AssemblyName System.Drawing

function Remove-WhiteBackground {
    param (
        [string]$inputPath,
        [int]$tolerance = 30
    )

    try {
        $img = [System.Drawing.Bitmap]::FromFile($inputPath)
        $newImg = New-Object System.Drawing.Bitmap($img.Width, $img.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
        
        for ($x = 0; $x -lt $img.Width; $x++) {
            for ($y = 0; $y -lt $img.Height; $y++) {
                $pixel = $img.GetPixel($x, $y)
                
                # Check for white (R, G, B > 255 - tolerance)
                if ($pixel.R -gt (255 - $tolerance) -and $pixel.G -gt (255 - $tolerance) -and $pixel.B -gt (255 - $tolerance)) {
                    $newImg.SetPixel($x, $y, [System.Drawing.Color]::Transparent)
                } else {
                    $newImg.SetPixel($x, $y, $pixel)
                }
            }
        }
        
        $img.Dispose()
        $outputPath = [System.IO.Path]::ChangeExtension($inputPath, ".png")
        $newImg.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
        $newImg.Dispose()
        Write-Host "Processed: $inputPath -> $outputPath"
    } catch {
        Write-Host "Error processing $inputPath : $_"
    }
}

# Houses
$houseDir = "c:\Users\MSI\Downloads\ferm1\public\assets\houses"
if (Test-Path $houseDir) {
    Get-ChildItem $houseDir -Filter "*.png" | ForEach-Object {
        Remove-WhiteBackground -inputPath $_.FullName
    }
}

# Animals
$animalDir = "c:\Users\MSI\Downloads\ferm1\public\assets\animals"
if (Test-Path $animalDir) {
    Get-ChildItem $animalDir -Filter "*.png" | ForEach-Object {
        Remove-WhiteBackground -inputPath $_.FullName
    }
}

# Plot
$plotPath = "c:\Users\MSI\Downloads\ferm1\public\assets\plot.png"
if (Test-Path $plotPath) {
    Remove-WhiteBackground -inputPath $plotPath
}

# Logo
$logoPath = "c:\Users\MSI\Downloads\ferm1\public\assets\logo.jpg"
if (Test-Path $logoPath) {
    Remove-WhiteBackground -inputPath $logoPath
}
