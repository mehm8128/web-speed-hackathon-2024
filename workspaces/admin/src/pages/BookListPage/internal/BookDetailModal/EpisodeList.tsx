import { Box, Button, Flex, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';
import { Suspense } from 'react';

import { useEpisodeList } from '../../../../features/episodes/hooks/useEpisodeList';

type Props = {
  bookId: string;
};

const EpisodeList: React.FC<Props> = ({ bookId }) => {
  const { data: episodeList } = useEpisodeList({ bookId });

  return (
    <Flex flexGrow={1} flexShrink={1} overflow="hidden">
      {episodeList != null && (
        <>
          {episodeList.length !== 0 ? (
            <TableContainer flexGrow={1} flexShrink={1} overflowY="auto">
              <Table aria-label="エピソード一覧" variant="striped">
                <Thead backgroundColor="white" position="sticky" top={0} zIndex={1}>
                  <Tr>
                    <Th w={120}></Th>
                    <Th>エピソード名</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {episodeList.map((episode) => (
                    <Tr key={episode.id}>
                      <Td textAlign="center" verticalAlign="middle">
                        <Button
                          as={Link}
                          colorScheme="teal"
                          role="button"
                          to={`/admin/books/${bookId}/episodes/${episode.id}`}
                          variant="solid"
                        >
                          編集
                        </Button>
                      </Td>
                      <Td verticalAlign="middle">
                        <Text fontWeight="bold">{episode.name}</Text>
                        <Text color="gray.400" fontSize="small">
                          {episode.id}
                        </Text>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          ) : (
            <Text align="center" flexGrow={1} flexShrink={1} pt={2}>
              エピソードがありません
            </Text>
          )}
        </>
      )}
    </Flex>
  );
};

const EpisodeListWithSuspense: React.FC<Props> = ({ bookId }) => {
  return (
    <Suspense fallback={<Box flexGrow={1} flexShrink={1} />}>
      <EpisodeList bookId={bookId} />
    </Suspense>
  );
};

export { EpisodeListWithSuspense as EpisodeList };
