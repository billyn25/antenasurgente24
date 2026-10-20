import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
export const photoNames=['parabolica.jpeg','portero-fermax.jpeg','portero-tegui.jpeg','portero-tegui-linea-3000.jpeg','antena-televes-dat.png','amplificador-monocanal-televes.png','antena-starlink-standard.png'];
export async function prepareImages(root='dist'){
 const {default:sharp}=await import('sharp');const manifest={};
 // Shared photographs, not a separate set of files for every municipality.
 for(const name of photoNames){
  const input=path.join(root,'assets',name),buffer=fs.readFileSync(input),metadata=await sharp(buffer).metadata();
  assert(metadata.width>0&&metadata.height>0,'Imagen no válida: '+name);
  const widths=[...new Set([320,640,Math.min(960,metadata.width)].filter(w=>w<=metadata.width))].sort((a,b)=>a-b),variants=[];
  for(const width of widths){
   const {data,info}=await sharp(buffer).rotate().resize({width,withoutEnlargement:true}).webp({quality:84,effort:5}).toBuffer({resolveWithObject:true});
   const digest=createHash('sha256').update(data).digest('hex').slice(0,10),file=name.replace(/\.(jpeg|png)$/,'')+'-'+info.width+'-'+digest+'.webp';
   fs.writeFileSync(path.join(root,'assets',file),data);variants.push({file,width:info.width,height:info.height,bytes:data.length});
  }
  manifest[name]={width:metadata.width,height:metadata.height,originalBytes:buffer.length,variants};
 }
 return manifest;
}
export function responsiveHtml(html,page,manifest){
 return html.replace(/<img\b[^>]*>/g,tag=>{
  const name=tag.match(/src="\/assets\/([^"?]+)(?:\?[^\"]*)?"/)?.[1],entry=manifest[name];if(!entry)return tag;
  assert(!tag.includes('srcset='),'Imagen ya adaptada');
  const hero=/fetchpriority="high"/.test(tag),home=page.type==='home';
  const sizes=hero?'(max-width: 760px) calc(100vw - 36px), (max-width: 1250px) 44vw, 560px':home?'(max-width: 760px) 130px, (max-width: 1199px) 30vw, 240px':['town','district'].includes(page.type)?'210px':'(max-width: 760px) calc(100vw - 36px), 550px';
  const srcset=entry.variants.map(v=>'/assets/'+v.file+' '+v.width+'w').join(', ');
  tag=tag.replace(/\swidth="\d+"/,' width="'+entry.width+'"').replace(/\sheight="\d+"/,' height="'+entry.height+'"');
  return tag.replace('>',` srcset="${srcset}" sizes="${sizes}">`);
 });
}
