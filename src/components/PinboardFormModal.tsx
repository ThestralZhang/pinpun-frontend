import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Button, Form, Modal, Toggle } from 'rsuite';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import type { ObjectSchema } from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPinboard, getPinboardById, updatePinboard } from '@/api/pinboard.ts';
import type { IPinboard } from '@/types';
import { useRef, useState } from 'react';

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
  // const toast = useToaster();

  const createMutation = useMutation({
    mutationFn: (newPinboard: IPinboard) => createPinboard(newPinboard),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pinboards'] });
    },
    onError: (errors) => {
      console.log('errors', errors);
    },
  });

  const editMutation = useMutation({
    mutationFn: (payload: IPinboard) => updatePinboard(pinboardId as number, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pinboards'] });
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
        reset();
        setFormLoading(false);
      }}
      size="xs"
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
              render={({ field }) => <Form.Control {...field} />}
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
              render={({ field }) => <Form.Control accepter={Toggle} {...field} />}
            />
            {errors.description && (
              <Form.HelpText style={{ color: 'red' }}>{errors.description.message}</Form.HelpText>
            )}
          </Form.Group>
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
