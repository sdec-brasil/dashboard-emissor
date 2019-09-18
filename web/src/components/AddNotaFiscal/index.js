import React, { useState } from 'react';
import {
  UikFormInputGroup, UikInput, UikButton, UikSelect,
} from '../../@uik';
import api from '../../utils/api';
import './style.scss';


const AddNotaFiscal = () => {
  const [data, setData] = useState({ });
  const [errors, setErrors] = useState({ provision: {} });
  const submit = (e) => {
    e.preventDefault();
    // console.log(data);
  };

  const cleanError = (field, group = undefined) => {
    if (group) {
      setErrors({
        ...errors,
        [group]: { ...errors[group], [field]: undefined },
      });
    } else {
      setErrors({
        ...errors,
        field: undefined,
      });
    }
  };

  const writeError = (message, field, group = undefined) => {
    if (group) {
      setErrors({
        ...errors,
        [group]: { ...errors[group], [field]: message },
      });
    } else {
      setErrors({
        ...errors,
        field: message,
      });
    }
  };


  return (
    <form onSubmit={e => submit(e)} onChange={(e) => { console.log(data); }}>
      {/* {Object.keys(data).map(key => (<div key={key}>{key}: {data[key]}</div>))} */}
      <UikFormInputGroup>
        <UikSelect label='emissor'
          placeholder="Emissor"
          onChange={value => setData({ ...data, emitter: value.label })}
          options={[
            {
              value: 1,
              label: 'Delete',
            },
            {
              value: 2,
              label: 'Something',
            },
            {
              value: 3,
              label: 'Here',
            },
          ]}
/>
        <UikInput
          label="Tomador Encriptado"
          placeholder="John Smith"
          onChange={e => setData({ ...data, encriptedBorrower: e.target.value })}
  />
        <UikInput
          label="CPF/CNPJ"
          placeholder="somente números"
          onChange={e => setData({ ...data, taxNumber: e.target.value })}
  />
        <UikInput
          type='date'
          label="Data de Emissão"
          name='provision.issuedOn'
          onChange={e => setData({
            ...data,
            provision: { ...data.provision, issuedOn: e.target.value },
          })}
  />
        <UikInput
          type='number'
          label="Codigo do Municipio"
          name='provision.cityServiceLocation'
          onChange={e => setData({
            ...data,
            provision: { ...data.provision, cityServiceLocation: e.target.value },
          })}
  />
        <UikInput
          type='number'
          label="Código de Serviço"
          name='provision.serviceCode'
          onChange={e => setData({
            ...data,
            provision: { ...data.provision, serviceCode: e.target.value },
          })}
  />
        <UikInput
          type='number'
          label="CNAE"
          name='provision.cnaeCode'
          onChange={e => setData({
            ...data,
            provision: { ...data.provision, cnaeCode: e.target.value },
          })}
  />
        <UikInput
          type='number'
          label="NBS"
          name='provision.nbsCode'
          onChange={e => setData({
            ...data,
            provision: { ...data.provision, nbsCode: e.target.value },
          })}
  />
        <UikInput
          label="Descrição dos Serviços"
          name='provision.description'
          onChange={e => setData({
            ...data,
            provision: { ...data.provision, description: e.target.value },
          })}
          />
        <UikInput
          label="Valor dos Serviços"
          type='number'
          name='provision.servicesAmount'
          errorMessage={errors.provision.servicesAmount}
          onChange={(e) => {
            cleanError('servicesAmount', 'provision');
            if (e.target.value < 0) {
              writeError('Números positivos somente.', 'servicesAmount', 'provision');
              console.log('errors', errors);
            }
            console.log(this);
            setData({
              ...data,
              provision: { ...data.provision, servicesAmount: e.target.value },
            });
          }}
          />
        <UikInput
          label="Incentivo Fiscal"
          name='tributes.incentivoFiscal'
          onChange={e => setData({
            ...data,
            tributes: { ...data.tributes, incentivoFiscal: e.target.value },
          })}
          />


        {/* body('tributes.incentivoFiscal')
    .isBoolean(),
  body('tributes.issExigibility', 'Deve ser um inteiro entre 1 e 7')
    .isInt({ min: 1, max: 7 }),
  body('tributes.processNumber', 'Deve ser uma string de até 30 caracteres')
    .isString().isLength({ max: 30 }).optional(),
  body('tributes.issRate').isNumeric(),
  body('tributes.issAmount').isInt(),
  body('tributes.issWithheld').isBoolean(),
  body('tributes.retentionResponsible')
    .isInt({ min: 1, max: 2 })
    .optional(),
  body('tributes.specialTaxRegime')
    .isInt({ min: 0, max: 16 }).optional(),
  body('tributes.pisAmount').isInt().optional(),
  body('tributes.cofinsAmount').isInt().optional(),
  body('tributes.inssAmount').isInt().optional(),
  body('tributes.irAmount').isInt().optional(),
  body('tributes.csllAmount').isInt().optional(),
  body('tributes.unconditionedDiscountAmount').isInt().optional(),
  body('tributes.conditionedDiscountAmount').isInt().optional(),
  body('tributes.othersAmountsWithheld').isInt().optional(),
  body('tributes.deductionsAmount').isInt().optional(),
  body('tributes.calculationBasis', 'O valor esta incorreto').isInt()
    .custom(async (value, { req }) => {
      const data = req.body;
      let targetValue = parseInt(data.provision.servicesAmount, 10) || 0;
      targetValue -= parseInt(data.tributes.deductionsAmount, 10) || 0;
      targetValue -= parseInt(data.tributes.unconditionedDiscountAmount, 10) || 0;
      if (parseInt(value, 10) !== targetValue) {
        throw new Error('A base de calculo está errada.');
      }
    }),
  body('tributes.approximateTax').isInt().optional(),
  body('tributes.netValueNfse')
    .isInt()
    .custom(async (value, { req }) => {
      const data = req.body;
      let targetValue = (parseInt(data.provision.servicesAmount, 10) || 0);
      targetValue -= (parseInt(data.tributes.pisAmount, 10) || 0);
      targetValue -= (parseInt(data.tributes.cofinsAmount, 10) || 0);
      targetValue -= (parseInt(data.tributes.inssAmount, 10) || 0);
      targetValue -= (parseInt(data.tributes.irAmount, 10) || 0);
      targetValue -= (parseInt(data.tributes.csllAmount, 10) || 0);
      targetValue -= (parseInt(data.tributes.othersAmountsWithheld, 10) || 0);
      targetValue -= (parseInt(data.tributes.issAmount, 10) || 0);
      targetValue -= (parseInt(data.tributes.unconditionedDiscountAmount, 10) || 0);
      targetValue -= (parseInt(data.tributes.conditionedDiscountAmount, 10) || 0);
      if (parseInt(value, 10) !== targetValue) {
        throw new Error('ValLiquiNfse está incorreto');
      }
    }), */}
        <UikButton primary type='submit'>
    Save
        </UikButton>
      </UikFormInputGroup>
    </form>
  );
};

export default AddNotaFiscal;
