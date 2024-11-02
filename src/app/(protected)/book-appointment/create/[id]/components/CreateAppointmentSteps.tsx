'use client';
import React, { FC, useState, useEffect } from 'react';
import { ThemeProvider, Stepper, Step } from '@material-tailwind/react';
import Doctor from '@/types/Doctor';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import useStore from '@/store/useStore';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { ToastAction } from '@/components/ui/toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useCreateAppointment } from '@/lib/AppointmentAPI';
import { useRouter } from 'next/navigation';

const CreateAppointmentSteps: FC<{ data: Doctor }> = ({ data }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const {
    activeStep,
    isFirstStep,
    isLastStep,
    message,
    date,
    time,
    reference_no,
    setActiveStep,
    setIsFirstStep,
    setIsLastStep,
  } = useStore((state) => state.schedule_appointments);

  const { mutate } = useCreateAppointment();

  const handleNext = () => {
    if (activeStep == 1 && !time) {
      toast({
        description: 'Please enter date & time',
        action: (
          <ToastAction
            altText='Go to Step 2 to enter date & time'
            onClick={() => setActiveStep(1)}
          >
            Go to Step 2
          </ToastAction>
        ),
      });
      return;
    }

    if (!isLastStep) setActiveStep(activeStep + 1);
  };

  const handlePrev = () => {
    if (activeStep == 1 && (!date || !time)) {
      toast({
        description: 'Please enter date & time',
        action: (
          <ToastAction
            altText='Go to Step 2 to enter date & time'
            onClick={() => setActiveStep(1)}
          >
            Go to Step 2
          </ToastAction>
        ),
      });
      return;
    }

    if (!isFirstStep) setActiveStep(activeStep - 1);
  };

  const handleSetActiveStep = (index: number) => {
    if (index >= 1 && (!date || !time)) {
      toast({
        description: 'Please enter date & time',
        action: (
          <ToastAction
            altText='Go to Step 2 to enter date & time'
            onClick={() => setActiveStep(1)}
          >
            Go to Step 2
          </ToastAction>
        ),
      });
      return;
    }
    setActiveStep(index);
  };

  const handleSubmit = () => {
    if (!reference_no || !reference_no.length) {
      toast({
        description:
          'Please complete the payment first and enter the reference no.',
      });
      return;
    }

    // API REQUEST
    mutate(
      {
        doctor_id: data.doctor.id,
        params: {
          message: message,
          date: date,
          time: time,
          reference_no: reference_no,
        },
      },
      {
        onSuccess: (response) => {
          if (response.success) {
            router.back();
          }
        },
      }
    );
  };

  const renderContent = () => {
    switch (activeStep) {
      case 1:
        return <Step2 data={data} />;
      case 2:
        return <Step3 data={data} />;
      case 3:
        return <Step4 data={data} />;
      default:
        return <Step1 data={data} />;
    }
  };

  useEffect(() => {
    return () => {
      setActiveStep(0);
    };
  }, []);

  return (
    <>
      <ThemeProvider>
        <Stepper
          activeStep={activeStep}
          isLastStep={(value) => setIsLastStep(value)}
          isFirstStep={(value) => setIsFirstStep(value)}
          activeLineClassName='bg-primary'
        >
          {Array(4)
            .fill(null)
            .map((_, index) => (
              <Step
                key={index}
                onClick={() => handleSetActiveStep(index)}
                className='border-2 border-border bg-white hover:cursor-pointer'
                activeClassName='bg-primary border-primary'
                completedClassName='bg-primary border-primary'
              >
                {index + 1}
              </Step>
            ))}
        </Stepper>
        <div className='py-16'>{renderContent()}</div>
        <div className='flex justify-between'>
          <Button onClick={handlePrev} disabled={isFirstStep}>
            Prev
          </Button>
          {isLastStep ? (
            <Button onClick={() => setIsOpen((state) => !state)}>Submit</Button>
          ) : (
            <Button onClick={handleNext} disabled={isLastStep}>
              Next
            </Button>
          )}
        </div>
      </ThemeProvider>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to book this appointment?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Please ensure that everything is accurate before proceeding.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>
              Proceed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CreateAppointmentSteps;
