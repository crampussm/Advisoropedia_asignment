import React, { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export const GetContext = () => {
  const adviooContext = useContext(AppContext);
  return adviooContext;
};

export const AppProvider = (props) => {
    const [getStartedEmail, setGetStartedEmail] = useState();
  return (
    <AppContext.Provider value={{getStartedEmail, setGetStartedEmail}}>
      {props.children}
    </AppContext.Provider>
  );
};
