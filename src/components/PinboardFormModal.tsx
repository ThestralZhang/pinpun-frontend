import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Button, Form, Modal, Toggle } from 'rsuite';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import type { ObjectSchema } from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createPinboard } from '@/api/pinboard.ts';
import type { IPinboard } from '@/types';

const schema = yup.object({
  title: yup.string().max(50).required('Title is required'),
  description: yup.string().max(100).optional(),
  isPublic: yup.boolean(),
});

export default NiceModal.create(function PinboardFormModal({
  mode = 'new',
}: {
  mode: 'new' | 'edit';
}) {
  const modal = useModal();
  const queryClient = useQueryClient();
  // const toast = useToaster();

  const createMutation = useMutation({
    mutationFn: (newPinboard: IPinboard) => createPinboard(newPinboard),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pinboards'] });
      // console.log('success', data);
      // toast.push(
      //   <Message showIcon type="success" closable>
      //     A new pinboard has been created!
      //   </Message>,
      //   { placement: 'bottomEnd', duration: 2000 },
      // );
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

  const onClose = () => {
    modal.hide();
    reset();
  };

  const onSubmit = async (data: IPinboard) => {
    await createMutation.mutateAsync(data);
    onClose();
    // console.log(data);
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
