
/*require('../../../../../aoao-style-themes/lib/style.css');*/

require('aoao-style-themes/lib/style.css');
import React, { Component, PropTypes } from 'react';
import MainLayout from './mainLayout'
function App({children}) {
  return (
    <MainLayout>
      {children}
    </MainLayout>
  );
};

export default App;
