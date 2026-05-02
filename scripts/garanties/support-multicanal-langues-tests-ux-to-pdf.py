"""
Convertit les 3 documents .docx en .pdf imprimables :
  - Eventy-Life-Politique-Support-Multicanal
  - Eventy-Life-Politique-Langues-Traduction
  - Eventy-Life-Plan-Tests-Utilisateurs-Qualitatifs

Usage : python scripts/garanties/support-multicanal-langues-tests-ux-to-pdf.py
"""
import sys, os
import mammoth
from xhtml2pdf import pisa

DOCS = [
    {"docx": "docs/garanties/Eventy-Life-Politique-Support-Multicanal.docx",
     "pdf":  "docs/garanties/Eventy-Life-Politique-Support-Multicanal.pdf",
     "footer": "EVENTY LIFE SAS — Politique support multicanal"},
    {"docx": "docs/garanties/Eventy-Life-Politique-Langues-Traduction.docx",
     "pdf":  "docs/garanties/Eventy-Life-Politique-Langues-Traduction.pdf",
     "footer": "EVENTY LIFE SAS — Politique langues et traduction"},
    {"docx": "docs/garanties/Eventy-Life-Plan-Tests-Utilisateurs-Qualitatifs.docx",
     "pdf":  "docs/garanties/Eventy-Life-Plan-Tests-Utilisateurs-Qualitatifs.pdf",
     "footer": "EVENTY LIFE SAS — Plan tests utilisateurs qualitatifs"},
]

CSS = """
@page { size: A4; margin: 1.7cm 1.6cm 1.7cm 1.6cm;
  @frame footer_frame { -pdf-frame-content: footer_content;
    left: 1.6cm; width: 17.8cm; top: 28.3cm; height: 0.5cm; } }
#footer_content { font-family: Helvetica, Arial, sans-serif; font-size: 8pt; color: #888; text-align: center;
  border-top: 0.4pt solid #E87722; padding-top: 1pt; }
.pagenumber:before { content: counter(page); }
.pagecount:before { content: counter(pages); }
body { font-family: Helvetica, Arial, sans-serif; font-size: 9.5pt; line-height: 1.40; color: #1A1A1A; orphans: 3; widows: 3; }
h1 { font-size: 16pt; color: #1F4E79; margin: 8pt 0 4pt 0; page-break-after: avoid; }
h2 { font-size: 12pt; color: #E87722; margin: 8pt 0 3pt 0; page-break-after: avoid;
  border-bottom: 0.5pt solid #E87722; padding-bottom: 1pt; }
h3 { font-size: 10.5pt; color: #1F4E79; margin: 6pt 0 2pt 0; page-break-after: avoid; }
p { text-align: justify; margin: 3pt 0; page-break-inside: avoid; }
ul, ol { margin: 3pt 0 3pt 14pt; padding-left: 4pt; }
li { margin: 1.5pt 0; page-break-inside: avoid; }
table { width: 100%; border-collapse: collapse; margin: 4pt 0; font-size: 8.5pt; page-break-inside: auto; }
tr { page-break-inside: avoid; }
th, td { border: 0.5pt solid #BBB; padding: 2.5pt 4.5pt; text-align: left; vertical-align: top; }
th { background-color: #1F4E79; color: white; font-weight: bold; }
tr:nth-child(even) td { background-color: #EEE; }
strong, b { font-weight: bold; }
em, i { font-style: italic; }
"""

FOOTER = '<div id="footer_content">{footer} · Page <span class="pagenumber"></span> / <span class="pagecount"></span> · 2 mai 2026</div>'

def convert(d):
    print(f"Lecture : {d['docx']}")
    with open(d["docx"], "rb") as f:
        result = mammoth.convert_to_html(f)
    full_html = f"""<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8">
<title>{d['footer']}</title><style>{CSS}</style></head><body>
{FOOTER.format(footer=d['footer'])}
{result.value}
</body></html>"""
    with open(d["pdf"], "wb") as out:
        ps = pisa.CreatePDF(src=full_html, dest=out, encoding="utf-8")
    if ps.err:
        print(f"ERREUR pisa : {ps.err}", file=sys.stderr); sys.exit(1)
    print(f"OK — {os.path.basename(d['pdf'])} ({os.path.getsize(d['pdf'])//1024} KB)")

for d in DOCS:
    convert(d)
