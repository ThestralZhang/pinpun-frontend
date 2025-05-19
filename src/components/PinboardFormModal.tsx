import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Button, Form, Modal, Toggle } from 'rsuite';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import type { ObjectSchema } from 'yup';
import {
  type DefaultError,
  type InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { createPinboard, getPinboardById, updatePinboard } from '@/api/pinboard.tsx';
import type { IPinboard, IPinboardExtended, IPinboardsPaged } from '@/types';
import { useRef, useState } from 'react';
import TextAreaControl from '@/components/TextAreaControl.tsx';
import { useAuthStore } from '@/stores/useAuthStore.ts';

interface IPinboardFormModalProps {
  mode: 'new' | 'edit';
  pinboardId?: number;
}

const schema = yup.object({
  title: yup.string().max(50).required('Title is required'),
  description: yup.string().max(100).optional(),
  isPublic: yup.boolean(),
});

export default NiceModal.create(function PinboardFormModal({
  mode = 'new',
  pinboardId,
}: IPinboardFormModalProps) {
  const modal = useModal();
  const queryClient = useQueryClient();
  const [formLoading, setFormLoading] = useState(false);
  const loginUser = useAuthStore((s) => s.user);

  const createMutation = useMutation<IPinboardExtended, DefaultError, IPinboard>({
    mutationFn: async (newPinboard: IPinboard) => {
      const newId = await createPinboard(newPinboard);
      return {
        ...newPinboard,
        id: newId,
        userId: loginUser?.userId as number,
        username: loginUser?.name as string,
        userAvatarUrl: loginUser?.avatarUrl || null,
        coverUrls: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    },
    onSuccess: (newBoard) => {
      queryClient.setQueriesData<InfiniteData<IPinboardsPaged>>(
        {
          predicate: (query) =>
            Array.isArray(query.queryKey) &&
            query.queryKey[0] === 'paged-pinboards' &&
            !query.queryKey[1]?.search &&
            !query.queryKey[1]?.stream &&
            !query.queryKey[1]?.userId,
        },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page, pageIdx) =>
              pageIdx === oldData.pages.length - 1
                ? { ...page, data: [...page.data, newBoard] }
                : page,
            ),
          };
        },
      );
      queryClient.invalidateQueries({ queryKey: ['pinboards'] });
    },
    onError: (errors) => {
      console.log('errors', errors);
    },
  });

  const editMutation = useMutation({
    mutationFn: (payload: IPinboard) => updatePinboard(pinboardId as number, payload),
    onSuccess: (_i, payload) => {
      queryClient.setQueriesData<InfiniteData<IPinboardsPaged>>(
        {
          queryKey: ['paged-pinboards'],
        },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((p) => ({
              ...p,
              data: p.data.map((board) =>
                board.id === pinboardId ? { ...board, ...payload } : board,
              ),
            })),
          };
        },
      );
      queryClient.invalidateQueries({ queryKey: ['pinboards'] });
      queryClient.invalidateQueries({ queryKey: ['pinboard', pinboardId] });
    },
    onError: (errors) => {
      console.log('errors', errors);
    },
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IPinboard>({
    resolver: yupResolver(schema as ObjectSchema<IPinboard>),
    defaultValues: { title: '', description: '', isPublic: true },
    mode: 'onBlur',
  });

  const initEditRef = useRef(false);
  const initEditForm = async () => {
    if (mode !== 'edit' || initEditRef.current) {
      return;
    }
    initEditRef.current = true;
    setFormLoading(true);
    const data = await getPinboardById(pinboardId);
    reset({
      title: data?.title || '',
      description: data?.description || '',
      isPublic: !!data?.isPublic,
    });
    setFormLoading(false);
  };

  const onClose = () => {
    modal.hide();
    initEditRef.current = false;
  };

  const onSubmit = async (data: IPinboard) => {
    if (mode === 'new') {
      await createMutation.mutateAsync(data);
    } else if (mode === 'edit') {
      await editMutation.mutateAsync(data);
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
        reset({ title: '', description: '', isPublic: true });
        setFormLoading(false);
      }}
      size="340px"
    >
      <Form
        layout="vertical"
        disabled={formLoading}
        onSubmit={(_status, event) => handleSubmit(onSubmit)(event)}
      >
        <Modal.Header>
          <Modal.Title>{mode == 'new' ? 'New' : 'Edit'} Pinboard</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
              render={({ field }) => (
                <Form.Control {...field} accepter={TextAreaControl} rows={5} />
              )}
            />
            {errors.description && (
              <Form.HelpText style={{ color: 'red' }}>{errors.description.message}</Form.HelpText>
            )}
          </Form.Group>

          <Form.Group>
            <Form.ControlLabel>Public Comment?</Form.ControlLabel>
            <Controller
              name="isPublic"
              control={control}
              render={({ field }) => (
                /* @ts-expect-error incompatible type */
                <Form.Control
                  accepter={Toggle}
                  {...field}
                  checkedChildren="Yes"
                  unCheckedChildren="No"
                />
              )}
            />
            {errors.description && (
              <Form.HelpText style={{ color: 'red' }}>{errors.description.message}</Form.HelpText>
            )}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button appearance="primary" type="submit" loading={isSubmitting}>
            Save
          </Button>
          <Button onClick={onClose} appearance="subtle" disabled={isSubmitting}>
            Cancel
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
});
