import React from 'react';
import { Button, Input, ListGroup, ListGroupItem, FormGroup, Container, Row, Col, Card, CardBody, CardHeader } from 'reactstrap';

function HandleManager({ handles, newHandle, setNewHandle, addHandle }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    addHandle(newHandle);
  };
  
  return (
    <Container>
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <h3>Codeforces Handles</h3>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <Input
                    id="handleInput"
                    type="text"
                    value={newHandle}
                    onChange={(e) => setNewHandle(e.target.value)}
                    placeholder="Enter Codeforces handle"
                    aria-label="Codeforces handle"
                  />
                  <Button color="primary" type="submit" className="mt-2">Add Handle</Button>
                </FormGroup>
              </form>
              <ListGroup>
                {handles.map((handle) => (
                  <ListGroupItem key={handle}>{handle}</ListGroupItem>
                ))}
              </ListGroup>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default HandleManager;
