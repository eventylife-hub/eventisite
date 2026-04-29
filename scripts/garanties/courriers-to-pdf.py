"""
Convertit le document de courriers d'accompagnement .docx en .pdf imprimable.

Cible : transmission officielle à Atout France + APST.

Usage : python scripts/garanties/courriers-to-pdf.py
"""
import sys
import os
import mammoth
from xhtml2pdf import pisa

DOCX = "docs/garanties/Eventy-Life-Courriers-APST-AtoutFrance.docx"
PDF = "docs/garanties/Eventy-Life-Courriers-APST-AtoutFrance.pdf"

CSS = """
@page {
    size: A4;
    margin: 2cm 2cm 2cm 2cm;
    @frame footer_frame {
        -pdf-frame-content: footer_content;
        left: 2cm; width: 17cm; top: 28.4cm; height: 0.5cm;
    }
}
#footer_content {
    font-family: "Helvetica", "Arial", sans-serif;
    font-size: 8pt;
    color: #888888;
    text-align: center;
    border-top: 0.4pt solid #1F4E79;
    padding-top: 1pt;
}
.pagenumber:before { content: counter(page); }
.pagecount:before { content: counter(pages); }
body {
    font-family: "Helvetica", "Arial", sans-serif;
    font-size: 11pt;
    line-height: 1.45;
    color: #1A1A1A;
    text-align: justify;
}
p {
    margin: 4pt 0;
    text-align: justify;
}
strong, b { font-weight: bold; }
em, i { font-style: italic; }
"""

FOOTER = """
<div id="footer_content">EVENTY LIFE SAS — Courriers d'accompagnement (Atout France + APST) · Page <span class="pagenumber"></span> / <span class="pagecount"></span> · 30 avril 2026</div>
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
<title>Eventy Life — Courriers Atout France + APST</title>
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
