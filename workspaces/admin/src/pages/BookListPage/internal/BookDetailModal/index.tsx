import { Button, Divider, Flex, Modal, ModalCloseButton, ModalContent, ModalOverlay, Stack } from '@chakra-ui/react';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';

import { useBook } from '../../../../features/books/hooks/useBook';

import { BookDetailContent } from './BookDetailContent';
import { BookEditContent } from './BookEditContent';
import { EpisodeList } from './EpisodeList';

type Props = {
  bookId: string;
  isOpen: boolean;
  onClose: () => void;
};

export const BookDetailModal: React.FC<Props> = ({ bookId, isOpen, onClose }) => {
  const { data: book } = useBook({ bookId });

  const [isEdit, toggleIsEdit] = useState(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent containerProps={{ p: 8 }} height="100%" m={0} overflowY="auto">
        <ModalCloseButton />
        <Stack height="100%" p={4}>
          {book != null && (
            <>
              {isEdit ? (
                <BookEditContent book={book} onEditComplete={() => toggleIsEdit(!isEdit)} />
              ) : (
                <BookDetailContent book={book} onCloseDialog={onClose} onEdit={() => toggleIsEdit(!isEdit)} />
              )}
            </>
          )}

          <Divider />

          <EpisodeList bookId={bookId} />

          <Flex justifyContent="flex-end">
            <Button
              as={Link}
              colorScheme="teal"
              mt={4}
              role="button"
              to={`/admin/books/${bookId}/episodes/new`}
              variant="solid"
            >
              エピソードを追加
            </Button>
          </Flex>
        </Stack>
      </ModalContent>
    </Modal>
  );
};
