import EventSource from 'eventsource';
import axios from 'axios';
import models from '../models';


export default function () {
  console.log('SETUP - Setting explorer listeners...');

  const companiesStream = new EventSource('http://159.89.86.197:8000/v1/events/emitters');
  companiesStream.addEventListener('emitter:new', async (e) => {
    console.log(`companiesStream: ${e.type} - ${e.data}`);

    const [cnpj, address, txid] = e.data.split('|');
    const addrInstance = await models.address.findByPk(address);
    if (addrInstance !== null) {
      console.log('Found an address that belongs to us!');
      // the address was emitted by us.
      const user = await models.user.findOne({
        where: { walletId: addrInstance.get('walletId') },
      });
      if (user === null) {
        throw new Error(`AddressInstance ${addrInstance.get('id')} is not in the wallet of any user.
        (walletId = ${addrInstance.get('walletId')})`);
      }
      let company = await models.empresa.findOne(
        { where: { cnpj } },
      );
      if (company === null) {
        // company we dont have this company or new company

        // get data from public worker
        const response = await axios.get(`http://159.89.86.197:8000/v1/companies/${company.get('cnpj')}`);

        // create company
        company = await models.empresa.create({
          ...response,
          user_id: user.get('id'),
        });
        // change addrInstance wallet to the wallet of the company
        await addrInstance.update({ walletId: company.get('walletId') });
        console.log(`Address ${addrInstance.get('id')} now belongs to company 
          ${company.get('nomeFantasia')}.`);
      }
    }
    // if we already have this company created,
    // the company already have a wallet and an address.
    // We will just ignore this new address authorization.
  });

  const invoicesStream = new EventSource('http://159.89.86.197:8000/v1/events/invoices');
  invoicesStream.addEventListener('invoice:new', (e) => {
    console.log(`invoicesStream: ${e.type} - ${e.data}`);
  });

  //   const simulatorStream = new EventSource('http://159.89.86.197:8000/v1/events/simulator/1');
  //   simulatorStream.addEventListener('simulator:log', (e) => {
  // console.log(`${e.type} - ${e.data}`);
  //   });

  console.log('INFO - Listeners set.');
}
