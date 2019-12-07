import React from "react";
import Index from "../components/Index";

class IndexPage extends React.PureComponent {
  static async getInitialProps({ query: { spotifyAuthUrl } }) {
    return { spotifyAuthUrl };
  }

  render() {
    const { props } = this;
    return <Index {...props} />;
  }
}

export default IndexPage;
