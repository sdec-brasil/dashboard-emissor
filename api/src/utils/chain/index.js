import { master } from '../../setup/chainConnection';

async function registerEnterprise(json) {
  const stream = 'events';
  try {
    const address = await master.node.getNewAddress();
    json.endBlock = address;
    const tx = await master.node.grant([address, 'send,receive', 0]);

    setTimeout(async () => {
      try {
        await master.node.publishFrom([address, stream, ['COMPANY_REGISTRY', json.cnpj], { json }]);
        console.log(`Empresa ${address} Registrada com ${tx}`);
      } catch (e) {
        console.log('Error ao registrar empresa:');
        console.error(e);
      }
    }, 30000);
  } catch (e) {
    console.log('Error ao gerar endereço e permitir empresa:');
    console.error(e);
  }
}

async function generateKeyPair(json) {
  const [pair] = await master.node.createKeyPairs();
  try {
    // console.log(await master.node.dumpPrivKey([pair.address]));
    console.log('generated pair', pair.privkey);
    await master.node.importPrivKey([pair.privkey, '', false]);
    return [pair];
  } catch (e) {
    console.log(e);
  }
  return pair;
}

async function publishNote(invoice) {
  try {
    const { emitter } = invoice;
    const { taxNumber } = invoice;
    const timestamp = Date.now();
    const assetname = `${taxNumber.replace(/\./g, '').replace(/\//g, '').replace(/\-/g, '')}|NF-${timestamp}`;
    const txid = await master.node.issueFrom([
      emitter,
      emitter,
      { name: assetname, open: true, restrict: 'send' },
      0,
      1,
      0,
      invoice,
    ]);
    console.log(`Nota registrada | TxId: ${txid} | taxNumber: ${taxNumber} | Address: ${emitter}`);
  } catch (e) {
    console.log('Error | Registrar nota fiscal nova', e);
  }
}

export default {
  registerEnterprise,
  generateKeyPair,
  publishNote,
};
