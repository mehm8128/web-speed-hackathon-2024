import { useId } from 'react';
import styled from 'styled-components';

import { TERM } from '../constants/Term';
import { Color, Space, Typography } from '../styles/variables';

import { Spacer } from './Spacer';
import { Text } from './Text';

const _Content = styled.section`
  white-space: pre-line;
`;
export default function TermDialogContent() {
  const termDialogA11yId = useId();

  return (
    <_Content aria-labelledby={termDialogA11yId} role="dialog">
      <Text as="h2" color={Color.MONO_100} id={termDialogA11yId} typography={Typography.NORMAL16}>
        利用規約
      </Text>
      <Spacer height={Space * 1} />
      <Text as="p" color={Color.MONO_100} typography={Typography.NORMAL12}>
        {TERM}
      </Text>
    </_Content>
  );
}
