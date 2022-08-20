# Hash To Markdown Converter

This is an API introductory mini-project.
The converter receives a hash representation of a file (MD5/SHA-1/SHA-256), then uses VirusTotal's API platform 
which analyses the file using more than 50 online antivirus scan engines. 
(https://www.virustotal.com/gui/home/upload)
The converter then collects all relevant data and neatly organizes it into a Markdown text table like so:

### File Information
MD5|SHA-1|SHA-256|
|:---|:-----|:-------|
|84c82835a5d21bbcf75a61706d8ab549|5ff465afaabcbf0150d1a3ab2c2e74f3a4426467|ed01ebfbc9eb5bbea545af4d01bf5f1071661840480439c6e5babe8e080e41aa|

### Last Analysis Status
Total Scans|Malicious Scans|
|:-----------|:---------------|
|72|60|

### Last Analysis Result
Scan Origin|Scan Result|
|:-----------|:-----------|
|Bkav|W32.WannaCrypLTQ.Trojan|
|Lionic|None|
|tehtris|Generic.Malware|
|MicroWorld-eScan|Trojan.Ransom.WannaCryptor.A|
|FireEye|Generic.mg.84c82835a5d21bbc|

