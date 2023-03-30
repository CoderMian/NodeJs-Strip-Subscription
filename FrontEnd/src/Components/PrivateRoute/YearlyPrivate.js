import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser, signin } from "../../features/userSlice";
import { useDispatch } from "react-redux";
import axios from "axios";

const YearlyPrivate = ({ children }) => {
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

  if (!user.email) {
    return <div>Not Login...</div>;
  }
  return user.subscriptionStatus === "year" ? (
    children
  ) : (
    <Navigate to={"/showData"} />
  );
};

export default YearlyPrivate;
