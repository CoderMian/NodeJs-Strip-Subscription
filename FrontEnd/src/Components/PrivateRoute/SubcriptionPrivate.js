import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectUser, signin } from "../../features/userSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
const SubcriptionPrivate = ({ children }) => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const user = useSelector(selectUser);
  useEffect(() => {
    const url = "http://localhost:4000/api/getProfile";
    const response = axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Data from profile subcription private----", response.data);
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
  }, []);
  console.log("user from subcription private route", user);
  if (!user.email) {
    return <div>Not Login</div>;
  }
  return user.subscriptionStatus === "year" ||
    user.subscriptionStatus === "month" ? (
    children
  ) : (
    <Navigate to={"/"} />
  );
};
export default SubcriptionPrivate;
