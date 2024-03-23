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
import { useFormik } from 'formik';
import { forwardRef, memo, useEffect, useRef, useState } from 'react';
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

export const BookEditContent: React.FC<BookEditContentProps> = ({ book, onEditComplete }) => {
  const { mutate: updateBook } = useUpdateBook();

  const formik = useFormik({
    initialValues: {
      description: book.description,
      id: book.id,
      image: undefined as File | undefined,
      name: book.name,
      nameRuby: book.nameRuby,
    },
    onSubmit(values) {
      updateBook(
        {
          bookId: values.id,
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
    },
    validationSchema: schema,
  });

  const [avatorUrl, updateAvatorUrl] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (formik.values.image == null) return;
    const url = URL.createObjectURL(formik.values.image);
    updateAvatorUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [formik.values.image]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onClick = () => {
    formik.setFieldTouched('image', true, false);
    fileInputRef.current?.click();
  };

  return (
    <Box aria-label="作品編集" as="section">
      <Box as="form" onSubmit={formik.handleSubmit}>
        <Flex align="center" pb={2}>
          <Box flexShrink={0} position="relative">
            <Image aspectRatio="3 / 4" height={256} objectFit="cover" src={avatorUrl} width={192} />

            <ImageInput ref={fileInputRef} onClick={onClick} setFieldValue={formik.setFieldValue} />
          </Box>
          <Stack p={4} spacing={2} width="100%">
            <StackItem>
              <RubyInput handleBlur={formik.handleBlur} handleChange={formik.handleChange} values={formik.values} />
            </StackItem>
            <StackItem>
              <NameInput handleBlur={formik.handleBlur} handleChange={formik.handleChange} values={formik.values} />
            </StackItem>
            <StackItem>
              <DescriptionTextarea
                handleBlur={formik.handleBlur}
                handleChange={formik.handleChange}
                values={formik.values}
              />
            </StackItem>
          </Stack>
        </Flex>
        {formik.isValidating ? (
          <Box>
            <Alert mb={4} status="info">
              <CircularProgress isIndeterminate color="green.600" mr={2} size="1em" />
              検証中...
            </Alert>
          </Box>
        ) : (
          <Box>
            {(Object.keys(formik.errors) as Array<keyof typeof formik.errors>).map((key) => {
              return (
                formik.touched[key] && (
                  <Alert key={key} mb={4} status="error">
                    <AlertIcon />
                    {formik.errors[key]}
                  </Alert>
                )
              );
            })}
          </Box>
        )}
        <Flex gap={4} justify="flex-end" pb={4}>
          <Button colorScheme="teal" isDisabled={formik.isValidating || !formik.isValid} type="submit" variant="solid">
            決定
          </Button>
          <Button onClick={() => onEditComplete()}>キャンセル</Button>
        </Flex>
      </Box>
    </Box>
  );
};

const NameInput = memo(
  ({
    handleBlur,
    handleChange,
    values,
  }: {
    handleBlur: ReturnType<typeof useFormik>['handleBlur'];
    handleChange: ReturnType<typeof useFormik>['handleChange'];
    values: ReturnType<typeof useFormik>['values'];
  }) => (
    <Input
      aria-label="作品名"
      bgColor="white"
      borderColor="gray.300"
      name="name"
      onBlur={handleBlur}
      onChange={handleChange}
      placeholder="作品名"
      value={values['name']}
    />
  ),
  (prevProps, nextProps) => prevProps.values['name'] === nextProps.values['name'],
);
NameInput.displayName = 'NameInput';

const RubyInput = memo(
  ({
    handleBlur,
    handleChange,
    values,
  }: {
    handleBlur: ReturnType<typeof useFormik>['handleBlur'];
    handleChange: ReturnType<typeof useFormik>['handleChange'];
    values: ReturnType<typeof useFormik>['values'];
  }) => (
    <Input
      aria-label="作品名（ふりがな）"
      bgColor="white"
      borderColor="gray.300"
      fontSize="sm"
      name="nameRuby"
      onBlur={handleBlur}
      onChange={handleChange}
      placeholder="作品名（ふりがな）"
      value={values['nameRuby']}
    />
  ),
  (prevProps, nextProps) => prevProps.values['nameRuby'] === nextProps.values['nameRuby'],
);
RubyInput.displayName = 'RubyInput';

const DescriptionTextarea = memo(
  ({
    handleBlur,
    handleChange,
    values,
  }: {
    handleBlur: ReturnType<typeof useFormik>['handleBlur'];
    handleChange: ReturnType<typeof useFormik>['handleChange'];
    values: ReturnType<typeof useFormik>['values'];
  }) => (
    <Textarea
      aria-label="概要"
      bgColor="white"
      borderColor="gray.300"
      name="description"
      onBlur={handleBlur}
      onChange={handleChange}
      placeholder="概要"
      value={values['description']}
    />
  ),
  (prevProps, nextProps) => prevProps.values['description'] === nextProps.values['description'],
);
DescriptionTextarea.displayName = 'DescriptionTextarea';

const ImageInput = memo(
  forwardRef<HTMLInputElement, { onClick: () => void; setFieldValue: ReturnType<typeof useFormik>['setFieldValue'] }>(
    ({ onClick, setFieldValue }, ref) => (
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
        <Input
          ref={ref}
          hidden
          onChange={(ev) => {
            setFieldValue('image', ev.target.files?.[0], true);
          }}
          type="file"
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
    ),
  ),
);

ImageInput.displayName = 'ImageInput';
