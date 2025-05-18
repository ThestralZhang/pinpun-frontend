import { VStack, Avatar, Uploader, Button } from 'rsuite';
import type { SignUpForm } from '@/pages/Signup/validation.ts';
import Cookies from 'js-cookie';
import type { FileType } from 'rsuite/Uploader';

// 5 MB max file size
const MAX_SIZE = 5 * 1024 * 1024;
// allowed MIME types
const SUPPORTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/gif'];

interface AvatarUploaderProps {
  value: SignUpForm['avatar'];
  onChange: (value: SignUpForm['avatar']) => void;
}

export default function AvatarUploader({ value, onChange }: AvatarUploaderProps) {
  return (
    <VStack alignItems="center" justifyContent="space-between">
      <Avatar circle src={value.url} className="force-large-avatar w-[150px]! h-[150px]!" />
      <Uploader
        action="/api/upload-avatar"
        headers={{ 'X-XSRF-TOKEN': Cookies.get('XSRF-TOKEN') }}
        accept={SUPPORTED_FORMATS.join(',')}
        fileListVisible={false}
        multiple={false}
        shouldUpload={(file: FileType) =>
          !!file.blobFile &&
          file.blobFile.size <= MAX_SIZE &&
          SUPPORTED_FORMATS.includes(file.blobFile.type)
        }
        onSuccess={(rsp, file) => {
          onChange({
            ...value,
            file: file.blobFile || null,
            url: rsp?.imageUrl || null,
          });
        }}
      >
        <Button>Upload</Button>
      </Uploader>
    </VStack>
  );
}
