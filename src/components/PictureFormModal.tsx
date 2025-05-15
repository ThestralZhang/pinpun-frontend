import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Button, Divider, Form, HStack, Modal, SelectPicker, Stack } from 'rsuite';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import type { ObjectSchema } from 'yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { IPicture, IPictureFormInputs } from '@/types/picture.ts';
import { createPicture, getPictureById, updatePicture } from '@/api/picture.ts';
import type { IPinboardExtended } from '@/types';
import { getPinboardsByUser } from '@/api/pinboard.tsx';
import { useAuthStore } from '@/stores/useAuthStore.ts';
import PictureSelector from '@/components/PictureSelector.tsx';
import PictureTagPicker from '@/components/PictureTagPicker.tsx';
import { useRef, useState } from 'react';

// 10 MB max file size
const MAX_SIZE = 10 * 1024 * 1024;
// allowed MIME types
const SUPPORTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/gif'];

const defaultFormValues = {
  title: '',
  description: '',
  picture: {
    isUploaded: null,
    imgFile: null,
    imgUrl: null,
    srcImgUrl: '',
  },
  pageUrl: '',
  tags: [],
  pinboardId: null,
};

const schema = yup.object({
  picture: yup.object({
    isUploaded: yup.boolean().nonNullable(),
    imgFile: yup
      .mixed<File>()
      .nullable()
      .test('fileSize', 'File must be within 10MB', (file?: File | null) => {
        return !file || file.size <= MAX_SIZE;
      })
      .test('fileType', 'Unsupported file format', (file?: File | null) => {
        return !file || SUPPORTED_FORMATS.includes(file.type);
      }),
    imgUrl: yup.string().url('Image URL must be valid.').nullable(),
    srcImgUrl: yup
      .string()
      .url('Source Image URL must be valid')
      .when('imgUrl', {
        is: (val: string | null | undefined) => !val,
        then: (s) => s.required('Either upload image or paste an external image URL here.'),
        otherwise: (s) => s.notRequired().nullable(),
      }),
  }),
  title: yup.string().max(50).required('Title is required'),
  description: yup.string().max(200).optional(),
  pageUrl: yup.string().url('Page URL must be valid.').nullable(),
  tags: yup
    .array()
    .max(10, 'You can specify at most 10 tags')
    .of(
      yup
        .string()
        .transform((v) => v?.trim())
        .required('Tag name is required')
        .min(1, 'Tag name cannot be blank')
        .max(20, 'Tag name cannot exceed 20 characters'),
    )
    .test('unique', 'Tags must be unique', (tags) => {
      if (!tags) return true;
      const set = new Set(tags);
      return set.size == tags.length;
    }),
  pinboardId: yup.number().required('You must choose a pinboard'),
});

export default NiceModal.create(function PictureFormModal({
  mode = 'new',
  pictureId,
  pinboardId,
}: {
  mode: 'new' | 'edit';
  pictureId?: number;
  pinboardId?: number;
}) {
  const modal = useModal();
  const queryClient = useQueryClient();
  const [formLoading, setFormLoading] = useState(false);
  const { user } = useAuthStore();

  const { data: pinboards = [] } = useQuery<IPinboardExtended[]>({
    queryKey: ['pinboards', { userId: user?.userId }],
    queryFn: () => getPinboardsByUser(user?.userId),
  });

  const createMutation = useMutation({
    mutationFn: (newPicture: IPicture) => createPicture(newPicture),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pictures'] });
    },
    onError: (errors) => {
      console.log('errors', errors);
    },
  });

  const editMutation = useMutation({
    mutationFn: (payload: IPicture) => updatePicture(pictureId as number, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pictures'] });
    },
    onError: (errors) => {
      console.log('errors', errors);
    },
  });

  const {
    reset,
    control,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<IPictureFormInputs>({
    resolver: yupResolver(schema as ObjectSchema<IPictureFormInputs>),
    defaultValues: defaultFormValues,
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const initEditRef = useRef(false);
  const initEditForm = async () => {
    if (mode !== 'edit' || initEditRef.current) {
      return;
    }
    initEditRef.current = true;
    setFormLoading(true);
    const data = await getPictureById(pinboardId as number, pictureId as number);
    reset({
      title: data?.title || '',
      description: data?.description || '',
      pageUrl: data?.pageUrl || '',
      tags: data?.tags || [],
      pinboardId: data?.pinboardId || null,
      picture: {
        imgFile: null,
        imgUrl: data?.imgUrl || null,
        srcImgUrl: data.srcImgUrl || '',
        isUploaded: true,
      },
    });
    setFormLoading(false);
  };

  const onClose = () => {
    modal.hide();
    initEditRef.current = false;
  };

  const onSubmit = async (data: IPictureFormInputs) => {
    const { picture, ...other } = data;
    if (mode === 'new') {
      await createMutation.mutateAsync({
        ...other,
        imgUrl: picture.isUploaded ? picture.imgUrl : null,
        srcImgUrl: picture.isUploaded ? null : picture.srcImgUrl,
      });
    } else if (mode === 'edit') {
      await editMutation.mutateAsync({
        ...other,
        imgUrl: picture.imgUrl,
        srcImgUrl: picture.srcImgUrl,
      });
    }
    onClose();
  };

  return (
    <Modal
      backdrop="static"
      open={modal.visible}
      closeButton={isSubmitting ? false : undefined}
      onClose={onClose}
      onEnter={initEditForm}
      onExited={() => {
        reset(defaultFormValues);
        setFormLoading(false);
      }}
      size="lg"
    >
      <Form
        layout="vertical"
        disabled={formLoading}
        onSubmit={(_status, event) => handleSubmit(onSubmit)(event)}
      >
        <Modal.Header>
          <Modal.Title>{mode == 'new' ? 'New Pin' : 'Edit Picture'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <HStack divider={<Divider vertical />}>
            <Stack.Item>
              <Form.Group>
                <Controller
                  name="picture"
                  control={control}
                  render={({ field }) => (
                    <PictureSelector
                      value={field.value}
                      onChange={field.onChange}
                      trigger={trigger}
                      errors={errors.picture}
                      isEdit={mode === 'edit'}
                    />
                  )}
                />
              </Form.Group>
            </Stack.Item>
            <Stack.Item>
              <Form.Group>
                <Form.ControlLabel>Title</Form.ControlLabel>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => <Form.Control {...field} />}
                />
                {errors.title && (
                  <Form.HelpText style={{ color: 'red' }}>{errors.title.message}</Form.HelpText>
                )}
              </Form.Group>

              <Form.Group>
                <Form.ControlLabel>Description</Form.ControlLabel>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => <Form.Control {...field} />}
                />
                {errors.description && (
                  <Form.HelpText style={{ color: 'red' }}>
                    {errors.description.message}
                  </Form.HelpText>
                )}
              </Form.Group>

              <Form.Group>
                <Form.ControlLabel>Pinboard</Form.ControlLabel>
                <Controller
                  name="pinboardId"
                  control={control}
                  disabled={mode === 'edit'}
                  render={({ field }) => (
                    <Form.Control
                      {...field}
                      accepter={SelectPicker}
                      data={pinboards}
                      labelKey="title"
                      valueKey="id"
                      onChange={(val) => {
                        field.onChange(val);
                        trigger('pinboardId');
                      }}
                    />
                  )}
                />
                {errors.pinboardId && (
                  <Form.HelpText style={{ color: 'red' }}>
                    {errors.pinboardId.message}
                  </Form.HelpText>
                )}
              </Form.Group>

              <Form.Group>
                <Form.ControlLabel>Page URL</Form.ControlLabel>
                <Controller
                  name="pageUrl"
                  disabled={mode === 'edit'}
                  control={control}
                  render={({ field }) => <Form.Control {...field} />}
                />
                {errors.pageUrl && (
                  <Form.HelpText style={{ color: 'red' }}>{errors.pageUrl.message}</Form.HelpText>
                )}
              </Form.Group>

              <Form.Group>
                <Form.ControlLabel>Tag</Form.ControlLabel>
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <PictureTagPicker
                      value={field.value}
                      onChange={field.onChange}
                      trigger={trigger}
                      isEdit={mode === 'edit'}
                    />
                  )}
                />
                {errors.tags && (
                  <Form.HelpText style={{ color: 'red' }}>{errors.tags.message}</Form.HelpText>
                )}
              </Form.Group>
            </Stack.Item>
          </HStack>
        </Modal.Body>
        <Modal.Footer>
          <Button appearance="primary" type="submit" loading={isSubmitting}>
            Ok
          </Button>
          <Button onClick={onClose} appearance="subtle" disabled={isSubmitting}>
            Cancel
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
});
