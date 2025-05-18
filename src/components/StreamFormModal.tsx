import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Button, Form, Modal } from 'rsuite';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import type { ObjectSchema } from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { IStream } from '@/types/stream.ts';
import { createStream, updateStream } from '@/api/stream.ts';

const schema = yup.object({
  name: yup.string().max(50).required('Stream name is required'),
});

export default NiceModal.create(function StreamFormModal({
  mode = 'new',
  streamName,
}: {
  mode: 'new' | 'edit';
  streamName?: string;
}) {
  const modal = useModal();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (newStream: IStream) => createStream(newStream),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stream-list'] });
    },
    onError: (errors) => {
      console.log('errors', errors);
    },
  });

  const editMutation = useMutation({
    mutationFn: (payload: IStream) => updateStream(payload.name, streamName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stream-list'] });
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
  } = useForm<IStream>({
    resolver: yupResolver(schema as ObjectSchema<IStream>),
    defaultValues: { name: '' },
    mode: 'onBlur',
  });

  const onClose = () => {
    modal.hide();
    reset();
  };

  const onSubmit = async (data: IStream) => {
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
      size="xs"
    >
      <Form layout="vertical" onSubmit={(_status, event) => handleSubmit(onSubmit)(event)}>
        <Modal.Header>
          <Modal.Title>{mode == 'new' ? 'New' : 'Edit'} Stream</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.ControlLabel>Stream Name</Form.ControlLabel>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Form.Control {...field} placeholder={mode === 'edit' ? streamName : undefined} />
              )}
            />
            {errors.name && (
              <Form.HelpText style={{ color: 'red' }}>{errors.name.message}</Form.HelpText>
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
