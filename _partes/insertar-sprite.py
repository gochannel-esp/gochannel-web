# Inserta _partes/sprite.svg en el lugar del marcador <!--SPRITE--> de cada página.
# Correr desde la carpeta `sitio/`:  python _partes/insertar-sprite.py
#
# Las páginas quedan autocontenidas (los iconos funcionan incluso abriendo el
# archivo con doble clic, sin servidor). Para cambiar un icono: se edita
# sprite.svg y se vuelve a correr este script.

import pathlib, re

raiz = pathlib.Path(__file__).resolve().parent.parent
sprite = (raiz / "_partes" / "sprite.svg").read_text(encoding="utf-8").strip()

MARCA_INI = "<!--SPRITE-->"
MARCA_FIN = "<!--/SPRITE-->"
bloque = MARCA_INI + "\n" + sprite + "\n" + MARCA_FIN

patron = re.compile(re.escape(MARCA_INI) + r".*?" + re.escape(MARCA_FIN), re.S)

for pagina in sorted(raiz.glob("*.html")):
    html = pagina.read_text(encoding="utf-8")
    if MARCA_FIN in html:
        nuevo = patron.sub(lambda _: bloque, html, count=1)
    elif MARCA_INI in html:
        nuevo = html.replace(MARCA_INI, bloque, 1)
    else:
        print(f"  sin marcador: {pagina.name}")
        continue
    if nuevo != html:
        pagina.write_text(nuevo, encoding="utf-8")
        print(f"  actualizado: {pagina.name}")
    else:
        print(f"  sin cambios: {pagina.name}")
