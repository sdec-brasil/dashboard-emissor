import React, { useState, useEffect } from 'react';
import {
  UikFormInputGroup, UikInput, UikButton, UikSelect,
  UikDivider,
} from '../../@uik';
import api from '../../utils/api';
import countryCodes from '../../utils/countryCodes';
import './style.scss';


const AddNotaFiscal = () => {
  const [data, setData] = useState({
    provision: {},
    tributes: {
      calculationBasis: '',
      netValueNfse: '',
    },
    borrower: {},
    intermediary: {},
    construction: {},
  });
  const [errors, setErrors] = useState({
    provision: {},
    tributes: {},
    borrower: {},
    intermediary: {},
    construction: {},
  });
  const [emitters, setEmitters] = useState([]);
  const errorMessages = {
    wrongCalcBasis: 'A base de cálculo está negativa.',
    negativeValue: 'Esse valor não pode ser negativo.',
  };

  const getCountries = () => countryCodes.map(
    country => ({ value: country[0], label: `${country[1]} (${country[0]})` }),
  );

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

  const hasErrors = () => {
    console.log('running hasErrors');
    Object.keys(errors).forEach((key) => {
      if (errors[key] instanceof Object) {
        Object.keys(errors[key]).forEach((k) => {
          if (errors[key][k] !== undefined) {
            console.log('found error in', key, k, errors[key][k]);
            return true;
          }
        });
      } else if (errors[key] !== undefined) {
        console.log('found error in', key, errors[key]);
        return true;
      }
    });
    return false;
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
        <h2>Informações Gerais</h2>
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
          placeholder="85203389000125"
          onChange={e => setData({ ...data, taxNumber: e.target.value })}
  />
        <UikDivider />
        <h2>Provedor</h2>
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
        <UikDivider />
        <h2>Tributos</h2>
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

        <UikDivider />
        <h2>Tomador</h2>

        <UikInput
          label="CPF/CNPJ"
          name='borrower.taxNumber'
          placeholder="85203389000125"
          errorMessage={errors.borrower.taxNumber}
          onChange={(e) => {
            cleanError('taxNumber', 'borrower');
            if (e.target.value.length > 14) {
              writeError('Valor longo demais (até 14 caracteres).', 'taxNumber', 'borrower');
            }
            setData({
              ...data,
              borrower: { ...data.borrower, taxNumber: e.target.value },
            });
          }}
          />
        <UikInput
          label="NIF (Número de Identificação Fiscal)"
          name='borrower.nif'
          errorMessage={errors.borrower.nif}
          onChange={(e) => {
            cleanError('nif', 'borrower');
            if (e.target.value.length > 40) {
              writeError('Valor longo demais (até 40 caracteres).', 'nif', 'borrower');
            }
            setData({
              ...data,
              borrower: { ...data.borrower, nif: e.target.value },
            });
          }}
          />
        <UikInput
          label="Nome do Tomador"
          name='borrower.name'
          errorMessage={errors.borrower.name}
          onChange={(e) => {
            cleanError('name', 'borrower');
            if (e.target.value.length > 150) {
              writeError('Valor longo demais (até 150 caracteres).', 'name', 'borrower');
            }
            setData({
              ...data,
              borrower: { ...data.borrower, name: e.target.value },
            });
          }}
          />
        <UikInput
          label="Rua"
          name='borrower.street'
          errorMessage={errors.borrower.street}
          onChange={(e) => {
            cleanError('street', 'borrower');
            if (e.target.value.length > 145) {
              writeError('Valor longo demais (até 145 caracteres).', 'street', 'borrower');
            }
            setData({
              ...data,
              borrower: { ...data.borrower, street: e.target.value },
            });
          }}
          />
        <UikInput
          label="Número"
          name='borrower.number'
          type='number'
          errorMessage={errors.borrower.number}
          onChange={(e) => {
            cleanError('number', 'borrower');
            if (e.target.value.toString().length > 10) {
              writeError('Valor longo demais (até 10 caracteres).', 'number', 'borrower');
            }
            setData({
              ...data,
              borrower: { ...data.borrower, number: e.target.value },
            });
          }}
          />
        <UikInput
          label="Informações Adicionais"
          name='borrower.additionalInformation'
          errorMessage={errors.borrower.additionalInformation}
          onChange={(e) => {
            cleanError('additionalInformation', 'borrower');
            if (e.target.value.length > 145) {
              writeError('Valor longo demais (até 145 caracteres).', 'additionalInformation', 'borrower');
            }
            setData({
              ...data,
              borrower: { ...data.borrower, additionalInformation: e.target.value },
            });
          }}
          />
        <UikInput
          label="Bairro"
          name='borrower.district'
          errorMessage={errors.borrower.district}
          onChange={(e) => {
            cleanError('district', 'borrower');
            if (e.target.value.length > 60) {
              writeError('Valor longo demais (até 60 caracteres).', 'district', 'borrower');
            }
            setData({
              ...data,
              borrower: { ...data.borrower, district: e.target.value },
            });
          }}
          />
        <UikInput
          label="Cidade"
          name='borrower.city'
          type='number'
          errorMessage={errors.borrower.city}
          onChange={(e) => {
            setData({
              ...data,
              borrower: { ...data.borrower, city: e.target.value },
            });
          }}
          />
        <UikInput
          label="Estado"
          placeholder="RJ"
          name='borrower.state'
          errorMessage={errors.borrower.state}
          onChange={(e) => {
            cleanError('state', 'borrower');
            if (e.target.value.length > 2) {
              writeError('Valor longo demais (até 2 caracteres).', 'state', 'borrower');
            }
            setData({
              ...data,
              borrower: { ...data.borrower, state: e.target.value },
            });
          }}
          />
        <UikSelect label='País'
          placeholder="Selecione um país"
          onChange={value => setData({
            ...data,
            borrower: { ...data.borrower, country: value.value },
          })}
          options={getCountries()}
        />
        <UikInput
          label="CEP"
          name='borrower.postalCode'
          placeholder='42020001'
          errorMessage={errors.borrower.postalCode}
          onChange={(e) => {
            cleanError('postalCode', 'borrower');
            if (e.target.value.length > 8) {
              writeError('Valor longo demais (até 8 caracteres).', 'postalCode', 'borrower');
            }
            setData({
              ...data,
              borrower: { ...data.borrower, postalCode: e.target.value },
            });
          }}
          />
        <UikInput
          label="Email"
          name='borrower.email'
          placeholder='valid@email.com'
          errorMessage={errors.borrower.email}
          onChange={(e) => {
            cleanError('email', 'borrower');
            if (e.target.value.length > 60) {
              writeError('Valor longo demais (até 60 caracteres).', 'email', 'borrower');
            }
            setData({
              ...data,
              borrower: { ...data.borrower, email: e.target.value },
            });
          }}
          />
        <UikInput
          label="Telefone"
          name='borrower.phoneNumber'
          placeholder='2122357721'
          errorMessage={errors.borrower.phoneNumber}
          onChange={(e) => {
            cleanError('phoneNumber', 'borrower');
            if (e.target.value.length > 20) {
              writeError('Valor longo demais (até 20 caracteres).', 'phoneNumber', 'borrower');
            }
            setData({
              ...data,
              borrower: { ...data.borrower, email: e.target.value },
            });
          }}
          />
        <UikInput
          label="Telefone"
          name='borrower.phoneNumber'
          placeholder='2122357721'
          errorMessage={errors.borrower.phoneNumber}
          onChange={(e) => {
            cleanError('phoneNumber', 'borrower');
            if (e.target.value.length > 20) {
              writeError('Valor longo demais (até 20 caracteres).', 'phoneNumber', 'borrower');
            }
            setData({
              ...data,
              borrower: { ...data.borrower, email: e.target.value },
            });
          }}
          />

        <UikDivider />
        <h2>Intermediário</h2>

        <UikInput
          label="CPF/CNPJ"
          name='intermediary.taxNumber'
          placeholder='85203389000125'
          errorMessage={errors.intermediary.taxNumber}
          onChange={(e) => {
            cleanError('taxNumber', 'intermediary');
            if (e.target.value.length > 14) {
              writeError('Valor longo demais (até 14 caracteres).', 'taxNumber', 'intermediary');
            }
            setData({
              ...data,
              intermediary: { ...data.intermediary, taxNumber: e.target.value },
            });
          }}
          />
        <UikInput
          label="Nome do Intermediário"
          name='intermediary.name'
          errorMessage={errors.intermediary.name}
          onChange={(e) => {
            cleanError('name', 'intermediary');
            if (e.target.value.length > 150) {
              writeError('Valor longo demais (até 150 caracteres).', 'name', 'intermediary');
            }
            setData({
              ...data,
              intermediary: { ...data.intermediary, name: e.target.value },
            });
          }}
          />
        <UikInput
          label="Cidade"
          name='intermediary.city'
          type='number'
          errorMessage={errors.intermediary.city}
          onChange={(e) => {
            setData({
              ...data,
              intermediary: { ...data.intermediary, city: e.target.value },
            });
          }}
          />


        <UikDivider />
        <h2>Construção Civil</h2>

        <UikInput
          label="Código da Obra"
          name='construction.workCode'
          errorMessage={errors.construction.workCode}
          onChange={(e) => {
            cleanError('workCode', 'construction');
            if (e.target.value.length > 30) {
              writeError('Valor longo demais (até 30 caracteres).', 'workCode', 'construction');
            }
            setData({
              ...data,
              construction: { ...data.construction, name: e.target.value },
            });
          }}
          />
        <UikInput
          label="ART (Anotação de Responsabilidade Técnica)"
          name='construction.art'
          errorMessage={errors.construction.art}
          onChange={(e) => {
            cleanError('art', 'construction');
            if (e.target.value.length > 30) {
              writeError('Valor longo demais (até 30 caracteres).', 'art', 'construction');
            }
            setData({
              ...data,
              construction: { ...data.construction, art: e.target.value },
            });
          }}
          />
        <UikButton primary type='submit' disabled={!hasErrors()}>
    Save
        </UikButton>
      </UikFormInputGroup>
    </form>
  );
};

export default AddNotaFiscal;
