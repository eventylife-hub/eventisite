"""
Convertit le dossier investisseur .docx en .pdf imprimable.

Cible : présentation à investisseurs (business angels, fonds Seed, Série A).

Usage : python scripts/garanties/investisseur-to-pdf.py
"""
import sys
import os
import mammoth
from xhtml2pdf import pisa

DOCX = "docs/garanties/Eventy-Life-Dossier-Investisseur.docx"
PDF = "docs/garanties/Eventy-Life-Dossier-Investisseur.pdf"

CSS = """
@page {
    size: A4;
    margin: 2cm 1.7cm 2cm 1.8cm;
    @frame header_frame {
        -pdf-frame-content: header_content;
        left: 1.5cm; width: 18cm; top: 0.8cm; height: 0.7cm;
    }
    @frame footer_frame {
        -pdf-frame-content: footer_content;
        left: 1.5cm; width: 18cm; top: 28.4cm; height: 0.7cm;
    }
}
#header_content {
    font-family: "Helvetica", "Arial", sans-serif;
    font-size: 8pt;
    color: #888888;
    text-align: right;
    border-bottom: 0.5pt solid #E87722;
    padding-bottom: 2pt;
}
#footer_content {
    font-family: "Helvetica", "Arial", sans-serif;
    font-size: 8pt;
    color: #888888;
    text-align: center;
    border-top: 0.5pt solid #E87722;
    padding-top: 2pt;
}
.pagenumber:before { content: counter(page); }
.pagecount:before { content: counter(pages); }
body {
    font-family: "Helvetica", "Arial", sans-serif;
    font-size: 9.5pt;
    line-height: 1.35;
    color: #1A1A1A;
    orphans: 3;
    widows: 3;
}
h1 {
    font-size: 17pt;
    color: #1F4E79;
    page-break-before: always;
    page-break-after: avoid;
    border-bottom: 2px solid #E87722;
    padding-bottom: 4pt;
    margin-top: 12pt;
}
h1:first-of-type {
    page-break-before: auto;
}
h2 {
    font-size: 12pt;
    color: #E87722;
    margin: 10pt 0 4pt 0;
    page-break-after: avoid;
}
h3 {
    font-size: 10.5pt;
    color: #1F4E79;
    margin: 8pt 0 3pt 0;
    page-break-after: avoid;
}
p {
    text-align: justify;
    margin: 3pt 0;
    page-break-inside: avoid;
}
ul, ol { margin: 3pt 0 3pt 14pt; padding-left: 4pt; }
li { margin: 1.5pt 0; page-break-inside: avoid; }
table {
    width: 100%;
    border-collapse: collapse;
    margin: 4pt 0;
    font-size: 8.5pt;
    page-break-inside: auto;
}
tr { page-break-inside: avoid; }
th, td {
    border: 0.5pt solid #BBBBBB;
    padding: 3pt 5pt;
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
    border-left: 3px solid #E87722;
    padding: 3pt 10pt;
    margin: 6pt 18pt;
    font-style: italic;
    color: #1F4E79;
    background-color: #FFF8EE;
    page-break-inside: avoid;
}
strong, b { font-weight: bold; }
em, i { font-style: italic; }
"""

HEADER_FOOTER = """
<div id="header_content">Eventy Life — Dossier Investisseur · Confidentiel</div>
<div id="footer_content">Page <span class="pagenumber"></span> / <span class="pagecount"></span> · eventylife.fr · eventylife@gmail.com · 30 avril 2026</div>
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
<title>Eventy Life — Dossier Investisseur</title>
<style>{CSS}</style>
</head>
<body>
{HEADER_FOOTER}
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
