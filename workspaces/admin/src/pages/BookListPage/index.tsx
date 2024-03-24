import {
  Button,
  Divider,
  Flex,
  Input,
  Radio,
  RadioGroup,
  Spacer,
  Stack,
  StackItem,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { lazy, Suspense, useId, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { useBookList } from '../../features/books/hooks/useBookList';
import { isContains } from '../../lib/filter/isContains';

const BookDetailModal = lazy(() => import('./internal/BookDetailModal'));
const CreateBookModal = lazy(() => import('./internal/CreateBookModal'));

const BookSearchKind = {
  AuthorId: 'AuthorId',
  AuthorName: 'AuthorName',
  BookId: 'BookId',
  BookName: 'BookName',
} as const;
type BookSearchKind = (typeof BookSearchKind)[keyof typeof BookSearchKind];

const BookModalMode = {
  Create: 'Create',
  Detail: 'Detail',
  None: 'None',
} as const;
type BookModalMode = (typeof BookModalMode)[keyof typeof BookModalMode];

type BookModalState =
  | {
      mode: typeof BookModalMode.None;
      params: object;
    }
  | {
      mode: typeof BookModalMode.Detail;
      params: { bookId: string };
    }
  | {
      mode: typeof BookModalMode.Create;
      params: object;
    };

type BookModalAction = {
  close: () => void;
  openCreate: () => void;
  openDetail: (bookId: string) => void;
};

export const BookListPage: React.FC = () => {
  const { data: bookList = [] } = useBookList();
  const bookListA11yId = useId();

  const form = useForm({
    defaultValues: {
      kind: BookSearchKind.BookId as BookSearchKind,
      query: '',
    },
  });
  const values = useWatch({ control: form.control });

  const filteredBookList = useMemo(() => {
    if (values.query === '') {
      return bookList;
    }

    switch (values.kind) {
      case BookSearchKind.BookId: {
        return bookList.filter((book) => book.id === values.query);
      }
      case BookSearchKind.BookName: {
        return bookList.filter((book) => {
          return (
            isContains({ query: values.query ?? '', target: book.name }) ||
            isContains({ query: values.query ?? '', target: book.nameRuby })
          );
        });
      }
      case BookSearchKind.AuthorId: {
        return bookList.filter((book) => book.author.id === values.query);
      }
      case BookSearchKind.AuthorName: {
        return bookList.filter((book) => {
          return isContains({ query: values.query ?? '', target: book.author.name });
        });
      }
      case undefined:
        return bookList;
      default: {
        values.kind satisfies never;
        return bookList;
      }
    }
  }, [values, bookList]);

  const [modal, setModal] = useState<BookModalState>({
    mode: BookModalMode.None,
    params: {},
  });
  const modalMethod: BookModalAction = {
    close() {
      setModal({ mode: BookModalMode.None, params: {} });
    },
    openCreate() {
      setModal({ mode: BookModalMode.Create, params: {} });
    },
    openDetail(bookId) {
      setModal({ mode: BookModalMode.Detail, params: { bookId } });
    },
  };

  return (
    <>
      <Stack height="100%" p={4} spacing={6}>
        <StackItem aria-label="検索セクション" as="section">
          <RadioGroup name="kind" value={values.kind}>
            <Stack direction="row" spacing={4}>
              <Radio color="gray.400" colorScheme="teal" {...form.register('kind')} value={BookSearchKind.BookId}>
                作品 ID
              </Radio>
              <Radio color="gray.400" colorScheme="teal" {...form.register('kind')} value={BookSearchKind.BookName}>
                作品名
              </Radio>
              <Radio color="gray.400" colorScheme="teal" {...form.register('kind')} value={BookSearchKind.AuthorId}>
                作者 ID
              </Radio>
              <Radio color="gray.400" colorScheme="teal" {...form.register('kind')} value={BookSearchKind.AuthorName}>
                作者名
              </Radio>
            </Stack>
          </RadioGroup>

          <Spacer height={2} />

          <Flex gap={2}>
            <Input borderColor="gray.400" {...form.register('query')} placeholder="条件を入力" />
          </Flex>
        </StackItem>

        <Divider />

        <StackItem
          aria-labelledby={bookListA11yId}
          as="section"
          display="flex"
          flexBasis={0}
          flexDirection="column"
          flexGrow={1}
          flexShrink={1}
          overflow="hidden"
        >
          <Flex align="center" justify="space-between">
            <Text as="h2" fontSize="xl" fontWeight="bold" id={bookListA11yId}>
              作品一覧
            </Text>
            <Button colorScheme="teal" onClick={() => modalMethod.openCreate()} variant="solid">
              作品を追加
            </Button>
          </Flex>
          <TableContainer flexGrow={1} flexShrink={1} overflowY="auto">
            <Table variant="striped">
              <Thead backgroundColor="white" position="sticky" top={0} zIndex={1}>
                <Tr>
                  <Th w={120}></Th>
                  <Th>作品名</Th>
                  <Th>作者名</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredBookList.map((book) => (
                  <Tr key={book.id}>
                    <Td textAlign="center" verticalAlign="middle">
                      <Button colorScheme="teal" onClick={() => modalMethod.openDetail(book.id)} variant="solid">
                        詳細
                      </Button>
                    </Td>
                    <Td verticalAlign="middle">
                      <Text fontWeight="bold">{book.name}</Text>
                      <Text color="gray.400" fontSize="small">
                        {book.id}
                      </Text>
                    </Td>
                    <Td verticalAlign="middle">
                      <Text fontWeight="bold">{book.author.name}</Text>
                      <Text color="gray.400" fontSize="small">
                        {book.author.id}
                      </Text>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </StackItem>
      </Stack>

      {modal.mode === BookModalMode.Detail ? (
        <Suspense>
          <BookDetailModal isOpen bookId={modal.params.bookId} onClose={() => modalMethod.close()} />
        </Suspense>
      ) : null}
      {modal.mode === BookModalMode.Create ? (
        <Suspense>
          <CreateBookModal isOpen onClose={() => modalMethod.close()} />
        </Suspense>
      ) : null}
    </>
  );
};
