import Landing from "../components/Sections/Landing";
import SEO from "../components/SEO";

export async function getServerSideProps(context) {
  let ids = [1, 2, 3, 4];
  return {
    props: { ids },
  };
}

export default function Home({ ids }) {
  return (
    <>
      <SEO />
      <Landing ids={ids} />
    </>
  );
}
