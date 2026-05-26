const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'public', 'index.html');
let text = fs.readFileSync(file, 'utf8');
const pattern = /const html = `\r?\n<div class="card">[\s\S]*?\r?\n`;\r?\n/;
const replacement = `const html = `\r\n<div class="card">\r\n${p.image ? `<img src="${p.image}" style="width:100%;border-radius:14px;margin-bottom:12px;object-fit:cover;" />` : ""}\r\n<h3>${p.name}</h3>\r\n<p>السعر: ${p.price} ريال</p>\r\n<input id="name-${p.id}" placeholder="اسم العميل">\r\n<input id="phone-${p.id}" placeholder="رقم الجوال">\r\n<button onclick="bookProperty(${p.id}, '${p.name}', ${p.price})">حجز</button>\r\n</div>\r\n`;\r\n`;
if (!pattern.test(text)) {
  console.error('pattern not found');
  process.exit(1);
}
text = text.replace(pattern, replacement);
fs.writeFileSync(file, text, 'utf8');
console.log('updated index.html');
