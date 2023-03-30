import React, { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { Card, Button } from "react-bootstrap";
import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  allSubData,
  setAllSubcriptionStore,
} from "../../features/subcriptionSlice";
import { selectUser } from "../../features/userSlice";

const CardsContainer = styled.div`
  display: flex;
  height: 75vh;
  align-items: center;
  justify-content: center;
`;

const CardHeader = styled.div`
  height: 30rem;
  background-color: blue;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PriceCircle = styled.div`
  border: 0.5rem solid white;
  width: 12.5rem;
  height: 12.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0.1rem 0.1rem 1rem rgba(19, 20, 19, 0.342);
`;

const PriceText = styled.p`
  font-size: 3rem;
  color: white;
  text-shadow: 0.1rem 0.1rem 1rem rgba(19, 20, 19, 0.342);
`;

const Subcription = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const subcriptions = useSelector(allSubData);
  const user = useSelector(selectUser);
  const subcriptionQuerry = useQuery({
    queryKey: ["subcription"],
    queryFn: async () => {
      return axios
        .get("http://localhost:4000/subcription/prices")
        .then((res) => {
          dispatch(setAllSubcriptionStore([...res.data.data]));
          return res.data;
        });
    },
  });
  const checkSubcription = () => {
    console.log("user fromm subcription", user);
    if (user.subscriptionStatus === "basic") {
      console.log("subscription", user.subscriptionStatus);
      navigate("/showData");
    } else if (user.subscriptionStatus == "year") {
      navigate("/showData");
    } else if (user.subscriptionStatus == "month") {
      navigate("/showData");
    } else {
      alert("you need to subscribe first");
    }
  };
  const createSession = async (PriceId) => {
    let data = {
      priceid: PriceId,
      email: user.email,
      // email: "muhammadnomantariq1999@gmail.com",
    };
    const { data: response } = await axios.post(
      "http://localhost:4000/subcription/session",
      data
    );
    console.log("data", data);
    window.location.href = response.data.url;
  };
  const backgroundColors = {
    Basic: "rgb(104, 219, 104)",
    Monthly: "rgb(185, 42, 23, 0.835)",
    Yearly: "pink",
  };
  //   console.log(subcriptions);
  const nickname = ["Yearly", "Monthly", "Basic"];
  return (
    <>
      {" "}
      {subcriptionQuerry.isFetched ? (
        <Container>
          <CardsContainer>
            {subcriptions?.map((price, index) => (
              <Card
                style={{
                  width: "18rem",
                  height: "25rem",
                  marginRight: "2rem",
                }}
                key={index}
              >
                <CardHeader
                  style={{
                    backgroundColor: backgroundColors[nickname[index]],
                  }}
                >
                  <PriceCircle>
                    <PriceText> ${price.unit_amount / 100}</PriceText>
                  </PriceCircle>
                </CardHeader>
                <Card.Body>
                  <Card.Title style={{ fontSize: "2rem" }}>
                    {nickname[index]}
                  </Card.Title>
                  <Button
                    variant="primary"
                    className="mt-2"
                    onClick={() => createSession(price.id)}
                  >
                    Buy now
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </CardsContainer>
          <div className="d-flex w-100 justify-content-end">
            <button
              onClick={() => {
                checkSubcription();
              }}
              className="btn btn-danger "
            >
              Go Home
            </button>
          </div>
        </Container>
      ) : (
        <h1>.......Loading</h1>
      )}
    </>
  );
};

export default Subcription;
