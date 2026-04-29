"""
Convertit le résumé exécutif .docx en .pdf imprimable.
Cible : partenaires bancaires / investisseurs · 2 pages A4.

Usage : python scripts/garanties/resume-to-pdf.py
"""
import sys
import os
import mammoth
from xhtml2pdf import pisa

DOCX = "docs/garanties/Eventy-Life-Resume-Executif.docx"
PDF = "docs/garanties/Eventy-Life-Resume-Executif.pdf"

CSS = """
@page {
    size: A4;
    margin: 1.4cm 1.3cm 1.4cm 1.3cm;
    @frame footer_frame {
        -pdf-frame-content: footer_content;
        left: 1.3cm; width: 18.5cm; top: 28.5cm; height: 0.5cm;
    }
}
#footer_content {
    font-family: "Helvetica", "Arial", sans-serif;
    font-size: 7pt;
    color: #888888;
    text-align: center;
    border-top: 0.5pt solid #E87722;
    padding-top: 1pt;
}
.pagenumber:before { content: counter(page); }
.pagecount:before { content: counter(pages); }
body {
    font-family: "Helvetica", "Arial", sans-serif;
    font-size: 9pt;
    line-height: 1.25;
    color: #1A1A1A;
}
h1 {
    font-size: 14pt;
    color: #1F4E79;
    margin: 6pt 0 3pt 0;
    page-break-after: avoid;
}
h2 {
    font-size: 11pt;
    color: #E87722;
    margin: 8pt 0 3pt 0;
    page-break-after: avoid;
    border-bottom: 1px solid #E87722;
    padding-bottom: 1pt;
}
h3 {
    font-size: 10pt;
    color: #1F4E79;
    margin: 6pt 0 2pt 0;
    page-break-after: avoid;
}
p {
    text-align: justify;
    margin: 2pt 0;
}
ul, ol { margin: 2pt 0 2pt 14pt; padding-left: 4pt; }
li { margin: 1pt 0; }
table {
    width: 100%;
    border-collapse: collapse;
    margin: 3pt 0;
    font-size: 8pt;
    page-break-inside: auto;
}
tr { page-break-inside: avoid; }
th, td {
    border: 0.5pt solid #BBBBBB;
    padding: 2pt 4pt;
    text-align: left;
    vertical-align: top;
}
th {
    background-color: #1F4E79;
    color: #FFFFFF;
    font-weight: bold;
}
tr:nth-child(even) td { background-color: #EEEEEE; }
strong, b { font-weight: bold; }
em, i { font-style: italic; }
"""

FOOTER = """
<div id="footer_content">Eventy Life SAS — Résumé exécutif (banquier / investisseur) · Page <span class="pagenumber"></span> / <span class="pagecount"></span> · Confidentiel · 30 avril 2026</div>
"""

def main():
    print(f"Lecture : {DOCX}")
    with open(DOCX, "rb") as f:
        result = mammoth.convert_to_html(f)
    html_body = result.value

    full_html = f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>Eventy Life — Résumé Exécutif</title>
<style>{CSS}</style>
</head>
<body>
{FOOTER}
{html_body}
</body>
</html>"""

    print(f"Génération PDF : {PDF}")
    with open(PDF, "wb") as out:
        pisa_status = pisa.CreatePDF(src=full_html, dest=out, encoding="utf-8")

    if pisa_status.err:
        print(f"ERREUR pisa : {pisa_status.err}", file=sys.stderr)
        sys.exit(1)

    size_kb = os.path.getsize(PDF) // 1024
    print(f"OK — PDF généré : {PDF} ({size_kb} KB)")


if __name__ == "__main__":
    main()
