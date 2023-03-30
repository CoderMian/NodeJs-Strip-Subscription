import React from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showHidePopup, signin } from "../../features/userSlice";
import { useFormik } from "formik";
import { loginInSchema } from "../../schemas/loginValidate";
import { GlobalStyle } from "../../Styles/globalStyles";
import styled from "styled-components";
import { toogleForget } from "../../features/userSlice";
import { useSelector } from "react-redux";
import ResetPassword from "./ResetPassword";
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tooglePassword = useSelector(showHidePopup);
  const initialValues = {
    email: "",
    password: "",
  };

  const loginUserMutation = useMutation({
    mutationFn: ({ url, data }) => {
      console.log("url", data);
      return axios.post(url, data);
    },
    onSuccess: (res) => {
      console.log("sucesssfully");
      if (res.data.isVerified === false) {
        alert("Your email is not verfied");
      } else {
        localStorage.setItem("token", res.data.token);
        console.log("token", res.data.token);
        dispatch(
          signin({
            name: res.data.name,
            email: res.data.email,
            phones: res.data.phones,
            token: res.data.token,
            image: res.data.image,
            video: res.data.video,
            isVerified: res.data.isVerified,
            isLogin: res.data.isLogin,
            subscriptionStatus: res.data.mySubscriptions,
          })
        );
        navigate("/subcriptionPlan");
      }
    },
    onError: (error) => {
      console.log("Error!!!", error);
      // if (error.response?.data?.msg) {
      //   alert(`${error.response.data.msg}`);
      // }
    },
  });

  const sendUserToMongoose = (value) => {
    const url = "http://localhost:4000/api/login";
    console.log("value", value);
    const data = new FormData();
    data.append("email", value.email);
    data.append("password", value.password);
    loginUserMutation.mutate({
      url,
      data: { email: values.email, password: values.password },
    });
  };

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: loginInSchema,
      onSubmit: (values, action) => {
        console.log("submitted");
        sendUserToMongoose(values);
        action.resetForm();
      },
    });
  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <div>{tooglePassword && <ResetPassword />}</div>
        <div className="mcontainer">
          <div className="mmodal">
            <div className="mmodal-container">
              <div className="modal-left">
                <form onSubmit={handleSubmit}>
                  <div className="input-block">
                    <label htmlFor="email" className="input-label">
                      Email
                    </label>
                    <input
                      type="email"
                      autoComplete="off"
                      name="email"
                      id="email"
                      placeholder="Email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.email && touched.email ? (
                      <p className="form-error">{errors.email}</p>
                    ) : null}
                  </div>

                  <div className="input-block">
                    <label htmlFor="password" className="input-label">
                      Password
                    </label>
                    <input
                      type="password"
                      autoComplete="off"
                      name="password"
                      id="password"
                      placeholder="Password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.password && touched.password ? (
                      <p className="form-error">{errors.password}</p>
                    ) : null}
                  </div>
                  <div className="d-flex justify-content-between flex-wrap">
                    <button
                      type="submit"
                      className="btn color-light text-light bg-success col-3 mt-3"
                      style={{ height: "2.5rem" }}
                    >
                      Login
                    </button>
                    <button
                      className="btn color-light text-light bg-danger col-3 mt-3"
                      style={{ height: "2.5rem" }}
                      onClick={() => {
                        dispatch(toogleForget());
                      }}
                    >
                      Forget Pasword
                    </button>
                    <div className="login-info d-flex flex-column col-3 ">
                      <p
                        className="mx-auto"
                        style={{
                          fontSize: "0.7rem",
                          padding: "0px",
                          margin: "0px",
                          color: "blue",
                        }}
                      >
                        Don't have an account?
                      </p>
                      <button
                        onClick={() => {
                          navigate("/signUp");
                        }}
                        className="btn btn-primary w-100 "
                      >
                        Sign Up
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-right">
                <img
                  src="https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=dfd2ec5a01006fd8c4d7592a381d3776&auto=format&fit=crop&w=1000&q=80"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </>
  );
};
const Wrapper = styled.section`
  .container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    // background-color: #efedee;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .mmodal {
    padding-top: 5rem;
    width: 100%;
    height: 100%;
    // background: rgba(51, 51, 51, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: 0.4s;
    overflow: auto;
  }
  .mmodal-container {
    // margin-top: 100px;
    display: flex;
    max-width: 60vw;
    width: 100%;
    border-radius: 10px;

    // position: absolute;
    transition-duration: 0.3s;
    background: #fff;
  }
  .mmodal-title {
    margin: 0;
    font-weight: 400;
    color: #55311c;
  }
  .form-error {
    font-size: 1.4rem;
    color: #b22b27;
  }
  .modal-desc {
    margin: 6px 0 30px 0;
  }
  .modal-left {
    padding: 60px 30px 20px;
    background: #fff;
    flex: 1.5;
    transition-duration: 0.5s;
    opacity: 1;
  }
  .modal-right {
    flex: 2;
    font-size: 0;
    transition: 0.3s;
    overflow: hidden;
  }
  .modal-right img {
    width: 100%;
    height: 100%;
    transform: scale(1);
    -o-object-fit: cover;
    object-fit: cover;
    transition-duration: 1.2s;
  }
  .modal.is-open .modal-left {
    transform: translateY(0);
    opacity: 1;
    transition-delay: 0.1s;
  }
  .modal-buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .modal-buttons p {
    color: rgba(51, 51, 51, 0.6);
    font-size: 14px;
  }
  .sign-up {
    margin: 60px 0 0;
    font-size: 14px;
    text-align: center;
  }

  .input-button {
    padding: 1.2rem 3.2rem;
    outline: none;
    text-transform: uppercase;
    border: 0;
    color: #fff;
    border-radius: 4px;
    background: #8c7569;
    transition: 0.3s;
    cursor: pointer;
    font-family: "Nunito", sans-serif;
  }
  .input-button:hover {
    background: #55311c;
  }
  .input-label {
    font-size: 11px;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.7px;
    color: #8c7569;
    transition: 0.3s;
    padding: 4px 5px 0;
  }
  .input-block {
    display: flex;
    flex-direction: column;
    padding: 10px 10px 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 20px;
    transition: 0.3s;
  }
  .input-block input {
    outline: 0;
    border: 0;
    padding: 4px 5px 0;
    font-size: 14px;
    flex: 1;
  }
  .input-block input::-moz-placeholder {
    color: #ccc;
    opacity: 1;
  }
  .input-block input:-ms-input-placeholder {
    color: #ccc;
    opacity: 1;
  }
  .input-block input::placeholder {
    color: #ccc;
    opacity: 1;
  }
  .input-block:focus-within {
    border-color: #8c7569;
  }
  .input-block:focus-within .input-label {
    color: rgba(140, 117, 105, 0.8);
  }
  .mix > svg {
    color: rgb(140 117 105);
    font-size: 2.5rem;
  }
  @media (max-width: 750px) {
    .modal-container {
      max-width: 90vw;
    }
    .modal-right {
      display: none;
    }
  }
`;
export default Login;
