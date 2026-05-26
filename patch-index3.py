from pathlib import Path
import re

path = Path('public/index.html')
text = path.read_text(encoding='utf-8')
pattern = re.compile(r'const html = `\r?\n<div class="card">\r?\n.*?\r?\n`;\r?\n', re.DOTALL)
new = '''const html = `
<div class="card">
${p.image ? `<img src="${p.image}" style="width:100%;border-radius:14px;margin-bottom:12px;object-fit:cover;" />` : ""}
<h3>${p.name}</h3>
<p>السعر: ${p.price} ريال</p>
<input id="name-${p.id}" placeholder="اسم العميل">
<input id="phone-${p.id}" placeholder="رقم الجوال">
<button onclick="bookProperty(${p.id}, '${p.name}', ${p.price})">حجز</button>
</div>
`;
'''
if not pattern.search(text):
    raise SystemExit('Pattern not found')
text = pattern.sub(new, text, count=1)
path.write_text(text, encoding='utf-8')
print('updated index.html')
