import { useId } from 'react';
import styled from 'styled-components';

import { useConst } from '../../features/consts/hooks/useConst';
import { Color, Space, Typography } from '../styles/variables';

import { Spacer } from './Spacer';
import { Text } from './Text';

const _Content = styled.section`
  white-space: pre-line;
`;
export default function OverviewDialogContent() {
  const { data } = useConst({ params: { id: 'overview' } });
  const overviewDialogA11yId = useId();

  return (
    <_Content aria-labelledby={overviewDialogA11yId} role="dialog">
      <Text as="h2" color={Color.MONO_100} id={overviewDialogA11yId} typography={Typography.NORMAL16}>
        Cyber TOONとは
      </Text>
      <Spacer height={Space * 1} />
      <Text as="p" color={Color.MONO_100} typography={Typography.NORMAL12}>
        {data}
      </Text>
    </_Content>
  );
}
