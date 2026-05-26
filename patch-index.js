const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'public', 'index.html');
let text = fs.readFileSync(file, 'utf8');
const oldBlock = `data.forEach(p=>{
const html = `
<div class="card">
<h3>${p.name}</h3>
<p>السعر: ${p.price} ريال</p>
<input id="name-${p.id}" placeholder="اسم العميل">
<input id="phone-${p.id}" placeholder="رقم الجوال">
<button onclick="bookProperty(${p.id}, '${p.name}', ${p.price})">حجز</button>
</div>
`;
`;
const newBlock = `data.forEach(p=>{
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
`;
if (!text.includes(oldBlock)) {
  console.error('Old block not found.');
  process.exit(1);
}
text = text.replace(oldBlock, newBlock);
fs.writeFileSync(file, text, 'utf8');
console.log('index.html updated');
