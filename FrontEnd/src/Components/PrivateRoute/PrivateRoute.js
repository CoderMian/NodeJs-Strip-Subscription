import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser, signin } from "../../features/userSlice";
import { useDispatch } from "react-redux";
import axios from "axios";

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const user = useSelector(selectUser);
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
          console.log(
            "Data from profile subcription private----",
            response.data
          );
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
          console.log("error from subcription private", error);
        });
    }
  }, []);
  console.log("user from subcription private route", user);

  if (user.email === null) {
    return <div>Not Login...</div>;
  }
  console.log("user data", user);
  return user?.email ? children : <Navigate to={"/"} />;
};

export default PrivateRoute;
