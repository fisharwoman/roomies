import React, { Component } from "react";
import Calendar from "./Calendar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

 
class Home extends Component {
  render() {
    return (
      <div>


          <Container>
              <Row className="justify-content-md-center">
                  <Col xs lg="2">
                      1 of 3
                  </Col>
                  <Col md="auto">Variable width content</Col>
                  <Col xs lg="2">
                      3 of 3
                  </Col>
              </Row>
              <Row>
                  <Col>1 of 3</Col>
                  <Col md="auto">Variable width content</Col>
                  <Col xs lg="2">
                      3 of 3
                  </Col>
              </Row>
          </Container>
      </div>




    );
  }
}

export default Home;
