'use client';
import { useSession } from 'next-auth/react';
import React, { useCallback, useState } from 'react';
import Dropzone from 'react-dropzone';
import log from '@/utils/logger';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
// import { toast } from '@/components/ui/use-toast';
import { Id, toast } from 'react-toastify';
import axios from 'axios';
import Response from '@/types/Response';
import { useQueryClient } from '@tanstack/react-query';

export default function FileUpload() {
  const toastRef = React.useRef<Id | null>(null);
  const queryClient = useQueryClient();
  const [source] = useState(axios.CancelToken.source());

  const cancel = () => {
    source.cancel('Operation canceled by the user.');
    log('[CANCEL]');
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const formData = new FormData();
    for (const item in acceptedFiles) {
      formData.append('files[]', acceptedFiles[item]);
    }
    const { data } = await api.post<Response>(
      '/api/mothers/upload-media-files',
      formData,
      {
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const progress = loaded / total!;
          const percent = Math.floor((loaded * 100) / total!);
          log('[PERCENT]', { percent, ref: toastRef.current });

          if (toastRef.current === null) {
            toastRef.current = toast.info(
              <>
                <span>Uploading Files... {percent}%</span>
                <Button
                  variant='outline'
                  className='border-destructive'
                  onClick={cancel}
                >
                  CANCEL
                </Button>
              </>,
              {
                progress: progress,
              }
            );
          } else {
            toast.update(toastRef.current, {
              progress: progress,
              render: (
                <>
                  <span>Uploading Files... {percent}%</span>
                  <Button
                    variant='outline'
                    className='border-destructive'
                    onClick={cancel}
                  >
                    CANCEL
                  </Button>
                </>
              ),
            });
          }

          if (percent >= 100) {
            toast.done(toastRef.current);
            toast.dismiss();
            toastRef.current = null;
          }
        },
        cancelToken: source.token,
      }
    );

    if (data && data.success) {
      queryClient.invalidateQueries({
        queryKey: ['mother-media-files'],
      });
    }
  };

  return (
    <Dropzone
      onDrop={onDrop}
      accept={{
        'image/png': ['.png'],
        'image/jpeg': ['.jpeg'],
        'application/pdf': ['.pdf'],
      }}
    >
      {({ getRootProps, getInputProps }) => (
        <section className='mx-auto max-w-3xl rounded-lg border-4 border-dashed border-primary p-5 sm:px-40 py-10 text-center'>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <h4 className='text-[2rem] font-bold'>Drag and drop files here</h4>
            <p className='mb-3 text-2xl font-medium'>
              Supported formats: PDF, PNG, JPEG
            </p>
            <Button variant='outline' className='w-full'>
              BROWSE FILE
            </Button>
          </div>
        </section>
      )}
    </Dropzone>
  );
}
