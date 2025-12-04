import { NfeAuthorizerPipeline } from 'nfets/nfe';

const pipeline = new NfeAuthorizerPipeline({
  pfxPathOrBase64: 'path/to/certificate.pfx',
  password: 'password',
});

console.log(typeof pipeline.execute === 'function');
