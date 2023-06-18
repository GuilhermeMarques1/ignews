import Head from "next/head";
import { GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { createClient } from "../../../services/prismic";
import { asText, asHTML } from "@prismicio/helpers";
import { useEffect } from "react";
import Link from "next/link";

import styles from "../post.module.scss"

interface PostPreviewProps {
  post: {
    slug: string,
    title: string,
    updatedAt: string,
    content: string,
  }
};

export default function PostPreview({ post }: PostPreviewProps) {
  const {data: session} = useSession();
  const router = useRouter();

  useEffect(() => {
    if(session?.activeSubscription) {
      router.push("/posts");
    }
  }, [session]);

  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>

          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className={styles.continueReading}>
            Wanna continue reading? 
            <Link className={styles.continueReadingLink} href="/">
              Subscribe now 🤗
            </Link>
          </div>
        </article>
      </main>
    </>
  );
}

// Colocar esse código por enquanto...
export const getStaticPaths = () => {
	return {
		paths: [],
		fallback: 'blocking'
	};
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismicClient = createClient();
  const postData = await prismicClient.getByUID('post', `${slug}`);

  const previewContent = postData.data.content.slice(0, 3) as [];

  const post = {
    slug,
    title: asText(postData.data.title),
    updatedAt: new Date(postData.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }),
    content: asHTML(previewContent)
  }

  return {
    props: {
      post: post
    },
    // seconds to revalidate post
    revalidate: 60 * 60, // 1 hour 
  };
}
