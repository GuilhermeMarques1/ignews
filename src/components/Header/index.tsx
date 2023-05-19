import { SignInButton } from "../SignInButton";
import Link from "next/link";

import styles from "./styles.module.scss";

export function Header() {  
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}> 
        <img src="/images/logo.svg" alt="logo do ig.news" />
        <nav>
          <Link className={styles.active} href="/">
            Home
          </Link>
          {/* prefetch is automatically true */}
          <Link href="/posts"> 
            Posts
          </Link>
        </nav>
        <SignInButton/>
      </div>
    </header>
  );
}
