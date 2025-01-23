import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { routes } from "./routers";
import DefaultComponet from "./components/DefaultComponent/DefaultComponet";
import { isJsonString } from "./utils";
import { jwtDecode } from "jwt-decode";
import * as UserServices from "./services/UserServices";
import { useDispatch } from "react-redux";
import { updateUser } from "./redux/slides/userSlide";
import axios from "axios";

function App() {
  const dispatch = useDispatch("");

  useEffect(() => {
    const { storageData, decoded } = handleDecoded();
    if (decoded?.id) {
      handleGetDetailsUser(decoded?.id, storageData);
    }
  }, []);

  const handleDecoded = () => {
    let storageData = localStorage.getItem("access_token");
    let decoded = {};
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData);
      decoded = jwtDecode(storageData);
    }
    return { decoded, storageData };
  };

  UserServices.axiosJWT.interceptors.request.use(
    async (config) => {
      const currentTime = new Date();
      const { decoded } = handleDecoded();
      if (decoded?.exp < currentTime.getTime() / 1000) {
        const data = await UserServices.refreshToken();
        config.headers["token"] = `Bearer ${data?.access_token}`;
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  const handleGetDetailsUser = async (id, token) => {
    const res = await UserServices.getDetailsUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  };

  return (
    <div>
      <Router>
        <Routes>
          {routes.map((route) => {
            const Path = route.path;
            const Page = route.page;
            const Layout = route.isShowHeader ? DefaultComponet : Fragment;
            return (
              <Route
                path={Path}
                key={Path}
                element={
                  <>
                    <Layout>
                      <Page />
                    </Layout>
                  </>
                }
              />
            );
          })}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
