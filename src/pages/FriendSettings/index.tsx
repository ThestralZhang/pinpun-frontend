import { Container, Content, Header, Nav } from 'rsuite';
import { useState } from 'react';
import SentRequestList from '@/pages/FriendSettings/SentRequestList.tsx';
import ReceivedRequestList from '@/pages/FriendSettings/ReceivedRequestList.tsx';
import FriendList from '@/pages/FriendSettings/FriendList.tsx';

export default function FriendSettings() {
  const [tab, setTab] = useState<'list' | 'received' | 'sent'>('list');

  return (
    <Container>
      <Header>
        <Nav
          activeKey={tab}
          onSelect={setTab}
          appearance="subtle"
          className="font-bold h-[60px] mr-[50px]"
          justified
        >
          <Nav.Item eventKey="list">Friend List</Nav.Item>
          <Nav.Item eventKey="received">Received Requests</Nav.Item>
          <Nav.Item eventKey="sent">Sent Requests</Nav.Item>
        </Nav>
      </Header>
      <Content className="pt-8">
        {tab === 'list' && <FriendList />}
        {tab === 'received' && <ReceivedRequestList />}
        {tab === 'sent' && <SentRequestList />}
      </Content>
    </Container>
  );
}
