import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { routes } from "./routers";
import DefaultComponet from "./components/DefaultComponent/DefaultComponet";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

function App() {
  // useEffect(() => {
  //   fetchApi();
  // }, []);
  const fetchApi = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/product/get-all`
    );
    return res.data;
  };

  const query = useQuery({ queryKey: ["todos"], queryFn: fetchApi });
  console.log("query", query);

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
