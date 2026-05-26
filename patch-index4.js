const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'public', 'index.html');
let text = fs.readFileSync(file, 'utf8');
const oldText = 'const html = `\n<div class="card">\n<h3>${p.name}</h3>\n<p>السعر: ${p.price} ريال</p>\n<input id="name-${p.id}" placeholder="اسم العميل">\n<input id="phone-${p.id}" placeholder="رقم الجوال">\n<button onclick="bookProperty(${p.id}, \'${p.name}\', ${p.price})">حجز</button>\n</div>\n`;';
const newText = 'const html = `\n<div class="card">\n${p.image ? `<img src="${p.image}" style="width:100%;border-radius:14px;margin-bottom:12px;object-fit:cover;" />` : ""}\n<h3>${p.name}</h3>\n<p>السعر: ${p.price} ريال</p>\n<input id="name-${p.id}" placeholder="اسم العميل">\n<input id="phone-${p.id}" placeholder="رقم الجوال">\n<button onclick="bookProperty(${p.id}, \'${p.name}\', ${p.price})">حجز</button>\n</div>\n`;';
if (!text.includes(oldText)) {
  console.error('old block not found');
  process.exit(1);
}
text = text.replace(oldText, newText);
fs.writeFileSync(file, text, 'utf8');
console.log('updated index.html');
