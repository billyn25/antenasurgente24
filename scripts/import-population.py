"""Optional INE import. Production builds read the versioned JSON snapshot."""
import csv, json, hashlib
from pathlib import Path
from io import StringIO
from urllib.request import urlopen
from datetime import date
ROOT=Path(__file__).resolve().parents[1]
SOURCE='https://www.ine.es/jaxiT3/files/t/csv_bdsc/68065.csv'
def main():
    cache=Path('/tmp/urgente-population.csv')
    raw=cache.read_bytes() if cache.exists() else urlopen(SOURCE,timeout=45).read()
    rows=list(csv.DictReader(StringIO(raw.decode('utf-8-sig')),delimiter=';'))
    year=max(int(r['Periodo']) for r in rows if r['Municipios'] and r['Sexo']=='Total')
    values={r['Municipios'][:5]:int(r['Total'].replace('.','')) for r in rows if r['Municipios'] and r['Sexo']=='Total' and r['Periodo']==str(year) and r['Total'].replace('.','').isdigit()}
    municipalities=json.loads((ROOT/'config/local-geography.json').read_text())['municipalities']
    missing=set(municipalities)-values.keys()
    assert not missing, 'INE sin dato para: '+str(sorted(missing))
    result={'year':year,'label':'Censo anual de población · Total de ambos sexos','source':SOURCE,'source_page':'https://www.ine.es/jaxiT3/Tabla.htm?t=68065','retrieved':date.today().isoformat(),'sha256':hashlib.sha256(raw).hexdigest(),'municipalities':{k:values[k] for k in municipalities}}
    (ROOT/'config/local-population.json').write_text(json.dumps(result,ensure_ascii=False,separators=(',',':'))+'\n')
    print('INE:',year,len(municipalities),'municipios; Bakio:',values['48012'],'Madrid:',values['28079'])
if __name__=='__main__':main()
