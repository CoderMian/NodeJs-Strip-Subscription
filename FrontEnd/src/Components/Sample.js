import axios from "axios";
import React, { useEffect, useState } from "react";

const Sample = () => {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    avatar: null,
    video: null,
  });
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/get")
      .then((res) => {
        setData(res.data);

        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleInputChange = (event) => {
    const { name, value, type } = event.target;
    const newValue = type === "file" ? event.target.files[0] : value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: newValue,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("password", formData.password);
    data.append("avatar", formData.avatar);
    data.append("video", formData.video);
    axios
      .post("http://localhost:4000/api/signup", data)
      .then((response) => console.log(response))
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <br />
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <br />
        <label>
          Phone:
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <br />
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <br />
        <label>
          Avatar:
          <input type="file" name="avatar" onChange={handleInputChange} />
        </label>
        <br />
        <br />
        <label>
          Famous Work Video:
          <input type="file" name="video" onChange={handleInputChange} />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
      <div className="app">
        <h1>upload image</h1>

        {data.map((single) => {
          // const base64Img = btoa(
          //   new Uint8Array(single.image.data).reduce(
          //     (data, byte) => data + String.fromCharCode(byte),
          //     ""
          //   )
          // );
          return (
            <div>
              <img
                src={`http://localhost:4000/api/${single.image}`}
                alt="Base64-encoded image"
                width="300px"
              />
              <video controls width="300" height="300">
                <source
                  type="video/mp4"
                  src={`http://localhost:4000/api/${single.video}`}
                />
              </video>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sample;
