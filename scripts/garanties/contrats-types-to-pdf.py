"""
Convertit les 3 contrats types .docx en .pdf imprimables prêts à signer.

Cibles :
  - Eventy-Life-Contrat-Vendeur          (5 % HT)
  - Eventy-Life-Contrat-Createur         (marge HRA + 3 %)
  - Eventy-Life-Contrat-HRA-Partenaire   (tarif négocié, marge socle Eventy)

Usage : python scripts/garanties/contrats-types-to-pdf.py
"""
import sys
import os
import mammoth
from xhtml2pdf import pisa

CONTRATS = [
    {
        "docx": "docs/garanties/Eventy-Life-Contrat-Vendeur.docx",
        "pdf":  "docs/garanties/Eventy-Life-Contrat-Vendeur.pdf",
        "footer": "EVENTY LIFE SAS — Contrat Vendeur",
    },
    {
        "docx": "docs/garanties/Eventy-Life-Contrat-Createur.docx",
        "pdf":  "docs/garanties/Eventy-Life-Contrat-Createur.pdf",
        "footer": "EVENTY LIFE SAS — Contrat Créateur",
    },
    {
        "docx": "docs/garanties/Eventy-Life-Contrat-HRA-Partenaire.docx",
        "pdf":  "docs/garanties/Eventy-Life-Contrat-HRA-Partenaire.pdf",
        "footer": "EVENTY LIFE SAS — Contrat HRA Partenaire",
    },
]

CSS_TEMPLATE = """
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
    font-size: 8pt;
    color: #888888;
    text-align: center;
    border-top: 0.4pt solid #E87722;
    padding-top: 1pt;
}
.pagenumber:before { content: counter(page); }
.pagecount:before { content: counter(pages); }
body {
    font-family: "Helvetica", "Arial", sans-serif;
    font-size: 9.5pt;
    line-height: 1.40;
    color: #1A1A1A;
}
h1 {
    font-size: 16pt;
    color: #1F4E79;
    margin: 8pt 0 4pt 0;
    page-break-after: avoid;
}
h2 {
    font-size: 12pt;
    color: #E87722;
    margin: 8pt 0 3pt 0;
    page-break-after: avoid;
    border-bottom: 0.5pt solid #E87722;
    padding-bottom: 1pt;
}
h3 {
    font-size: 10.5pt;
    color: #1F4E79;
    margin: 6pt 0 2pt 0;
    page-break-after: avoid;
}
p { text-align: justify; margin: 3pt 0; }
ul, ol { margin: 3pt 0 3pt 14pt; padding-left: 4pt; }
li { margin: 1.5pt 0; }
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
    padding: 2.5pt 4.5pt;
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

FOOTER_TEMPLATE = '<div id="footer_content">{footer} · Page <span class="pagenumber"></span> / <span class="pagecount"></span> · 30 avril 2026</div>'

def convert(c):
    print(f"Lecture : {c['docx']}")
    with open(c["docx"], "rb") as f:
        result = mammoth.convert_to_html(f)
    html_body = result.value

    full_html = f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>{c['footer']}</title>
<style>{CSS_TEMPLATE}</style>
</head>
<body>
{FOOTER_TEMPLATE.format(footer=c['footer'])}
{html_body}
</body>
</html>"""

    print(f"Génération PDF : {c['pdf']}")
    with open(c["pdf"], "wb") as out:
        pisa_status = pisa.CreatePDF(src=full_html, dest=out, encoding="utf-8")
    if pisa_status.err:
        print(f"ERREUR pisa : {pisa_status.err}", file=sys.stderr)
        sys.exit(1)
    size_kb = os.path.getsize(c["pdf"]) // 1024
    print(f"OK — {os.path.basename(c['pdf'])} ({size_kb} KB)")


def main():
    for c in CONTRATS:
        convert(c)


if __name__ == "__main__":
    main()
