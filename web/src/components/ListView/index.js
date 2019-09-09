import React, { useEffect, useState } from 'react';
import {
  UikWidget, UikWidgetHeader, UikWidgetContent, UikButton,
  UikWidgetTable,
} from '../../@uik';
import api from '../../utils/api';
import './style.scss';


const ListView = (props) => {
  const [tableData, setTableData] = useState([]);
  const {
    headers, endpoint, title, keyField,
    buttonText, onClickAdd, storeSetter,
    storeGetter,
  } = props;

  async function loadFromServer() {
    const c = await api.get(endpoint);
    console.log(`Just got ${title}`, c.data.data);
    setTableData(c.data.data);
  }

  const onClick = async () => {
    await onClickAdd();
    loadFromServer();
  };

  useEffect(() => {
    loadFromServer();
  }, []);

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

  const h = () => headers.map(header => <th
    key={getColumnField(header)}>{getColumnTitle(header)}</th>);

  const rows = () => tableData.map(row => (
    <tr key={row[keyField]}>
      {headers.map(header => <td
        key={`${getColumnField(header)}-${row[keyField]}`}>{row[getColumnField(header)]}</td>)}
    </tr>
  ));


  return (
    <>
      <UikWidget className='widget-wrapper'>
        <UikWidgetHeader
          rightEl={(
            <UikButton primary onClick={onClick}>
              {buttonText}
            </UikButton>
    )}
  >
          {title}
        </UikWidgetHeader>
        <UikWidgetContent>
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
        </UikWidgetContent>
      </UikWidget>
    </>
  );
};

export default ListView;
