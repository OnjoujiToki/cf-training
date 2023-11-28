import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input, Card, CardBody, CardHeader, Alert } from 'reactstrap';
import { db, auth } from '../../config/firebase'; // Adjust import path as needed
import { doc, getDoc, updateDoc } from 'firebase/firestore';

function SettingsPage() {
  const [showTags, setShowTags] = useState(false);
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    if (auth.currentUser) {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      getDoc(userDocRef).then((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setShowTags(userData.showTags || false);
          setNickname(userData.name || '');
        }
        setLoading(false);
      });
    }
  }, []);

  const handleShowTagsChange = (e) => {
    setShowTags(e.target.checked);
  };

  const handleNicknameChange = (e) => {
    setNickname(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      alert('No user logged in');
      return;
    }

    const userDocRef = doc(db, "users", auth.currentUser.uid);
    await updateDoc(userDocRef, {
      showTags: showTags,
      name: nickname
    });

    alert('Settings updated successfully!');
  };

  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <div>
      <Card>
        <CardHeader><h2>Settings</h2></CardHeader>
        <CardBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Show Problem Tags</Label>
              <Input type="switch" id="showTagsSwitch" name="showTags" checked={showTags} onChange={handleShowTagsChange} />
            </FormGroup>
            <FormGroup>
              <Label for="nickname">Nickname</Label>
              <Input type="text" name="nickname" id="nickname" value={nickname} onChange={handleNicknameChange} />
            </FormGroup>
            <Button type="submit" color="primary">Save Changes</Button>
          </Form>
          {saveStatus && <Alert color="success" className="mt-3">{saveStatus}</Alert>}
        </CardBody>
      </Card>
    </div>
  );
}

export default SettingsPage;
