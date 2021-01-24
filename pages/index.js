import Head from "next/head";
import styled from "styled-components";

const Test = styled.div`
  width: 300px;
  height: 100px;
  background: ${(props) => props.theme.header};
`;

export default function Home() {
  return <Test>hello</Test>;
}
