import fetch from 'node-fetch';

var nonce = Date.now()%10000;
var logicUrl = process.env.NODE_LOGIC_ADDRESS || 'http://localhost:8000';

function retrieveResult(obj,isQuery) {
  if(obj.error) {
    console.error(obj.error);
    return obj.error;
  }
  if(isQuery) {
    let result = Buffer.from(obj.result.response.value,'base64').toString();
    return JSON.parse(result);
  }
  else return obj.result.deliver_tx.log === 'success';
}

export async function hash(stringToHash) {
  //TODO implement secure hashing
  return 'Hash(' + stringToHash + ')';
}

export function generateIdentityProof(data) {
  return '<some-voodoo-happen-here>';
}

export async function createRequestId(privkey,data,nonce) {
  //TODO implement real request_id generating algorithm
  return await hash( 'Concat_with_nonce_' + nonce + '(' + 
      Buffer.from(JSON.stringify(data)).toString('base64') + 
    ')'
  );
}

export function getNonce() {
  return (nonce++).toString();
}

export async function queryChain(fnName,data) {
  let encoded = Buffer.from(
    fnName + '|' + 
    JSON.stringify(data)
  ).toString('base64');
  
  let result = await fetch(logicUrl + '/abci_query?data="' + encoded + '"');
  return retrieveResult(await result.json(),true);
}

export async function updateChain(fnName,data,nonce) {
  let encoded = Buffer.from(
    fnName + '|' + 
    JSON.stringify(data) + '|' + 
    nonce
  ).toString('base64');

  let result = await fetch(logicUrl + '/broadcast_tx_commit?tx="' + encoded + '"');
  return retrieveResult(await result.json());
}