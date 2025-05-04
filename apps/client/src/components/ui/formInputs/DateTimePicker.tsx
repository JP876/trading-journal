import * as React from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import * as PopoverPrimitive from '@radix-ui/react-popover';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { FormItem, FormLabel } from '../form';

interface IDateTimePickerProps {
  label: string;
  value: Date | undefined;
  onChange: (value: Date) => void;
  onBlur?: () => void;
  popoverRootProps?: React.ComponentProps<typeof PopoverPrimitive.Root>;
  placeholder?: string;
}

const hours = Array.from({ length: 24 }, (_, i) => i);

export const DateTimePicker = (props: IDateTimePickerProps) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      props.onChange(selectedDate);
    }
  };

  const handleTimeChange = (type: 'hour' | 'minute', value: string) => {
    if (props.value) {
      const newDate = new Date(props.value);
      if (type === 'hour') {
        newDate.setHours(parseInt(value));
      } else if (type === 'minute') {
        newDate.setMinutes(parseInt(value));
      }
      props.onChange(newDate);
    }
  };

  return (
    <FormItem className="w-full">
      <FormLabel>{props.label}</FormLabel>

      <Popover open={isOpen} onOpenChange={setIsOpen} {...(props?.popoverRootProps || {})}>
        <PopoverTrigger onBlur={props?.onBlur} asChild>
          <Button
            variant="outline"
            className={cn(
              'text-left font-normal',
              !props.value && 'text-muted-foreground',
              props?.placeholder || props?.value ? 'justify-between' : 'justify-end'
            )}
          >
            {props.value ? format(props.value, 'MM/dd/yyyy HH:mm') : <span>{props.placeholder}</span>}
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0">
          <div className="sm:flex">
            <Calendar mode="single" selected={props.value} onSelect={handleDateSelect} initialFocus />

            <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
              <ScrollArea className="w-64 sm:w-auto">
                <div className="flex sm:flex-col p-2">
                  {hours.map((hour) => (
                    <Button
                      key={hour}
                      size="icon"
                      variant={props.value && props.value.getHours() === hour ? 'default' : 'ghost'}
                      className="sm:w-full shrink-0 aspect-square"
                      onClick={() => handleTimeChange('hour', hour.toString())}
                    >
                      {hour}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" className="sm:hidden" />
              </ScrollArea>

              <ScrollArea className="w-64 sm:w-auto">
                <div className="flex sm:flex-col p-2">
                  {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                    <Button
                      key={minute}
                      size="icon"
                      variant={props.value && props.value.getMinutes() === minute ? 'default' : 'ghost'}
                      className="sm:w-full shrink-0 aspect-square"
                      onClick={() => handleTimeChange('minute', minute.toString())}
                    >
                      {minute.toString().padStart(2, '0')}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" className="sm:hidden" />
              </ScrollArea>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </FormItem>
  );
};
