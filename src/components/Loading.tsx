import { useRouter } from "next/router";
import { useEffect } from "react";
import styles from "../styles/components/Loading.module.css";

type LoadingProps = {
  routeName?: string;
}

export function Loading ({ routeName }: LoadingProps) {
  const router = useRouter();

  useEffect(() => {
    if (routeName) {
      router.push(routeName);
    }
  });

  return (
    <div className={styles.loadingContainer} data-testid="loading">
      Loading
      <div>
        <span />
      </div>
    </div>
  );
}
