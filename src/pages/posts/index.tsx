import Head from 'next/head';
import { createClient } from "../../services/prismic";
import { GetStaticProps } from 'next';
import { asText } from '@prismicio/helpers';

import styles from "./styles.module.scss";

type Post = {
  title: string
  slug: string
  updatedAt: string,
  excerpt: string,
}

interface PostsProps {
  posts: Post[]
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Posts | ig.news</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {
            posts.map((post) => (
              <a key={post.slug} href="#">
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            ))
          }
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = createClient();

  const response = await prismic.getAllByType('post', {
    fetch: ['post.title', 'post.content'],
    pageSize: 10
  })

  const posts = response.map((post) => {
    return {
      slug: post.uid,
      title: asText(post.data.title),
      excerpt: post.data.content.find((content: any) => content.type === 'paragraph')?.['text'] ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    };
  })

  return {
    props: {
      posts
    }
  }
}
