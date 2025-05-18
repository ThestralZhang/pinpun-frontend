import UserInfoForm from '@/components/UserInfoForm.tsx';

export default function Signup() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="px-10 py-8 rounded-lg shadow-md bg-white">
        <UserInfoForm mode="new" />
      </div>
    </div>
  );
}
