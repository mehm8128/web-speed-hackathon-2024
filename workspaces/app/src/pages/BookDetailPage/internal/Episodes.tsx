import { Suspense } from 'react';

import { EpisodeListItem } from '../../../features/episode/components/EpisodeListItem';
import { useEpisodeList } from '../../../features/episode/hooks/useEpisodeList';
import { Flex } from '../../../foundation/components/Flex';
import { Spacer } from '../../../foundation/components/Spacer';
import { Text } from '../../../foundation/components/Text';
import { Color, Space, Typography } from '../../../foundation/styles/variables';

type Props = {
  bookId: string;
};

const Episodes: React.FC<Props> = ({ bookId }) => {
  const { data: episodeList } = useEpisodeList({ query: { bookId } });

  return (
    <Flex align="center" as="ul" direction="column" justify="center">
      {episodeList.map((episode) => (
        <EpisodeListItem key={episode.id} bookId={bookId} episodeId={episode.id} />
      ))}
      {episodeList.length === 0 && (
        <>
          <Spacer height={Space * 2} />
          <Text color={Color.MONO_100} typography={Typography.NORMAL14}>
            この作品はまだエピソードがありません
          </Text>
        </>
      )}
    </Flex>
  );
};

const EpisodesWithSuspense: React.FC<Props> = ({ bookId }) => {
  return (
    <Suspense fallback={null}>
      <Episodes bookId={bookId} />
    </Suspense>
  );
};

export { EpisodesWithSuspense as Episodes };
