import models from '../../models';
import {
  serializers, query, errors,
} from '../../utils';


const postInvoice = async (req) => {
  const tk = req.headers.authorization.split(' ')[1];
  const token = await query.accessTokens.findByToken(tk);
  const user = await models.user.findByPk(token.user_id);
  if (user === null) {
    throw new Error('O usuário ao qual seu token se refere não foi encontrado.');
  }
  console.log('user', user);
  // if (user.empresaCnpj === null) {
  //   throw new Error('Esse usuário não pertence à uma empresa, logo não pode emitir notas fiscais');
  // }

  const invoiceInfo = serializers.invoice.deserialize(req.body);


  const empresa = await models.empresa.findByPk(user.empresaCnpj, { raw: true });
  invoiceInfo.enderecoEmissor = empresa.endBlock;

  const lastBlock = await models.block.findOne({ raw: true });
  invoiceInfo.blocoConfirmacaoId = lastBlock.block_id;

  const inv = await models.invoice.create(invoiceInfo);
  return { code: 201, data: serializers.invoice.serialize(inv) };
};


const replaceInvoice = async (req) => {
  const tk = req.headers.authorization.split(' ')[1];
  const token = await query.accessTokens.findByToken(tk);
  const user = await models.user.findByPk(token.user_id);
  if (user === null) {
    throw new errors.AuthorizationError('O usuário ao qual seu token se refere não foi encontrado.');
  }
  if (user.empresaCnpj === null) {
    throw new errors.AuthorizationError('Esse usuário não pertence à uma empresa, logo não pode emitir notas fiscais');
  }

  const oldInvoice = await models.invoice.findByPk(req.params.txid, { raw: true });
  if (oldInvoice === null) {
    throw new errors.NotFoundError('Invoice', `invoiceCode ${req.params.txid}`);
  }

  const invoiceInfo = serializers.invoice.deserialize(req.body);

  const empresa = await models.empresa.findByPk(user.empresaCnpj, { raw: true });
  if (oldInvoice.enderecoEmissor !== empresa.endBlock) {
    throw new errors.AuthorizationError('A invoice que se quer alterar não foi emitida pela sua empresa.');
  }
  invoiceInfo.enderecoEmissor = empresa.endBlock;

  const lastBlock = await models.block.findOne({ raw: true });
  invoiceInfo.blocoConfirmacaoId = lastBlock.block_id;
  invoiceInfo.substitutes = oldInvoice.invoiceCode;

  const inv = await models.invoice.create(invoiceInfo);

  await models.invoice.update(
    { substitutedBy: inv.invoiceCode },
    {
      where: {
        invoiceCode: oldInvoice.invoiceCode,
      },
    },
  );
  return { code: 201, data: serializers.invoice.serialize(inv) };
};


export default {
  postInvoice,
  replaceInvoice,
};
