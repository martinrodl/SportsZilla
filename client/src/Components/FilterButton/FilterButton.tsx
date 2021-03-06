import React, { useState } from 'react';
import styles from './FilterButton.module.scss';
import { Item, Menu, Dropdown, Trigger, Field, Autocomplete } from '@zendeskgarden/react-dropdowns';
import Data from '../../mockData/data.json';
import Sport from '../Sport/Sport';

interface PropTypes {
  filterBySport: any;
}

const FilterButton: React.FC<PropTypes> = ({ filterBySport }) => {
  const filterIcon = require('../../Images/FormIcons/filter.svg');

  type SportObj = {
    id: number;
    name: string;
  };
  const [sport, setSport] = useState<SportObj[]>(Data.sports);
  const [selectedItem, setSelectedItem] = useState<string>('Sport');

  const list = sport.map((sp) => {
    return (
      <Item key={`${sp.id}`} value={sp.name}>
        <Sport sport={sp} />
      </Item>
    );
  });

  return (
    <div className={styles.FilterButton}>
      <img src={filterIcon} alt="filterIcon" />
      <Dropdown
        selectedItem={selectedItem}
        onSelect={(e) => {
          filterBySport(e);
          setSelectedItem(e);
        }}
      >
        <Field className={styles.Field}>
          <Autocomplete>{selectedItem}</Autocomplete>
        </Field>
        <Menu placement="end">{list}</Menu>
      </Dropdown>
    </div>
  );
};

export default FilterButton;
