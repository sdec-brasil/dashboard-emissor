import React, { useState, useEffect } from 'react';
import {
  UikFormInputGroup, UikInput, UikButton, UikSelect,
} from '../../@uik';
import api from '../../utils/api';
import './style.scss';


const AddNotaFiscal = () => {
  const [data, setData] = useState({
    provision: {},
    tributes: {
      calculationBasis: '',
      netValueNfse: '',
    },
  });
  const [errors, setErrors] = useState({ provision: {}, tributes: {} });
  const [emitters, setEmitters] = useState([]);
  const errorMessages = {
    wrongCalcBasis: 'A base de cálculo está negativa.',
    negativeValue: 'Esse valor não pode ser negativo.',
  };
  const submit = (e) => {
    e.preventDefault();
    api.post('/v1/invoices', data);
    // console.log(data);
  };

  const cleanError = (field, group = undefined) => {
    console.log('cleaning  errors', errors);
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

  useEffect(() => {
    // getting emitter field options for select
    async function getEmitterOptions() {
      const response = await api.get('/v1/user/registered-addresses');
      const addr = response.data;
      setEmitters(addr.map(a => ({ value: a.address, label: `${a.company.name} - ${a.address}` })));
    }
    getEmitterOptions();
  }, []);

  useEffect(() => {
    // automatically calculate calculationBasis field
    const handleCalculationBasis = (provision = {}, tributes = {}) => {
      const services = parseInt(provision.servicesAmount, 10) || 0;
      const uncond = parseInt(tributes.unconditionedDiscountAmount, 10) || 0;
      const cond = parseInt(tributes.conditionedDiscountAmount, 10) || 0;
      return (services - uncond - cond);
    };

    const value = handleCalculationBasis({ ...data.provision }, { ...data.tributes });
    const calculationBasis = parseInt(data.tributes.calculationBasis, 10) || 0;
    if (data.tributes && calculationBasis !== value) {
      setData({
        ...data,
        tributes: { ...data.tributes, calculationBasis: value.toString() },
      });
    }
  }, [
    data,
    setData,
  ]);

  useEffect(() => {
    // automatically calculate netValueNfse field
    const calcNetValueNfse = (provision = {}, tributes = {}) => {
      let targetValue = parseInt(provision.servicesAmount, 10) || 0;
      targetValue -= parseInt(tributes.pisAmount, 10) || 0;
      targetValue -= parseInt(tributes.cofinsAmount, 10) || 0;
      targetValue -= parseInt(tributes.inssAmount, 10) || 0;
      targetValue -= parseInt(tributes.irAmount, 10) || 0;
      targetValue -= parseInt(tributes.csllAmount, 10) || 0;
      targetValue -= parseInt(tributes.othersAmountsWithheld, 10) || 0;
      targetValue -= parseInt(tributes.issAmount, 10) || 0;
      targetValue -= parseInt(tributes.unconditionedDiscountAmount, 10) || 0;
      targetValue -= parseInt(tributes.conditionedDiscountAmount, 10) || 0;
      return targetValue;
    };

    const target = calcNetValueNfse({ ...data.provision }, { ...data.tributes });
    const current = parseInt(data.tributes.netValueNfse, 10) || 0;
    if (current !== target) {
      setData({
        ...data,
        tributes: { ...data.tributes, netValueNfse: target.toString() },
      });
    }
  }, [
    data,
    setData,
  ]);

  useEffect(() => {
    // general validations
    // validating calculation Basis
    if (data.tributes.calculationBasis < 0) {
      if (!errors.tributes.calculationBasis) {
        writeError(errorMessages.wrongCalcBasis, 'calculationBasis', 'tributes');
      }
      if (!errors.provision.servicesAmount) {
        writeError(errorMessages.wrongCalcBasis, 'servicesAmount', 'provision');
      }
      if (!errors.tributes.conditionedDiscountAmount) {
        writeError(errorMessages.wrongCalcBasis, 'conditionedDiscountAmount', 'tributes');
      }
      if (!errors.tributes.unconditionedDiscountAmount) {
        writeError(errorMessages.wrongCalcBasis, 'unconditionedDiscountAmount', 'tributes');
      }
    } else {
      if (errors.tributes.calculationBasis === errorMessages.wrongCalcBasis) {
        cleanError('calculationBasis', 'tributes');
      }
      if (errors.provision.servicesAmount === errorMessages.wrongCalcBasis) {
        cleanError('servicesAmount', 'provision');
      }
      if (errors.tributes.conditionedDiscountAmount === errorMessages.wrongCalcBasis) {
        cleanError('conditionedDiscountAmount', 'tributes');
      }
      if (errors.tributes.unconditionedDiscountAmount === errorMessages.wrongCalcBasis) {
        cleanError('unconditionedDiscountAmount', 'tributes');
      }
    }
  }, [
    data,
    writeError,
    errors,
    cleanError,
    errorMessages,
  ]);

  return (
    <form onSubmit={e => submit(e)} onChange={(e) => { console.log(data); }}>
      {/* {Object.keys(data).map(key => (<div key={key}>{key}: {data[key]}</div>))} */}
      <UikFormInputGroup>
        <UikSelect label='emissor'
          placeholder="Emissor"
          onChange={value => setData({ ...data, emitter: value.value })}
          options={emitters}
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
            }
            setData({
              ...data,
              provision: { ...data.provision, servicesAmount: e.target.value },
            });
          }}
          />
        <UikSelect label='Incentivo Fiscal'
          placeholder="Incentivo Fiscal"
          onChange={e => setData({
            ...data,
            tributes: { ...data.tributes, taxBenefit: e.value },
          })}
          options={
            [
              { value: true, label: 'Sim' },
              { value: false, label: 'Não' },
            ]}
          />
        <UikSelect label='Exigibilidade de ISS'
          placeholder="Exibigilidade"
          onChange={e => setData({
            ...data,
            tributes: { ...data.tributes, issExigibility: e.value },
          })}
          options={
            [
              { value: 1, label: 'Exigível' },
              { value: 2, label: 'Não Incidência' },
              { value: 3, label: 'Isenção' },
              { value: 4, label: 'Exportação' },
              { value: 5, label: 'Imunidade' },
              { value: 6, label: 'Exigiblidade Suspensa por Decisão Judicial' },
              { value: 7, label: 'Exigibilidade Suspensa por Processo Adminsitrativo' },
            ]}
          />
        <UikInput
          label="Número do Processo"
          name='tributes.processNumber'
          errorMessage={errors.tributes.processNumber}
          onChange={(e) => {
            cleanError('processNumber', 'tributes');
            if (e.target.value.length > 30) {
              writeError('O número do processo é longo demais (max 30)', 'processNumber', 'tributes');
            }
            setData({
              ...data,
              provision: { ...data.tributes, processNumber: e.target.value },
            });
          }}
          />
        <UikInput
          type='number'
          label="Taxa de ISS"
          name='tributes.issRate'
          errorMessage={errors.tributes.issRate}
          onChange={(e) => {
            cleanError('issRate', 'tributes');
            if (e.target.value < 0) {
              writeError('A taxa deve ser um número positivo.', 'issRate', 'tributes');
            }
            setData({
              ...data,
              provision: { ...data.tributes, issRate: e.target.value },
            });
          }}
          />
        <UikInput
          type='number'
          label="Valor do ISS"
          name='tributes.issAmount'
          errorMessage={errors.tributes.issAmount}
          onChange={(e) => {
            cleanError('issAmount', 'tributes');
            if (e.target.value < 0) {
              writeError('O valor deve ser um número positivo.', 'issAmount', 'tributes');
            }
            setData({
              ...data,
              provision: { ...data.tributes, issAmount: e.target.value },
            });
          }}
          />
        <UikSelect label='ISS Retido'
          placeholder="ISS Retido"
          onChange={e => setData({
            ...data,
            tributes: { ...data.tributes, issWithheld: e.value },
          })}
          options={
            [
              { value: true, label: 'Sim' },
              { value: false, label: 'Não' },
            ]}
          />
        <UikSelect label='Responsável pela Retenção'
          placeholder="Responsável"
          onChange={e => setData({
            ...data,
            tributes: { ...data.tributes, retentionResponsible: e.value },
          })}
          options={
            [
              { value: 1, label: 'Tomador' },
              { value: 2, label: 'Intermediário' },
            ]}
          />
        <UikSelect label='Regime Especial de Tributação'
          placeholder="Regime Especial"
          onChange={e => setData({
            ...data,
            tributes: { ...data.tributes, specialTaxRegime: e.value },
          })}
          options={
            [
              { value: 0, label: 'Tributação Normal' },
              { value: 1, label: 'Microempresa Municipal' },
              { value: 2, label: 'Estimativa' },
              { value: 3, label: 'Sociedade de Profissionais' },
              { value: 4, label: 'Cooperativa' },
              { value: 5, label: 'Microempresário Individual (MEI)' },
              { value: 6, label: 'Microempresário e Empresa de Pequeno Porte (MP EPP)' },
              { value: 7, label: 'Movimento Mensal/ISS/Fixo Autônomo' },
              { value: 8, label: 'Sociedade Limitada/Média Empresa' },
              { value: 9, label: 'Sociedade Anônima/Grande Empresa' },
              { value: 10, label: 'Empresa Individual de Responsabilidade Limita (EIRELI)' },
              { value: 11, label: 'Empresa Individual' },
              { value: 12, label: 'Empresa de Pequeno Porte (EPP)' },
              { value: 13, label: 'Microempresário' },
              { value: 14, label: 'Outros/Sem Vínculos' },
              { value: 15, label: 'Nenhum' },
              { value: 16, label: 'Nota Avulsa' },
            ]}
          />
        <UikInput
          type='number'
          label="Valor do PIS"
          name='tributes.pisAmount'
          errorMessage={errors.tributes.pisAmount}
          onChange={(e) => {
            cleanError('pisAmount', 'tributes');
            if (e.target.value < 0) {
              writeError('O valor deve ser um número positivo.', 'pisAmount', 'tributes');
            }
            setData({
              ...data,
              tributes: { ...data.tributes, pisAmount: e.target.value },
            });
          }}
          />
        <UikInput
          type='number'
          label="Valor do COFINS"
          name='tributes.cofinsAmount'
          errorMessage={errors.tributes.cofinsAmount}
          onChange={(e) => {
            cleanError('cofinsAmount', 'tributes');
            if (e.target.value < 0) {
              writeError('O valor deve ser um número positivo.', 'cofinsAmount', 'tributes');
            }
            setData({
              ...data,
              tributes: { ...data.tributes, cofinsAmount: e.target.value },
            });
          }}
          />
        <UikInput
          type='number'
          label="Valor do INSS"
          name='tributes.inssAmount'
          errorMessage={errors.tributes.inssAmount}
          onChange={(e) => {
            cleanError('inssAmount', 'tributes');
            if (e.target.value < 0) {
              writeError('O valor deve ser um número positivo.', 'inssAmount', 'tributes');
            }
            setData({
              ...data,
              tributes: { ...data.tributes, inssAmount: e.target.value },
            });
          }}
          />
        <UikInput
          type='number'
          label="Valor do IR"
          name='tributes.irAmount'
          errorMessage={errors.tributes.irAmount}
          onChange={(e) => {
            cleanError('irAmount', 'tributes');
            if (e.target.value < 0) {
              writeError('O valor deve ser um número positivo.', 'irAmount', 'tributes');
            }
            setData({
              ...data,
              tributes: { ...data.tributes, irAmount: e.target.value },
            });
          }}
          />
        <UikInput
          type='number'
          label="Valor do CSLL"
          name='tributes.csllAmount'
          errorMessage={errors.tributes.csllAmount}
          onChange={(e) => {
            cleanError('csllAmount', 'tributes');
            if (e.target.value < 0) {
              writeError('O valor deve ser um número positivo.', 'csllAmount', 'tributes');
            }
            setData({
              ...data,
              tributes: { ...data.tributes, csllAmount: e.target.value },
            });
          }}
          />
        <UikInput
          type='number'
          label="Valor de Desconto Incondicionado"
          name='tributes.unconditionedDiscountAmount'
          errorMessage={errors.tributes.unconditionedDiscountAmount}
          onChange={(e) => {
            cleanError('unconditionedDiscountAmount', 'tributes');
            if (e.target.value < 0) {
              writeError('O valor deve ser um número positivo.', 'unconditionedDiscountAmount', 'tributes');
            }
            setData({
              ...data,
              tributes: { ...data.tributes, unconditionedDiscountAmount: e.target.value },
            });
          }}
          />
        <UikInput
          type='number'
          label="Valor de Desconto Condicionado"
          name='tributes.conditionedDiscountAmount'
          errorMessage={errors.tributes.conditionedDiscountAmount}
          onChange={(e) => {
            cleanError('conditionedDiscountAmount', 'tributes');
            if (e.target.value < 0) {
              writeError('O valor deve ser um número positivo.', 'conditionedDiscountAmount', 'tributes');
            }
            setData({
              ...data,
              tributes: { ...data.tributes, conditionedDiscountAmount: e.target.value },
            });
          }}
          />
        <UikInput
          type='number'
          label="Valor de outras Retenções"
          name='tributes.othersAmountsWithheld'
          errorMessage={errors.tributes.othersAmountsWithheld}
          onChange={(e) => {
            cleanError('othersAmountsWithheld', 'tributes');
            if (e.target.value < 0) {
              writeError('O valor deve ser um número positivo.', 'othersAmountsWithheld', 'tributes');
            }
            setData({
              ...data,
              tributes: { ...data.tributes, othersAmountsWithheld: e.target.value },
            });
          }}
          />
        <UikInput
          type='number'
          label="Valor das Deduções"
          name='tributes.deductionsAmount'
          errorMessage={errors.tributes.deductionsAmount}
          onChange={(e) => {
            cleanError('deductionsAmount', 'tributes');
            if (e.target.value < 0) {
              writeError('O valor deve ser um número positivo.', 'deductionsAmount', 'tributes');
            }
            setData({
              ...data,
              tributes: { ...data.tributes, deductionsAmount: e.target.value },
            });
          }}
          />
        <UikInput
          label="Base de Cálculo"
          name='tributes.calculationBasis'
          value={data.tributes.calculationBasis}
          errorMessage={errors.tributes.calculationBasis}
          disabled
          />
        <UikInput
          type='number'
          label="Imposto Aproximado"
          name='tributes.approximateTax'
          errorMessage={errors.tributes.approximateTax}
          onChange={(e) => {
            cleanError('approximateTax', 'tributes');
            if (e.target.value < 0) {
              writeError('O valor deve ser um número positivo.', 'approximateTax', 'tributes');
            }
            setData({
              ...data,
              tributes: { ...data.tributes, approximateTax: e.target.value },
            });
          }}
          />
        <UikInput
          label="Valor Líquido NFSE"
          name='tributes.netValueNfse'
          value={data.tributes.netValueNfse}
          errorMessage={errors.tributes.netValueNfse}
          disabled
          />

        <UikButton primary type='submit'>
    Save
        </UikButton>
      </UikFormInputGroup>
    </form>
  );
};

export default AddNotaFiscal;
