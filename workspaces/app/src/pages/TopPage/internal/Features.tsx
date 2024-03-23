import { Suspense } from 'react';

import { FeatureCard } from '../../../features/feature/components/FeatureCard';
import { useFeatureList } from '../../../features/feature/hooks/useFeatureList';
import { Flex } from '../../../foundation/components/Flex';
import { Space } from '../../../foundation/styles/variables';

const Features: React.FC = () => {
  const { data: featureList } = useFeatureList({ query: {} });

  return (
    <Flex align="stretch" direction="row" gap={Space * 2} justify="flex-start">
      {featureList.map((feature) => (
        <FeatureCard key={feature.id} book={feature.book} />
      ))}
    </Flex>
  );
};

const FeaturesWithSuspense: React.FC = () => {
  return (
    <Suspense fallback={<div style={{ height: 220 }} />}>
      <Features />
    </Suspense>
  );
};

export { FeaturesWithSuspense as Features };
