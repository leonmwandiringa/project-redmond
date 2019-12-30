import React from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardText,
  FormGroup,
  Form,
  Input,
  Row,
  Col
} from "reactstrap";

class Register extends React.Component {
  render() {
    return (
      <>
          <Row className="text-center">
            <Col md="4" sm="8" xl="4" style={{margin: '10% auto'}}>
                
            <Form autoComplete="false">
              <Card>
              <h3 className="text-center" style={{margin: '20px 0', padding: 0}}>Dopr</h3>
                <CardBody>
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <Input placeholder="Email" type="email" id="email" style={{marginTop: 10, marginBottom: 10}}/>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <Input
                            placeholder="Your Password"
                            type="password"
                            id="password"
                            style={{marginTop: 10, marginBottom: 10}}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  
                </CardBody>
                <CardFooter>
                  <Button className="btn-fill" color="primary" type="submit">
                    Register
                  </Button>
                </CardFooter>
              </Card>
              </Form>
            </Col>
          </Row>
      </>
    );
  }
}

export default Register;
