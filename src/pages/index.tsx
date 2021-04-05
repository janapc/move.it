import { useContext } from "react";
import { useRouter } from "next/router";

import { UserContext } from "../contexts/UserContext";

import { Loading } from "../components/Loading";

export default function App () {
  const { isAuthenticated, loading } = useContext(UserContext);
  const router = useRouter();

  if (loading) {
    return <Loading />;
  }

  function page () {
    if (isAuthenticated) router.push("/dashboard/home");
    else router.push("/login");

    return null;
  }

  return page();
}
