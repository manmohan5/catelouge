import React from 'react';
import { Link } from 'react-router-dom';

function Home(props) {
  return (
    <div>
      <Link to="/products">
        <button>show product</button>
      </Link>
    </div>
  );
}

export default Home;
