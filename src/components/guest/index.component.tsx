import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Navigate  } from "react-router-dom";
import { StoreContext } from "../../store.context";

import Header from "./header.component";
import DataTable from "./table.component"

const GuestView: React.FC = () => {
  const { authStore } = useContext(StoreContext);
  const authenticated = authStore.isAuthenticated();

  if(!authenticated){
    console.log("vào đây");
    return (<Navigate to={"/"}/>)
  } 

  return (
    <>
        <Header />
        <DataTable /> 
    </>
  );
};

const Guest = observer(GuestView);
export { Guest };
