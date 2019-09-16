import React from 'react';
import { UikFormInputGroup, UikInput, UikButton } from '../../@uik';
import api from '../../utils/api';
import './style.scss';


const AddNotaFiscal = () => {
  const submit = (e) => {
    e.preventDefault();
    console.log('oi');
  };


  return (
    <form onSubmit={e => submit(e)}>
      <UikFormInputGroup>
        <UikInput
          label="Your Name"
          placeholder="John Smith"
  />
        <UikInput
          label="Your Email"
          placeholder="john@smith.com"
  />
        <UikButton primary type='submit'>
    Save
        </UikButton>
      </UikFormInputGroup>
    </form>
  );
};

export default AddNotaFiscal;
