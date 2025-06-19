import Head from "next/head";

const PageContainer = ({ title, description, children }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
      </Head>
      
        {children}
      
    </>
  );
};

export default PageContainer;
