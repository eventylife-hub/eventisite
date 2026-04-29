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
    margin: 2.2cm 1.8cm 2.2cm 2cm;
    @frame header_frame {
        -pdf-frame-content: header_content;
        left: 1.5cm; width: 18cm; top: 0.8cm; height: 0.8cm;
    }
    @frame footer_frame {
        -pdf-frame-content: footer_content;
        left: 1.5cm; width: 18cm; top: 28.2cm; height: 0.8cm;
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
.pagenumber:before {
    content: counter(page);
}
.pagecount:before {
    content: counter(pages);
}
body {
    font-family: "Helvetica", "Arial", sans-serif;
    font-size: 10pt;
    line-height: 1.4;
    color: #1A1A1A;
    orphans: 3;
    widows: 3;
}
h1 {
    font-size: 18pt;
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
    font-size: 13pt;
    color: #E87722;
    margin-top: 14pt;
    page-break-after: avoid;
    page-break-inside: avoid;
}
h3 {
    font-size: 11pt;
    color: #1F4E79;
    margin-top: 10pt;
    page-break-after: avoid;
    page-break-inside: avoid;
}
p {
    text-align: justify;
    margin: 4pt 0;
    page-break-inside: avoid;
}
ul, ol {
    margin: 4pt 0 4pt 16pt;
    padding-left: 6pt;
}
li { margin: 2pt 0; page-break-inside: avoid; }
table {
    width: 100%;
    border-collapse: collapse;
    margin: 6pt 0;
    font-size: 8.5pt;
    page-break-inside: auto;
}
tr {
    page-break-inside: avoid;
}
th, td {
    border: 1px solid #BBBBBB;
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
    border-left: 4px solid #E87722;
    padding: 4pt 12pt;
    margin: 8pt 24pt;
    font-style: italic;
    color: #1F4E79;
    background-color: #FFF8EE;
    page-break-inside: avoid;
}
strong, b { font-weight: bold; }
em, i { font-style: italic; }
"""

HEADER_FOOTER = """
<div id="header_content">Eventy Life — Dossier de Garantie Financière (APST · Atout France)</div>
<div id="footer_content">Page <span class="pagenumber"></span> / <span class="pagecount"></span> · eventylife.fr · eventylife@gmail.com · Confidentiel</div>
"""

def main():
    # 1. docx -> HTML via mammoth
    print(f"Lecture du fichier : {DOCX}")
    with open(DOCX, "rb") as f:
        result = mammoth.convert_to_html(f)
    html_body = result.value

    # Wrap in full HTML doc with CSS + header/footer frames
    full_html = f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>Eventy Life — Dossier de Garantie Financière</title>
<style>{CSS}</style>
</head>
<body>
{HEADER_FOOTER}
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
