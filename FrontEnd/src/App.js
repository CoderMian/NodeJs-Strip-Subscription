import Product from "./Components/Product";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import SignUp from "./Components/Credentials/SignUp";
import Login from "./Components/Credentials/Login";
import AppNavbar from "./Components/Navbar/AppNavbar";
import PageNotFound from "./Components/PageNotFound";
import PrivateRoute from "./Components/PrivateRoute/PrivateRoute";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, signin } from "./features/userSlice";
import { useEffect } from "react";
import Subcription from "./Components/Subcription/Subcription";
import SubcriptionPrivate from "./Components/PrivateRoute/SubcriptionPrivate";
import Addproduct from "./Components/Addproduct";
import YearlyPrivate from "./Components/PrivateRoute/YearlyPrivate";
import Profile from "./Profile/Profile";
import axios from "axios";
function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const token = localStorage.getItem("token");
  useEffect(() => {
    const url = "http://localhost:4000/api/getProfile";
    if (token !== null) {
      axios
        .get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          console.log("Data from profile Api----", response.data);
          dispatch(
            signin({
              name: response.data.name,
              email: response.data.email,
              phones: response.data.phones,
              token: response.data.token,
              image: response.data.image,
              video: response.data.video,
              isVerified: response.data.isVerified,
              isLogin: response.data.isLogin,
              subscriptionStatus: response.data.mySubscriptions,
            })
          );
        })
        .catch((error) => {
          console.log("error from api", error);
        });
    }
  }, []);

  return (
    <>
      <AppNavbar />
      <Router>
        <Routes>
          <Route
            path="/subcriptionPlan"
            element={
              <PrivateRoute>
                <Subcription />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/showData"
            element={
              <SubcriptionPrivate>
                <Product />
              </SubcriptionPrivate>
            }
          />
          <Route
            exact
            path="/Profile"
            element={
              <SubcriptionPrivate>
                <Profile />
              </SubcriptionPrivate>
            }
          />
          <Route
            exact
            path="/addUpdateProduct"
            element={
              <YearlyPrivate>
                <Addproduct />
              </YearlyPrivate>
            }
          />

          <Route exact path="/signUp" element={<SignUp />} />

          <Route exact path="/" element={<Login />} />
          <Route exact path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </>
  );
}
export default App;
