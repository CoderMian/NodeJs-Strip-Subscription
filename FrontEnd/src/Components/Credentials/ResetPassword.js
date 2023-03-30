import React, { useState } from "react";
import "./forget.css";
import { css } from "@emotion/react";
import { BeatLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { toogleForget } from "../../features/userSlice";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
const ResetPassword = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", newpassword: "" });
  const [isLoading, setLoading] = useState(false);
  const handleResetPassword = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  const resetingPassword = () => {
    if (formData.email === "" || formData.newpassword === "") {
      alert("Data Must Required");
    } else {
      setLoading(true);
      axios
        .post("http://localhost:4000/api/resetPassword", formData)
        .then((response) => {
          console.log(response);
          setLoading(false);
          dispatch(toogleForget());
          alert("Password reset successful!");
        })
        .catch((error) => {
          setLoading(false);
          console.log(error.response.data.message);
          alert(error.response.data.message);
        });
    }
  };
  return (
    <div className="forgot-password-popup">
      <div className="w-100 d-flex justify-content-end pb-2">
        <RxCross2
          onClick={() => {
            dispatch(toogleForget());
          }}
        />
      </div>
      <h2>Forgot Password?</h2>
      <p>Please enter your email address and your new password.</p>

      <input
        name="email"
        type="email"
        placeholder="Enter Email"
        value={formData.email}
        onChange={handleResetPassword}
      />
      <input
        type="password"
        name="newpassword"
        placeholder="Enter New Password"
        minlength="6"
        maxlength="6"
        size="6"
        value={formData.newpassword}
        onChange={handleResetPassword}
      />
      <button
        onClick={() => resetingPassword()}
        css={css`
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.5rem 1rem;
          font-size: 1rem;
          font-weight: 400;
          line-height: 1.5;
          text-align: center;
          white-space: nowrap;
          vertical-align: middle;
          background-color: #007bff;
          border: 1px solid #007bff;
          color: #fff;
          border-radius: 0.25rem;
          transition: all 0.15s ease-in-out;
          cursor: pointer;

          &:hover {
            background-color: #0069d9;
            border-color: #0062cc;
          }

          &:focus {
            box-shadow: 0 0 0 0.2rem rgba(38, 143, 255, 0.5);
          }

          &:disabled {
            opacity: 0.65;
          }
        `}
      >
        {isLoading ? (
          <BeatLoader
            size={8}
            color="#fff"
            css={css`
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            `}
          />
        ) : (
          "Submit"
        )}
      </button>
    </div>
  );
};

export default ResetPassword;
