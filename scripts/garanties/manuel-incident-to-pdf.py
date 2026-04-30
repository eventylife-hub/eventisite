"""
Convertit le manuel d'incident voyage .docx en .pdf imprimable.

Usage : python scripts/garanties/manuel-incident-to-pdf.py
"""
import sys
import os
import mammoth
from xhtml2pdf import pisa

DOCX = "docs/garanties/Eventy-Life-Manuel-Incident-Voyage.docx"
PDF = "docs/garanties/Eventy-Life-Manuel-Incident-Voyage.pdf"

CSS = """
@page {
    size: A4;
    margin: 1.7cm 1.6cm 1.7cm 1.6cm;
    @frame footer_frame {
        -pdf-frame-content: footer_content;
        left: 1.6cm; width: 17.8cm; top: 28.3cm; height: 0.5cm;
    }
}
#footer_content {
    font-family: "Helvetica", "Arial", sans-serif;
    font-size: 8pt; color: #888888; text-align: center;
    border-top: 0.4pt solid #C0392B; padding-top: 1pt;
}
.pagenumber:before { content: counter(page); }
.pagecount:before { content: counter(pages); }
body {
    font-family: "Helvetica", "Arial", sans-serif;
    font-size: 9.5pt; line-height: 1.40;
    color: #1A1A1A; orphans: 3; widows: 3;
}
h1 {
    font-size: 17pt; color: #1F4E79;
    page-break-before: always; page-break-after: avoid;
    border-bottom: 2px solid #C0392B; padding-bottom: 4pt;
    margin-top: 12pt;
}
h1:first-of-type { page-break-before: auto; }
h2 {
    font-size: 12pt; color: #E87722; margin: 8pt 0 3pt 0;
    page-break-after: avoid; border-bottom: 0.5pt solid #E87722; padding-bottom: 1pt;
}
h3 { font-size: 10.5pt; color: #1F4E79; margin: 6pt 0 2pt 0; page-break-after: avoid; }
p { text-align: justify; margin: 3pt 0; page-break-inside: avoid; }
ul, ol { margin: 3pt 0 3pt 14pt; padding-left: 4pt; }
li { margin: 1.5pt 0; page-break-inside: avoid; }
table {
    width: 100%; border-collapse: collapse; margin: 4pt 0;
    font-size: 8.5pt; page-break-inside: auto;
}
tr { page-break-inside: avoid; }
th, td {
    border: 0.5pt solid #BBBBBB; padding: 2.5pt 4.5pt;
    text-align: left; vertical-align: top;
}
th { background-color: #1F4E79; color: #FFFFFF; font-weight: bold; }
tr:nth-child(even) td { background-color: #EEEEEE; }
blockquote, .quote {
    border-left: 3px solid #E87722;
    padding: 3pt 10pt; margin: 6pt 18pt;
    font-style: italic; color: #1F4E79;
    background-color: #FFF8EE; page-break-inside: avoid;
}
strong, b { font-weight: bold; }
em, i { font-style: italic; }
"""

HEADER_FOOTER = """
<div id="footer_content">EVENTY LIFE SAS — Manuel d'incident voyage · Confidentiel interne · Page <span class="pagenumber"></span> / <span class="pagecount"></span> · 30 avril 2026</div>
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
<title>Eventy Life — Manuel d'incident voyage</title>
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
