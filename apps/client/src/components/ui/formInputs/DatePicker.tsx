import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FormControl } from '../form';

interface IDatePickerProps {
  value: Date;
  onChange: (value: Date | undefined) => void;
}

export function DatePicker(props: IDatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={'outline'}
            className={cn('w-[280px] justify-start text-left font-normal', !props.value && 'text-muted-foreground')}
          >
            <CalendarIcon />
            {props.value ? format(props.value, 'PPP') : <span>Pick a date</span>}
          </Button>
        </FormControl>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={props.value} onSelect={props.onChange} initialFocus />
      </PopoverContent>
    </Popover>
  );
}
