import React from 'react';
import styled from 'styled-components';

interface IProps {
  children: React.ReactNode;
}

const Wrapper = styled.section`
  max-width: 720px;
  margin: 0 auto;
  padding: 0 15px;
`;

const Layout: React.FC<IProps> = ({ children }) => {
  return (
    <Wrapper>
      {children}
    </Wrapper>
  );
};

export default Layout;