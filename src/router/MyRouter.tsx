import React, { useContext } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import TranscationPage from "../pages/TranscationPage";
import HomePage from "../pages/HomePage";
import IndexPage from "../pages/IndexPage";
import AppBarComponent from "../components/AppBarComponent";
import { NetTypeProps } from "../utils/netType";
import AuthPage from "../pages/AuthPage";
import UploadPage from "../pages/UploadPage";
import NotFound from "../pages/NotFound";
import ImageListPage from "../pages/ImageListPage";
import DrawerAppBar from "../components/DrawerAppBar";
type ProviderType = {
  netType: NetTypeProps;
  setNetType: React.Dispatch<React.SetStateAction<NetTypeProps>>;
};

// type NetTypeProps = "mainnet" | "devnet";
export const MyProvider = React.createContext<ProviderType>({} as ProviderType);

export function useProvider() {

  return React.useContext(MyProvider);
}

function MyRouter() {
  const [netType, setNetType] = React.useState<NetTypeProps>("mainnet");
  

  // const first = React.useContext(MyProvider)

  const myValue = React.useMemo<ProviderType>(() => {
    const value = {
      netType: netType,
      setNetType: setNetType,
    };
    return value;
  }, [netType]);
  return (
    <MyProvider.Provider value={myValue}>
      <Router>
        {/* <DrawerAppBar /> */}
        <AppBarComponent />
        <Routes>
          <Route path="/">
            <Route index element={<IndexPage />} />
          </Route>
          <Route path="/home">
            <Route index element={<HomePage />} />
          </Route>
          <Route path="/transcation">
            <Route index element={<TranscationPage />} />
          </Route>
          <Route path="/auth">
            <Route index element={<AuthPage />} />
          </Route>
          <Route path="/upload">
            <Route index element={<UploadPage />} />
          </Route>
          <Route path="/image-list">
            <Route index element={<ImageListPage />} />
          </Route>
          <Route path="*">
            <Route index element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </MyProvider.Provider>
  );
}

export default MyRouter;
