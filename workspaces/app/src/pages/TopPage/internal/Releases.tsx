import { Suspense } from 'react';

import { BookCard } from '../../../features/book/components/BookCard';
import { useRelease } from '../../../features/release/hooks/useRelease';
import { Flex } from '../../../foundation/components/Flex';
import { Space } from '../../../foundation/styles/variables';
import { getDayOfWeekStr } from '../../../lib/date/getDayOfWeekStr';

const Releases: React.FC = () => {
  const todayStr = getDayOfWeekStr(new Date());
  const { data: release } = useRelease({ params: { dayOfWeek: todayStr } });

  return (
    <Flex align="stretch" gap={Space * 2} justify="flex-start">
      {release.books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </Flex>
  );
};

const ReleasesWithSuspense: React.FC = () => {
  return (
    <Suspense fallback={<div style={{ height: 244 }} />}>
      <Releases />
    </Suspense>
  );
};

export { ReleasesWithSuspense as Releases };
