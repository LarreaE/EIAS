import React from 'react';
import QRGenerator from './QrGenerator.tsx';

type Props = {UserData:any};

const AcolythLaboratoryScreen: React.FC<Props> = (UserData:any) => {
  return (
<QRGenerator {...UserData}/>
  );
};

export default AcolythLaboratoryScreen;
