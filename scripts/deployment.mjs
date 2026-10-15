// Canonical origin is never inferred from a production branch alias (main--...).
export function resolveDeployment(site,env=process.env){
 const origin=value=>{const u=new URL(value);if(u.protocol!=='https:'||u.username||u.password||u.search||u.hash||!['','/'].includes(u.pathname))throw Error('El dominio debe ser un origen HTTPS sin rutas');return u.origin;};
 const domain=origin(site.domain),preview=origin(site.previewDomain);
 const branch=['branch-deploy','deploy-preview'].includes(env.CONTEXT);
 const production=env.CONTEXT==='production';
 if(site.launchReady===true&&production&&origin(env.URL||preview)!==domain)throw Error('Lanzamiento bloqueado: el dominio de Netlify no coincide con config/site.json');
 const publicBuild=site.launchReady===true&&production;
 return {base:publicBuild?domain:branch?origin(env.DEPLOY_PRIME_URL||preview):preview,publicBuild,branch};
}
