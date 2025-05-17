import { Button, Input, Text, Uploader } from 'rsuite';
import Cookies from 'js-cookie';
import type { FileType } from 'rsuite/Uploader';
import { useState } from 'react';
import ImagePreview from '@/components/ImagePreview.tsx';
import type { IPictureFormInputs } from '@/types/picture.ts';
import type { FormState, UseFormTrigger } from 'react-hook-form';

// 10 MB max file size
const MAX_SIZE = 10 * 1024 * 1024;
// allowed MIME types
const SUPPORTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/gif'];

type ValueType = IPictureFormInputs['picture'];

interface PictureSelectorProps {
  value: ValueType;
  onChange: (value: ValueType) => void;
  trigger: UseFormTrigger<IPictureFormInputs>;
  errors: FormState<IPictureFormInputs>['errors']['picture'];
  isEdit: boolean;
}

export default function PictureSelector({
  value,
  onChange,
  trigger,
  // errors,
  isEdit,
}: PictureSelectorProps) {
  const previewUrl = isEdit ? value.imgUrl : value.isUploaded ? value.imgUrl : value.srcImgUrl;

  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="picture-selector">
      <ImagePreview width={400} height={500} src={previewUrl || undefined} />
      {!isEdit && (
        <Uploader
          action="/api/upload"
          headers={{ 'X-XSRF-TOKEN': Cookies.get('XSRF-TOKEN') }}
          accept={SUPPORTED_FORMATS.join(',')}
          fileListVisible={false}
          multiple={false}
          shouldUpload={(file: FileType) =>
            !!file.blobFile &&
            file.blobFile.size <= MAX_SIZE &&
            SUPPORTED_FORMATS.includes(file.blobFile.type)
          }
          onChange={(fileList) => {
            onChange({
              ...value,
              isUploaded: true,
              imgFile: fileList[0]?.blobFile || null,
              imgUrl: null,
            });
            setIsUploading(true);
            trigger('picture.imgFile');
          }}
          onSuccess={(rsp, file) => {
            onChange({
              ...value,
              isUploaded: true,
              imgFile: file.blobFile || null,
              imgUrl: rsp?.imageUrl || null,
            });
            setIsUploading(false);
          }}
          onError={(rsp, file) => {
            setIsUploading(false);
            console.log('file error', rsp, file);
          }}
        >
          <Button>Upload</Button>
        </Uploader>
      )}
      {!isEdit && <Text>Or</Text>}
      <Input
        placeholder={isEdit ? '--' : 'Paste source image URL here'}
        disabled={isUploading || isEdit}
        value={value.srcImgUrl || ''}
        onChange={(val) => {
          onChange({ ...value, srcImgUrl: val });
        }}
        onBlur={() => {
          if (isUploading) {
            return;
          }
          onChange({ ...value, isUploaded: false });
          trigger('picture.srcImgUrl');
        }}
      />
    </div>
  );
}
