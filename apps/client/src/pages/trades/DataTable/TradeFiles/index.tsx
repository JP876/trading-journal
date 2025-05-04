import { TradeType } from '../../types';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

type TradeFilesProps = { trade?: TradeType };

const TradeFiles = (props: TradeFilesProps) => {
  if (!props?.trade) return null;

  return (
    <Carousel className="py-6 mx-14">
      <CarouselContent>
        {(props?.trade.files || [])?.map((el) => (
          <CarouselItem key={el?.id} className="flex justify-center">
            <img className=" h-96 object-contain" src={el?.url} alt={el?.id} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default TradeFiles;
