import { Suspense } from 'react';

import { RankingCard } from '../../../features/ranking/components/RankingCard';
import { useRankingList } from '../../../features/ranking/hooks/useRankingList';
import { Flex } from '../../../foundation/components/Flex';

const Ranking: React.FC = () => {
  const { data: rankingList } = useRankingList({ query: {} });

  return (
    <Flex align="center" as="ul" direction="column" justify="center">
      {rankingList.map((ranking) => (
        <RankingCard key={ranking.id} book={ranking.book} />
      ))}
    </Flex>
  );
};

const RankingWithSuspense: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <Ranking />
    </Suspense>
  );
};

export { RankingWithSuspense as Ranking };
