import styled from 'styled-components';

import { Color } from '../styles/variables';

const _Wrapper = styled.div`
  width: 100%;
`;

const _Separator = styled.div`
  border-top: 1px solid ${Color.MONO_30};
  width: 100%;
`;

export const Separator: React.FC = () => {
  return (
    <_Wrapper>
      <_Separator aria-hidden={true} />
    </_Wrapper>
  );
};
