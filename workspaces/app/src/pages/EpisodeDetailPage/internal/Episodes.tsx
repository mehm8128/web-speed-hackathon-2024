import { Suspense } from 'react';

import { EpisodeListItem } from '../../../features/episode/components/EpisodeListItem';
import { useEpisodeList } from '../../../features/episode/hooks/useEpisodeList';
import { Flex } from '../../../foundation/components/Flex';

type Props = {
  bookId: string;
};

const Episodes: React.FC<Props> = ({ bookId }) => {
  const { data: episodeList } = useEpisodeList({ query: { bookId } });

  return (
    <Flex align="center" as="ul" direction="column" justify="center">
      {episodeList.map((episode) => (
        <EpisodeListItem key={episode.id} bookId={bookId} episode={episode} />
      ))}
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
