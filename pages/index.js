import Head from "next/head";
import styled from "styled-components";
import { AuthProvider } from "../firebase/auth";

const Test = styled.div`
  width: 300px;
  height: 100px;
  background: ${(props) => props.theme.header};
`;

export default function Home({ user }) {
  console.log(user);
  useEffect(() => console.log('wat'), [])

  return <Test>hello {user}</Test>;
}

Home.getInitialProps = async function(router) {
  const { user } = useAuth();
  return { user };
};
