import React from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { GlobalStyle } from "../../Styles/globalStyles";
import { useFormik } from "formik";
import { signUpSchema } from "../../schemas/signupValidate";
import { AiOutlineMinusCircle } from "react-icons/ai";
import { AiOutlinePlusCircle } from "react-icons/ai";

const SignUp = () => {
  const navigate = useNavigate();
  const initialValues = {
    name: "",
    password: "",
    email: "",
    confirm_password: "",
    avatar: null,
    video: null,
    phones: [{ no: " " }],
  };

  const newUserMutation = useMutation({
    mutationFn: ({ url, data }) => {
      console.log("avatar value to send in mutation", data);
      return axios.post(url, data);
    },
    onSuccess: (res) => {
      console.log("data sent succesfully", res);
      alert("Successfuly Submitted");
      navigate("/");
    },
    onError: (error) => {
      console.log("Error!!!", error.response.data.msg);
      alert("Not submitted");
    },
  });
  //send user to mongoose
  const sendUserToMongoose = (value) => {
    const url = "http://localhost:4000/api/signup";
    console.log("data to send in mongoose", value);
    //create form data to send to server without this data image files not sent
    const data = new FormData();
    data.append("name", value.name);
    data.append("email", value.email);
    data.append("phones", value.phones);
    data.append("password", value.password);
    data.append("confirm_password", value.confirm_password);
    data.append("avatar", value.avatar);
    data.append("phones", value.phones);
    data.append("video", value.video);
    newUserMutation.mutate({ url, data });
  };

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema: signUpSchema,
    onSubmit: (values, action) => {
      sendUserToMongoose(values);
      setFieldValue("avatar", null);
      action.resetForm();
    },
  });
  const handleAddPhoneField = () => {
    const updatedFields = [...values.phones, { no: null }];
    setFieldValue("phones", updatedFields);
  };

  const handleRemovePhoneField = (index) => {
    const numberAray = [...values.phones];
    if (numberAray.length > 1) {
      const removeIndex = numberAray.filter((data, ind) => index !== ind);
      setFieldValue("phones", removeIndex);
    } else {
      alert("One Field Must Required!!!");
    }
  };

  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <div className="mcontainer">
          <div className="mmodal">
            <div className="mmodal-container">
              <div className="modal-left">
                <form onSubmit={handleSubmit}>
                  <div className="input-block">
                    <label htmlFor="name" className="input-label">
                      Name
                    </label>
                    <input
                      type="name"
                      autoComplete="off"
                      name="name"
                      id="name"
                      placeholder="Name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.name && touched.name ? (
                      <p className="form-error">{errors.name}</p>
                    ) : null}
                  </div>
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

                  {values?.phones?.map((phoneField, index) => (
                    <div key={index} className="input-block">
                      <label htmlFor="phone" className="input-label">
                        Phone
                      </label>
                      <div className="mix d-flex flex-column justify-content-between">
                        <input
                          type="text"
                          name={`phones.${index}.no`}
                          value={phoneField.no}
                          placeholder={`phone: ${index}`}
                          onChange={handleChange}
                          handleBlur={handleBlur}
                        />
                        {touched?.phones?.[index]?.no &&
                          errors?.phones?.[index]?.no && (
                            <p className="form-error">
                              {errors.phones[index].no}
                            </p>
                          )}
                      </div>
                      <div className="mix d-flex flex-row justify-content-between pt-3">
                        <AiOutlineMinusCircle
                          onClick={() => {
                            handleRemovePhoneField(index);
                          }}
                        />
                        <AiOutlinePlusCircle
                          onClick={() => {
                            handleAddPhoneField();
                          }}
                        />
                      </div>
                    </div>
                  ))}

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

                  <div className="input-block">
                    <label htmlFor="confirm_password" className="input-label">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      autoComplete="off"
                      name="confirm_password"
                      id="confirm_password"
                      placeholder="Confirm Password"
                      value={values.confirm_password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.confirm_password && touched.confirm_password ? (
                      <p className="form-error">{errors.confirm_password}</p>
                    ) : null}
                  </div>
                  <div className="input-block">
                    <label htmlFor="file_upload" className="input-label">
                      Avatar:
                    </label>
                    <input
                      type="file"
                      name="avatar"
                      onChange={(event) => {
                        setFieldValue("avatar", event.currentTarget.files[0]);
                      }}
                    />
                    {touched.avatar && errors.avatar && (
                      <p className="form-error">{errors.avatar}</p>
                    )}
                  </div>
                  <div className="input-block">
                    <label htmlFor="file_upload" className="input-label">
                      Video:
                    </label>
                    <input
                      type="file"
                      name="video"
                      onChange={(event) => {
                        setFieldValue("video", event.currentTarget.files[0]);
                      }}
                    />
                    {touched.video && errors.video && (
                      <p className="form-error">{errors.video}</p>
                    )}
                  </div>
                  <div className="modal-buttons ">
                    <p>Are you sure to register?</p>
                    <button className="input-button" type="submit">
                      Registration
                    </button>
                  </div>
                </form>
                <div className=" mt-5 modal-buttons d-flex justify-content-between ">
                  <p>Already have an account?</p>
                  <button
                    onClick={() => {
                      navigate("/");
                    }}
                    className="input-button w-50 bg-success"
                  >
                    Login
                  </button>
                </div>
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
// all css of signUp wrapped in a wrapper
const Wrapper = styled.section`
  .container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #efedee;
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
export default SignUp;
