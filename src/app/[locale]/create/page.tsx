import dynamic from "next/dynamic";

const Page = dynamic(() => import("./content"), {
  ssr: false,
});

export default () => {
  return <Page />;
};
