import React from 'react';
import { Button, Card, CardBody, CardTitle, CardHeader } from 'reactstrap';

function SolveCount({ totalProblemsSolved, updateProblemCount }) {
  return (
    <Card>
      
      <CardHeader>
              <h3>Total Problems Solved</h3>
            </CardHeader>
            <CardBody>
        <div className="mb-3">
          <span className="font-weight-bold">{totalProblemsSolved}</span>
        </div>
        <Button color="primary" onClick={updateProblemCount} className='mt-2'>Update Problem Count</Button>
      </CardBody>
    </Card>
  );
}

export default SolveCount;
