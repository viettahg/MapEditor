import React from 'react';
import styled from 'styled-components';
import Close from '../../../../../../../../icons/Close';

interface IProps {
  onClick: () => void;
}

const Button = styled.button`
  width: 24px;
  min-width: 24px;
  height: 24px;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  padding: 0;
  cursor: pointer;
  opacity: 0.35;
  & svg {
    width: 14px;
  }
  &:hover {
    opacity: 1;
  }
`;

const ButtonDelete: React.FC<IProps> = ({ onClick }) => {
  return (
    <Button onClick={onClick}>
      <Close />
    </Button>
  );
};

export default ButtonDelete;
