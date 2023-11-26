import React from 'react';
import { Button, Input, ListGroup, ListGroupItem, FormGroup, Label, Container, Row, Col, Card, CardBody, CardHeader } from 'reactstrap';

function HandleManager({ handles, newHandle, setNewHandle, addHandle }) {
  return (
    <Container>
      <Row>
        <Col>
          <Card>
            <CardHeader>
              <h3>Codeforces Handles</h3>
            </CardHeader>
            <CardBody>
              <FormGroup>
                
                <Input
                  id="handleInput"
                  type="text"
                  value={newHandle}
                  onChange={(e) => setNewHandle(e.target.value)}
                  placeholder="Enter Codeforces handle"
                />
                <Button color="primary" onClick={addHandle} className="mt-2">Add Handle</Button>
              </FormGroup>
              <ListGroup>
                {handles.map((handle, index) => (
                  <ListGroupItem key={index}>{handle}</ListGroupItem>
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
