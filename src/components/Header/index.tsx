import { useRouter } from "next/router";
import { SignInButton } from "../SignInButton";
import { ActiveLink } from "../ActiveLink";

import styles from "./styles.module.scss";

export function Header() {  
  const { asPath } = useRouter();

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}> 
        <img src="/images/logo.svg" alt="logo do ig.news" />
        <nav>
          {
            /*
            <Link className={asPath === '/' ? styles.active : ''} href="/">
              Home
            </Link>
             prefetch is automatically true
            <Link className={asPath === '/posts' ? styles.active : ''} href="/posts"> 
              Posts
            </Link>
            */
          }

          <ActiveLink activeClassName={styles.active} href='/'>
            Home
          </ActiveLink>
          <ActiveLink activeClassName={styles.active} href='/posts'>
            Post
          </ActiveLink>
        </nav>
        <SignInButton/>
      </div>
    </header>
  );
}
