import React from 'react';
import ListView from '../ListView';
import api from '../../utils/api';
import './style.scss';


const AddNotaFiscal = () => (
  <>
    <form onSubmit={() => console.log('oi')}>
      <input />
      <button type="submit">save</button>
    </form>
  </>
);

export default AddNotaFiscal;
