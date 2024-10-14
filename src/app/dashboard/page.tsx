import LoginModal from '@/components/LoginModal';
import DashboardClient from '@/components/DashboardClient';
import { fetchAndCheckUser } from '@/app/fetchAndCheckUser';

export default async function DashboardPage() {
  const signedInUser = await fetchAndCheckUser();

  if (!signedInUser) {
    return <LoginModal />;
  }

  return (
    <>
      <DashboardClient signedInUser={signedInUser} />
    </>
  );
}
