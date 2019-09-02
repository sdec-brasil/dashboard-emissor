
/* eslint-disable quote-props */
import { docker } from '../utils';

const Multichain = require('multinodejs');

const dockers = docker;

const masterPort = 8001;
const masterPassword = 'this-is-insecure-change-it';
const slavePort = 8002;

const stream = 'events';

const master = {};
const slave = {};

async function setupChainConnection() {
  console.log('SETUP - Connecting to chain...');
  const slaveName = process.env.SLAVE_NAME || 'docker-multichain_slavenode_1';
  let slavePassword = await dockers.exec(
    `docker exec ${slaveName} cat root/.multichain/MyChain/multichain.conf`,
  );
  slavePassword = dockers.extractPassword(slavePassword);

  slave.node = Multichain({
    port: slavePort,
    host: 'localhost',
    user: 'multichainrpc',
    pass: slavePassword,
  });
  slave.addr = '';

  slave.addr = (await slave.node.getAddresses())['0'].toString();

  master.node = Multichain({
    port: masterPort,
    host: 'localhost',
    user: 'multichainrpc',
    pass: masterPassword,
  });
  master.addr = '';

  master.addr = (await master.node.getAddresses())['0'].toString();

  const masterName = process.env.MASTER_NAME || 'docker-multichain_masternode_1';
  await dockers.exec(`docker exec ${masterName} multichain-cli MyChain grant ${slave.addr} activate,mine 0`);
  console.log('INFO - Connected to chain.');
}

export { setupChainConnection, master, slave };
