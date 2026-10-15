import fs from 'node:fs';
import assert from 'node:assert/strict';
import {verifyFooterContacts,footerContactsVersion} from './footer-contacts.mjs';
import {fileFor} from './starlink.mjs';
const report=JSON.parse(fs.readFileSync('dist/build-report.json','utf8'));
let calls=0,whatsapps=0;
for(const p of report.pages){const result=verifyFooterContacts(fs.readFileSync(fileFor('dist',p.url),'utf8'),p.url);calls+=result.phoneLinks;whatsapps+=result.whatsappLinks;}
assert.equal(report.pages.length,report.totalPages);
const result={version:footerContactsVersion,pages:report.pages.length,calls,whatsapps,domain:report.base,publicBuild:report.publicBuild,ok:true};
fs.mkdirSync('browser-artifacts',{recursive:true});fs.writeFileSync('browser-artifacts/footer-contacts-build.json',JSON.stringify(result,null,2));
console.log('PIES COMPROBADOS: '+JSON.stringify(result));
