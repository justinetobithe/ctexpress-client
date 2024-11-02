import React from 'react';
import InformativeVideosTable from './components/InformativeVideosTable';
import InformativeVideoForm from './components/InformativeVideoForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const page = () => {
  return (
    <>
      <h1 className='text-[2rem] font-bold'>Informative Videos</h1>
      <InformativeVideoForm
        buttonTrigger={
          <div className='text-right'>
            <Button>
              <Plus />
              Add New Informative Video
            </Button>
          </div>
        }
      />
      <InformativeVideosTable />
    </>
  );
};

export default page;
