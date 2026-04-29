"""
Convertit le dossier .docx en .pdf via mammoth (docx -> HTML) puis xhtml2pdf (HTML -> PDF).

Usage : python scripts/garanties/docx-to-pdf.py
"""
import sys
import os
import mammoth
from xhtml2pdf import pisa

DOCX = "docs/garanties/Eventy-Life-Dossier-Garantie-Financiere-COMPLET.docx"
PDF = "docs/garanties/Eventy-Life-Dossier-Garantie-Financiere-COMPLET.pdf"

CSS = """
@page {
    size: A4;
    margin: 2cm 1.5cm 2cm 1.5cm;
}
body {
    font-family: "Helvetica", "Arial", sans-serif;
    font-size: 10pt;
    line-height: 1.4;
    color: #1A1A1A;
}
h1 {
    font-size: 18pt;
    color: #1F4E79;
    page-break-before: always;
    border-bottom: 2px solid #E87722;
    padding-bottom: 4pt;
    margin-top: 12pt;
}
h1:first-of-type {
    page-break-before: auto;
}
h2 {
    font-size: 13pt;
    color: #E87722;
    margin-top: 14pt;
}
h3 {
    font-size: 11pt;
    color: #1F4E79;
    margin-top: 10pt;
}
p {
    text-align: justify;
    margin: 4pt 0;
}
ul, ol {
    margin: 4pt 0 4pt 16pt;
    padding-left: 6pt;
}
li { margin: 2pt 0; }
table {
    width: 100%;
    border-collapse: collapse;
    margin: 6pt 0;
    font-size: 9pt;
}
th, td {
    border: 1px solid #BBBBBB;
    padding: 4pt 6pt;
    text-align: left;
    vertical-align: top;
}
th {
    background-color: #1F4E79;
    color: #FFFFFF;
    font-weight: bold;
}
tr:nth-child(even) td { background-color: #EEEEEE; }
blockquote, .quote {
    border-left: 4px solid #E87722;
    padding: 4pt 12pt;
    margin: 8pt 24pt;
    font-style: italic;
    color: #1F4E79;
    background-color: #FFF8EE;
}
strong, b { font-weight: bold; }
em, i { font-style: italic; }
"""

def main():
    # 1. docx -> HTML via mammoth
    print(f"Lecture du fichier : {DOCX}")
    with open(DOCX, "rb") as f:
        result = mammoth.convert_to_html(f)
    html_body = result.value

    # Wrap in full HTML doc with CSS
    full_html = f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>Eventy Life — Dossier de Garantie Financière</title>
<style>{CSS}</style>
</head>
<body>
{html_body}
</body>
</html>"""

    # Optional: save HTML for debugging
    with open("docs/garanties/dossier-debug.html", "w", encoding="utf-8") as f:
        f.write(full_html)
    print("HTML intermédiaire sauvegardé")

    # 2. HTML -> PDF via xhtml2pdf
    print(f"Génération du PDF : {PDF}")
    with open(PDF, "wb") as out:
        pisa_status = pisa.CreatePDF(src=full_html, dest=out, encoding="utf-8")

    if pisa_status.err:
        print(f"ERREUR pisa : {pisa_status.err}", file=sys.stderr)
        sys.exit(1)

    size_kb = os.path.getsize(PDF) // 1024
    print(f"OK — PDF generated: {PDF} ({size_kb} KB)")


if __name__ == "__main__":
    main()
