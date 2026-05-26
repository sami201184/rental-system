from pathlib import Path

path = Path('public/index.html')
text = path.read_text(encoding='utf-8')
old = '''data.forEach(p=>{
const html = `
<div class="card">
<h3>${p.name}</h3>
<p>السعر: ${p.price} ريال</p>
<input id="name-${p.id}" placeholder="اسم العميل">
<input id="phone-${p.id}" placeholder="رقم الجوال">
<button onclick="bookProperty(${p.id}, '${p.name}', ${p.price})">حجز</button>
</div>
`;
'''
new = '''data.forEach(p=>{
const html = `
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
if old not in text:
    raise SystemExit('Pattern not found')
text = text.replace(old, new)
path.write_text(text, encoding='utf-8')
print('updated index.html')
