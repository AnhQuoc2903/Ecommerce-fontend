import React, { Fragment, useCallback, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { routes } from "./routers";
import DefaultComponet from "./components/DefaultComponent/DefaultComponet";
import { isJsonString } from "./utils";
import { jwtDecode } from "jwt-decode";
import * as UserServices from "./services/UserServices";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "./redux/slides/userSlide";
import Loading from "./components/LoadingComponent/Loading";

function App() {
  const dispatch = useDispatch("");
  const [isPending, setIsPending] = useState(false);
  const user = useSelector((state) => state.user);

  const handleGetDetailsUser = useCallback(
    async (id, token) => {
      try {
        const res = await UserServices.getDetailsUser(id, token);
        if (res?.data) {
          dispatch(updateUser({ ...res.data, access_token: token }));
        } else {
          console.error("User data not found!");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        if (error.response?.status === 401) {
          console.warn("Unauthorized! Token might be invalid or expired.");
          localStorage.removeItem("access_token");
          window.location.reload();
        }
      }
    },
    [dispatch]
  );

  const handleDecoded = () => {
    let storageData = localStorage.getItem("access_token");
    let decoded = {};
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData);
      decoded = jwtDecode(storageData);
    }
    return { decoded, storageData };
  };

  useEffect(() => {
    setIsPending(true);
    const { storageData, decoded } = handleDecoded();
    if (decoded?.id) {
      handleGetDetailsUser(decoded?.id, storageData);
    }
    setIsPending(false);
  }, [handleGetDetailsUser]);

  UserServices.axiosJWT.interceptors.request.use(
    async (config) => {
      const currentTime = new Date();
      const { decoded } = handleDecoded();

      if (decoded?.exp < currentTime.getTime() / 1000) {
        try {
          const data = await UserServices.refreshToken();
          if (!data?.access_token) {
            throw new Error("No new access token received.");
          }

          config.headers["token"] = `Bearer ${data.access_token}`;
        } catch (error) {
          console.error("Failed to refresh token:", error);

          localStorage.removeItem("access_token");
          window.location.reload();
          return Promise.reject(error);
        }
      }
      return config;
    },
    (err) => {
      console.error("Axios interceptor error:", err);
      return Promise.reject(err);
    }
  );

  return (
    <div>
      <Loading isPending={isPending} style={{ background: "#ccc" }}>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            {routes.map((route) => {
              const Page = route.page;
              const ischeckAuth = !route.isPrivate || user.isAdmin;
              const Layout = route.isShowHeader ? DefaultComponet : Fragment;
              return (
                <Route
                  key={route.path}
                  path={ischeckAuth ? route.path : undefined}
                  element={
                    <Layout>
                      <Page />
                    </Layout>
                  }
                />
              );
            })}
          </Routes>
        </Router>
      </Loading>
    </div>
  );
}

export default App;
