import React from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
const Profile = () => {
  const user = useSelector(selectUser);

  if (!user.email) {
    return <div>Loading...</div>;
  }
  return (
    <Container>
      <Row className="mt-5">
        <Col md={4}>
          <Image src="noman.jpg" roundedCircle fluid />
        </Col>
        <Col md={8}>
          <h2>{user.name}</h2>
          <p>{user.email}</p>

          <p>Famous work: Demo Video of Project</p>
          <div className="embed-responsive embed-responsive-16by9">
            <iframe
              className="embed-responsive-item"
              src={`http://localhost:4000/api/${user.video}`}
              title="Famous Work"
            ></iframe>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
