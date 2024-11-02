'use client';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { useGetInformativeVideos } from '@/lib/MothersAPI';
import ReactPlayer from 'react-player';

const List = () => {
  const { data } = useGetInformativeVideos();

  return (
    <div className='flex flex-col space-y-5 sm:flex-row sm:space-x-5 sm:space-y-0'>
      {data?.map((item) => (
        <div className='sm:w-1/3' key={item.id}>
          <Card className='relative h-[330px] overflow-hidden rounded-[33px]'>
            <CardContent className='h-full p-0'>
              <ReactPlayer url={item.link} width={'100%'} height={330} />
            </CardContent>
          </Card>
          <p className='mt-3 text-2xl text-foreground drop-shadow-xl'>
            <Link href={item.link} target='_blank'>
              {item.title}
            </Link>
          </p>
        </div>
      ))}
    </div>
  );
};

export default List;
