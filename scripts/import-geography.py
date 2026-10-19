"""Optional editorial import. Build uses the checked-in snapshot, without network."""
import json, math, hashlib, unicodedata, re
from pathlib import Path
from urllib.request import urlopen
from urllib.parse import urlsplit, parse_qs
from io import BytesIO
from datetime import date
from openpyxl import load_workbook

ROOT = Path(__file__).resolve().parents[1]
SOURCE = 'https://www.ign.es/resources/ane/Informacion_Geografica_Destacada/IGN_INFOGEO_MUNICIPIOS.xlsx'
TOWNS = 'https://raw.githubusercontent.com/codeforspain/ds-organizacion-administrativa/1e9c99280ef4d7a12def33cafc3df59d9fc1f688/data/municipios.json'
PROVINCES = dict(zip(['01','33','05','48','09','39','16','20','19','26','24','28','31','34','37','40','42','45','47','49'], ['alava','asturias','avila','bizkaia','burgos','cantabria','cuenca','gipuzkoa','guadalajara','la-rioja','leon','madrid','navarra','palencia','salamanca','segovia','soria','toledo','valladolid','zamora']))
def fetch(url, cache):
    p = Path(cache)
    return p.read_bytes() if p.exists() else urlopen(url, timeout=45).read()
def slug(name):
    return re.sub('[^a-z0-9]+', '-', ''.join(c for c in unicodedata.normalize('NFD',name.lower()) if not unicodedata.combining(c))).strip('-')
def distance(a,b):
    x,y,u,v = map(math.radians,[a['lat'],a['lon'],b['lat'],b['lon']])
    h=math.sin((x-u)/2)**2+math.cos(x)*math.cos(u)*math.sin((y-v)/2)**2
    return 6371*2*math.asin(min(1,math.sqrt(h)))
def main():
    raw=fetch(SOURCE,'/tmp/urgente-ign.xlsx'); rows=load_workbook(BytesIO(raw),read_only=True,data_only=True)['IGN_INFOGEO_MUNICIPIOS'].values
    next(rows); geography={str(r[0]).zfill(5):r for r in rows if r[0]}
    towns=json.loads(fetch(TOWNS,'/tmp/urgente-municipios.json')); records={}
    for t in towns:
        if t['provincia_id'] not in PROVINCES: continue
        code=t['municipio_id']; g=geography[code]
        name=t['nombre'].replace('\\/','/'); name=re.sub(r'^(.+), (El|La|Los|Las)$',r'\2 \1',name).replace('/',' / ')
        lon,lat=map(float,parse_qs(urlsplit(g[6]).query)['center'][0].split(','))
        route='/provincias/'+PROVINCES[t['provincia_id']]+'/'+slug(name)+'/'
        records[code]={'url':route,'name':name,'capital':g[4],'lat':lat,'lon':lon}
    assert len(records)==4035
    for code,a in records.items():
        a['nearby']=[[k,round(d,1)] for d,k in sorted((distance(a,b),k) for k,b in records.items() if k!=code)[:6]]
    result={'source':SOURCE,'source_page':'https://www.ign.es/resources/ane/Informacion_Geografica_Destacada/IGN_INFOGEO_MUNICIPIOS.html','credit':'Obra derivada de NGMEP, IGN, CC BY 4.0','retrieved':date.today().isoformat(),'sha256':hashlib.sha256(raw).hexdigest(),'method':'Haversine entre referencias IGN. Línea recta entre municipios del directorio; no carretera ni tiempos de llegada.','municipalities':records}
    (ROOT/'config/local-geography.json').write_text(json.dumps(result,ensure_ascii=False,separators=(',',':'))+'\n')
    print('Geografía verificada:',len(records),'municipios')
if __name__=='__main__':main()
