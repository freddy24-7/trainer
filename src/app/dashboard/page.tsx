import LoginModal from '@/components/LoginModal';
import Dashboard from '@/app/dashboard/Dashboard';
import { fetchAndCheckUser } from '@/app/fetchAndCheckUser';

export default async function DashboardPage() {
  const signedInUser = await fetchAndCheckUser();

  if (!signedInUser) {
    return <LoginModal />;
  }

  return (
    <>
      <Dashboard signedInUser={signedInUser} />
    </>
  );
}
