# Opens Windows Firewall for local Destination Studio dev ports.
# Run once as Administrator: powershell -ExecutionPolicy Bypass -File scripts/open-network-firewall.ps1

$ErrorActionPreference = 'Stop'

$rules = @(
  @{ Name = 'ArtTourisMedia Dev Frontend (5173)'; Port = 5173 },
  @{ Name = 'ArtTourisMedia Dev Admin (5174)'; Port = 5174 },
  @{ Name = 'ArtTourisMedia Dev Backend (8000)'; Port = 8000 }
)

foreach ($rule in $rules) {
  $existing = Get-NetFirewallRule -DisplayName $rule.Name -ErrorAction SilentlyContinue

  if ($existing) {
    Write-Host "Firewall rule already exists: $($rule.Name)"
    continue
  }

  New-NetFirewallRule `
    -DisplayName $rule.Name `
    -Direction Inbound `
    -Action Allow `
    -Protocol TCP `
    -LocalPort $rule.Port `
    -Profile Private,Domain | Out-Null

  Write-Host "Added firewall rule: $($rule.Name)"
}

Write-Host "`nNetwork dev ports are open on Private/Domain networks."
