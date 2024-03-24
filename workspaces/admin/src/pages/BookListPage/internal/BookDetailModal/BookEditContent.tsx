import { AddIcon } from '@chakra-ui/icons';
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  CircularProgress,
  Flex,
  FormControl,
  IconButton,
  Image,
  Input,
  Stack,
  StackItem,
  Textarea,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import * as yup from 'yup';

import type { GetBookResponse } from '@wsh-2024/schema/src/api/books/GetBookResponse';

import { useUpdateBook } from '../../../../features/books/hooks/useUpdateBook';
import { isSupportedImage } from '../../../../lib/image/isSupportedImage';

type BookEditContentProps = {
  book: GetBookResponse;
  onEditComplete: () => void;
};

const schema = yup.object().shape({
  description: yup.string().required('概要を入力してください'),
  image: yup
    .mixed((image): image is File => image instanceof File)
    .optional()
    .test('is-supported-image', '対応していない画像形式です', async (image) => {
      return image == null || (await isSupportedImage(image));
    }),
  name: yup.string().required('作品名を入力してください'),
  nameRuby: yup
    .string()
    .required('作品名のふりがなを入力してください')
    .matches(/^[\p{Script_Extensions=Hiragana}]+$/u, '作品名のふりがなはひらがなで入力してください'),
});

type Schema = yup.InferType<typeof schema>;

export const BookEditContent: React.FC<BookEditContentProps> = ({ book, onEditComplete }) => {
  const { mutate: updateBook } = useUpdateBook();

  const form = useForm<Schema>({
    defaultValues: {
      description: book.description,
      image: undefined as File | undefined,
      name: book.name,
      nameRuby: book.nameRuby,
    },
    mode: 'onBlur',
    resolver: yupResolver(schema),
  });

  const onSubmit = (values: Schema) => {
    updateBook(
      {
        bookId: book.id,
        description: values.description,
        image: values.image,
        name: values.name,
        nameRuby: values.nameRuby,
      },
      {
        onSuccess() {
          onEditComplete();
        },
      },
    );
  };
  const values = useWatch<Schema>({ control: form.control });

  const [avatorUrl, updateAvatorUrl] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (values.image == null) return;
    const url = URL.createObjectURL(values.image);
    updateAvatorUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [values.image]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box aria-label="作品編集" as="section">
      <Box as="form" onSubmit={form.handleSubmit(onSubmit)}>
        <Flex align="center" pb={2}>
          <Box flexShrink={0} position="relative">
            <Image aspectRatio="3 / 4" height={256} objectFit="cover" src={avatorUrl} width={192} />

            <FormControl
              alignItems="center"
              bg="rgba(0, 0, 0, 0.5)"
              display="flex"
              height="100%"
              justifyContent="center"
              left="50%"
              position="absolute"
              top="50%"
              transform="translate(-50%, -50%)"
              width="100%"
            >
              <Controller
                control={form.control}
                name="image"
                render={() => (
                  <Input
                    ref={fileInputRef}
                    hidden
                    onChange={(ev) => {
                      form.setValue('image', ev.target.files?.[0], { shouldTouch: true, shouldValidate: true });
                    }}
                    type="file"
                  />
                )}
              />
              <IconButton
                _focus={{ background: 'none' }}
                _hover={{ background: 'none' }}
                aria-label="作品の画像を選択"
                background="none"
                height="100%"
                icon={<AddIcon color="white" />}
                onClick={onClick}
                width="100%"
              />
            </FormControl>
          </Box>
          <Stack p={4} spacing={2} width="100%">
            <StackItem>
              <Input
                aria-label="作品名（ふりがな）"
                bgColor="white"
                borderColor="gray.300"
                fontSize="sm"
                {...form.register('nameRuby')}
                placeholder="作品名（ふりがな）"
              />
            </StackItem>
            <StackItem>
              <Input
                aria-label="作品名"
                bgColor="white"
                borderColor="gray.300"
                {...form.register('name')}
                placeholder="作品名"
              />
            </StackItem>
            <StackItem>
              <Textarea
                aria-label="概要"
                bgColor="white"
                borderColor="gray.300"
                {...form.register('description')}
                placeholder="概要"
              />
            </StackItem>
          </Stack>
        </Flex>
        {form.formState.isValidating ? (
          <Box>
            <Alert mb={4} status="info">
              <CircularProgress isIndeterminate color="green.600" mr={2} size="1em" />
              検証中...
            </Alert>
          </Box>
        ) : (
          <Box>
            {(Object.keys(form.formState.errors) as Array<keyof typeof form.formState.errors>).map((key) => {
              return (
                <Alert key={key} mb={4} status="error">
                  <AlertIcon />
                  {form.formState.errors[key]?.message}
                </Alert>
              );
            })}
          </Box>
        )}
        <Flex gap={4} justify="flex-end" pb={4}>
          <Button
            colorScheme="teal"
            isDisabled={form.formState.isValidating || !form.formState.isValid}
            type="submit"
            variant="solid"
          >
            決定
          </Button>
          <Button onClick={() => onEditComplete()}>キャンセル</Button>
        </Flex>
      </Box>
    </Box>
  );
};
