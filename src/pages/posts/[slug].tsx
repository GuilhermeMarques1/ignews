import Head from "next/head";
import { GetServerSideProps } from "next";
import { authOptions } from "../api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";
import { createClient } from "../../services/prismic";
import { asText, asHTML } from "@prismicio/helpers";

import styles from "./post.module.scss"

interface PostProps {
  post: {
    slug: string,
    title: string,
    updatedAt: string,
    content: string,
  }
};

export default function Post({ post }: PostProps) {

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
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({req, res, params}) => {
  const session = await getServerSession(req, res, authOptions);
  const { slug } = params;

  if(!session) console.log("Não logado");

  const prismicClient = await createClient();
  const postData = await prismicClient.getByUID('post', `${slug}`);

  const post = {
    slug,
    title: asText(postData.data.title),
    updatedAt: new Date(postData.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }),
    content: asHTML(postData.data.content)
  }

  return {
    props: {
      post: post
    }
  };
}
