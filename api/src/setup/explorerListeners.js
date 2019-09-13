import EventSource from 'eventsource';
import axios from 'axios';
import models from '../models';


export default function () {
  console.log('SETUP - Setting explorer listeners...');

  const explorerUrl = process.env.EXPLORER_URL || 'http://159.89.86.197:8000';
  const companiesStream = new EventSource(`${explorerUrl}/v1/events/emitters`);
  companiesStream.addEventListener('emitter:new', async (e) => {
    console.log(`companiesStream: ${e.type} - ${e.data}`);
    const data = e.data.replace('"', '');
    const [taxNumber, address, txid] = data.split('|');
    const addrInstance = await models.address.findByPk(address);
    if (addrInstance !== null) {
      console.log('Found an address that belongs to us!');
      // the address was emitted by us.
      const user = await models.user.findOne({
        where: { walletId: addrInstance.get('walletId') },
      });
      if (user === null) {
        throw new Error(`AddressInstance ${addrInstance.get('address')} is not in the wallet of any user.
        (walletId = ${addrInstance.get('walletId')})`);
      }
      let company = await models.empresa.findByPk(taxNumber);
      if (company === null) {
        // we dont have this company or new company

        // get data from public api explorer
        const response = await axios.get(`${explorerUrl}/v1/companies/${taxNumber}`);
        // create company
        console.log(response.data);
        company = await models.empresa.create({
          ...response.data,
          user_id: user.get('id'),
        });
        // change addrInstance wallet to the wallet of the company
        await addrInstance.update({ walletId: company.get('walletId') });
        console.log(`Address ${addrInstance.get('address')} now belongs to company 
          ${company.get('name')}.`);
      }
    }
    // if we already have this company created,
    // the company already have a wallet and an address.
    // We will just ignore this new address authorization.
  });

  const invoicesStream = new EventSource(`${explorerUrl}/v1/events/invoices`);
  invoicesStream.addEventListener('invoice:new', (e) => {
    console.log(`invoicesStream: ${e.type} - ${e.data}`);
  });

  //   const simulatorStream = new EventSource('http://159.89.86.197:8000/v1/events/simulator/1');
  //   simulatorStream.addEventListener('simulator:log', (e) => {
  // console.log(`${e.type} - ${e.data}`);
  //   });

  console.log('INFO - Listeners set.');
}
