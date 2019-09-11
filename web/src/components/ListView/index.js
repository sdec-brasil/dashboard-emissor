import React, { useEffect, useState } from 'react';
import {
  UikWidget, UikWidgetHeader, UikWidgetContent, UikButton,
  UikWidgetTable,
} from '../../@uik';
import api from '../../utils/api';
import * as cleaners from '../../utils/cleaners';
import './style.scss';


const ListView = (props) => {
  const [tableData, setTableData] = useState([]);
  const {
    headers, endpoint, title, keyField,
    buttonText, onClickAdd,
  } = props;

  const getColumnTitle = (header) => {
    if (Array.isArray(header)) {
      if (header.length > 1) return header[1];
      return header[0];
    }
    return header;
  };

  const getColumnField = (header) => {
    if (Array.isArray(header)) {
      return header[0];
    }
    return header;
  };

  const getCleanerFunction = (header) => {
    if (Array.isArray(header) && header.length > 2) {
      if (header[2] instanceof Function) {
        return header[2];
      }
      if (header[2] === 'date') {
        return cleaners.date;
      }
    }
    return (value => value);
  };

  const cleanData = (data) => {
    data.forEach((row) => {
      headers.forEach((header) => {
        const f = getCleanerFunction(header);
        row[getColumnField(header)] = f(row[getColumnField(header)]);
      });
    });
  };

  async function loadFromServer() {
    const c = await api.get(endpoint);
    console.log(`Just got ${title}`, c.data.data);
    cleanData(c.data.data);
    console.log(`Just cleaned ${title}`, c.data.data);
    setTableData(c.data.data);
  }

  const onClick = async () => {
    await onClickAdd();
    loadFromServer();
  };

  useEffect(() => {
    loadFromServer();
  }, []);

  const h = () => headers.map(header => <th
    key={getColumnField(header)}>{getColumnTitle(header)}</th>);

  const rows = () => tableData.map(row => (
    <tr key={row[keyField]}>
      {headers.map(header => <td
        key={`${getColumnField(header)}-${row[keyField]}`}>{row[getColumnField(header)]}</td>)}
    </tr>
  ));

  const empty = () => (
    <div className='empty-message'>
      {`Ainda não há ${title.toLowerCase()} cadastrados(as)`}
    </div>);

  const table = () => (
    <UikWidgetTable>
      <thead>
        <tr>
          {h()}
        </tr>
      </thead>
      <tbody>
        {rows()}
      </tbody>
    </UikWidgetTable>
  );

  return (
    <>
      <UikWidget className='widget-wrapper'>
        <UikWidgetHeader
          rightEl={buttonText && (
            <UikButton primary onClick={onClick}>
              {buttonText}
            </UikButton>
          )}
  >
          {title}
        </UikWidgetHeader>
        <UikWidgetContent className='content-wrapper'>
          {tableData.length ? table() : empty()}
        </UikWidgetContent>
      </UikWidget>
    </>
  );
};

export default ListView;
