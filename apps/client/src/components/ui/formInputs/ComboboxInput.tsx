import { RefCallBack } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Button } from '../button';
import { FormItem, FormLabel } from '../form';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../command';
import { ISelectItem } from './types';

interface IComboboxInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  items: ISelectItem[];
  ref: RefCallBack;
  placeholder?: string;
}

const ComboboxInput = (props: IComboboxInputProps) => {
  return (
    <FormItem className="flex flex-col w-full">
      <FormLabel>{props.label}</FormLabel>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              'w-full',
              !props.value && 'text-muted-foreground',
              props?.placeholder || props.value ? 'justify-between' : 'justify-end'
            )}
          >
            {props.value ? props.items.find((item) => item.value === props.value)?.label : props?.placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={props?.placeholder} />

            <CommandList>
              <CommandEmpty>Not found.</CommandEmpty>

              <CommandGroup>
                {props.items.map((item) => (
                  <CommandItem
                    value={item.label}
                    key={item.value}
                    onSelect={() => props.onChange(item.value)}
                    className=" cursor-pointer"
                  >
                    {item.label}
                    <Check className={cn('ml-auto', item.value === props.value ? 'opacity-100' : 'opacity-0')} />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </FormItem>
  );
};

export default ComboboxInput;
