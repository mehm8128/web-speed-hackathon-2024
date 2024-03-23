import { useSetAtom } from 'jotai';
import React, { Suspense } from 'react';
import styled from 'styled-components';

import { DialogContentAtom } from '../atoms/DialogContentAtom';
import { Color, Space } from '../styles/variables';

import { Box } from './Box';
import { Button } from './Button';
import { Flex } from './Flex';

const CompanyDialogContent = React.lazy(() => import('./CompanyDialogContent'));
const ContactDialogContent = React.lazy(() => import('./ContactDialogContent'));
const OverviewDialogContent = React.lazy(() => import('./OverviewDialogContent'));
const QuestionDialogContent = React.lazy(() => import('./QuestionDialogContent'));
const TermDialogContent = React.lazy(() => import('./TermDialogContent'));

const _Button = styled(Button)`
  color: ${Color.MONO_A};
`;

export const Footer: React.FC = () => {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const updateDialogContent = useSetAtom(DialogContentAtom);

  const handleRequestToTermDialogOpen = () => {
    updateDialogContent(
      <Suspense>
        <TermDialogContent />
      </Suspense>,
    );
  };

  const handleRequestToContactDialogOpen = () => {
    updateDialogContent(
      <Suspense>
        <ContactDialogContent />
      </Suspense>,
    );
  };

  const handleRequestToQuestionDialogOpen = () => {
    updateDialogContent(
      <Suspense>
        <QuestionDialogContent />
      </Suspense>,
    );
  };

  const handleRequestToCompanyDialogOpen = () => {
    updateDialogContent(
      <Suspense>
        <CompanyDialogContent />
      </Suspense>,
    );
  };

  const handleRequestToOverviewDialogOpen = () => {
    updateDialogContent(
      <Suspense>
        <OverviewDialogContent />
      </Suspense>,
    );
  };

  return (
    <Box as="footer" backgroundColor={Color.Background} p={Space * 1}>
      <Flex align="flex-start" direction="column" gap={Space * 1} justify="flex-start">
        <img alt="Cyber TOON" src="/assets/cyber-toon.svg" />
        <Flex align="start" direction="row" gap={Space * 1.5} justify="center">
          <_Button disabled={!isClient} onClick={handleRequestToTermDialogOpen}>
            利用規約
          </_Button>
          <_Button disabled={!isClient} onClick={handleRequestToContactDialogOpen}>
            お問い合わせ
          </_Button>
          <_Button disabled={!isClient} onClick={handleRequestToQuestionDialogOpen}>
            Q&A
          </_Button>
          <_Button disabled={!isClient} onClick={handleRequestToCompanyDialogOpen}>
            運営会社
          </_Button>
          <_Button disabled={!isClient} onClick={handleRequestToOverviewDialogOpen}>
            Cyber TOONとは
          </_Button>
        </Flex>
      </Flex>
    </Box>
  );
};
