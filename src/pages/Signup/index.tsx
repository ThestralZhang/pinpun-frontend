import UserInfoForm from '@/components/UserInfoForm.tsx';

export default function Signup() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="px-10 py-8 rounded-3xl shadow-md bg-white">
        <div className="text-center mb-10 text-[50px] text-blue-400 italic font-extrabold">
          PinPun
        </div>
        <UserInfoForm mode="new" />
      </div>
    </div>
  );
}
