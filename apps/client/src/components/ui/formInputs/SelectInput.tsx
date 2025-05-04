import { RefCallBack } from 'react-hook-form';

import { FormItem, FormLabel } from '../form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../select';
import { ISelectItem } from './types';

interface ISelectInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  items: ISelectItem[];
  ref: RefCallBack;
}

const SelectInput = (props: ISelectInputProps) => {
  return (
    <FormItem className="w-full">
      <FormLabel>{props.label}</FormLabel>
      <Select onValueChange={props.onChange} value={props.value}>
        <SelectTrigger ref={props.ref}>
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {props.items.map(({ value, label }) => (
            <SelectItem key={label} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormItem>
  );
};

export default SelectInput;
