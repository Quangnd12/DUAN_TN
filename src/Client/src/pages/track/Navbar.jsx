import React from "react";
import styled from "styled-components";
import { useStateProvider } from "../../utils/StateProvider";

export default function Navbar({ navBackground }) {
  const [{ userInfo }] = useStateProvider();

  return (
    <Container navBackground={navBackground}>
      <div className="logo">
        <h1>Track playlist</h1>
      </div>
      <div className="extra-content">
        {/* Add your new content here */}
        <p>Astist Info</p>
      </div>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  height: 15vh;
  position: sticky;
  top: 0;
  transition: 0.3s ease-in-out;
  background-color: ${({ navBackground }) =>
    navBackground ? "rgba(0,0,0,0.7)" : "none"};
  
  .logo {
    h1 {
      color: white;
      font-size: 2rem;
    }
  }

  .extra-content {
    color: white;
    font-weight: bold;
    /* Add styles for the new content here */
    p {
      margin: 0;
      font-size: 1rem;
    }
  }
`;
