import React from 'react';
import MediaFilesTable from './components/MediaFilesTable';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const page = () => {
  return (
    <>
      <ToastContainer />
      <MediaFilesTable />
    </>
  );
};

export default page;
