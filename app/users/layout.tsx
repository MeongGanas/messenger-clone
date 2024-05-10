import getUsers from "../actions/getUsers";
import Sidebar from "../components/sidebar/Sidebar";
import UserLists from "./components/UserLists";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await getUsers();

  return (
    <Sidebar>
      <div className="h-full">
        <UserLists items={users} />
        {children}
      </div>
    </Sidebar>
  );
}
