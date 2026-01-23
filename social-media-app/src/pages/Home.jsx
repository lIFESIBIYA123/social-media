import React from "react";
import Layout from "../components/Layout";
import { Row, Col, Image } from "react-bootstrap";
import { randomAvatar } from "../utils";
import useSWR from "swr";
import { fetcher } from "../helpers/axios";
import { getUser } from "../hooks/user.actions";
import Post from "../components/posts/Post";
import CreatePost from "../components/posts/CreatePost";
import ProfileCard from "../components/profile/ProfileCard";

function Home() {
  const posts = useSWR("/post/", fetcher, {
    refreshInterval: 10000,
  });
  const profiles = useSWR("/user/?limit=5", fetcher);
  
  // Fetch current user data from API instead of localStorage
  const localUser = getUser();
  const currentUser = useSWR(
    localUser ? `/user/${localUser.id}/` : null,
    fetcher
  );

  const handleAvatarError = (e) => {
    e.target.src = "https://api.dicebear.com/7.x/identicon/svg";
  };

  if (!localUser || !currentUser.data) {
    return <div>Loading!</div>;
  }

  const user = currentUser.data; // Use API data instead of localStorage

  return (
    <Layout>
      <Row className="justify-content-evenly">
        <Col sm={7}>
          <Row className="border rounded align-items-center">
            <Col className="flex-shrink-1">
              <Image
                src={user.avatar}
                roundedCircle
                width={52}
                height={52}
                className="my-2"
                onError={handleAvatarError}
              />
            </Col>
            <Col sm={10} className="flex-grow-1">
              <CreatePost refresh={posts.mutate} />
            </Col>
          </Row>
          <Row className="my-4">
            {posts.data?.results.map((post, index) => (
              <Post key={index} post={post} refresh={posts.mutate} />
            ))}
          </Row>
        </Col>
        <Col sm={3} className="border rounded py-4 h-50">
          <h4 className="font-weight-bold text-center">
            Suggested People
          </h4>
          <div className="d-flex flex-column">
            {profiles.data && profiles.data.results.map((profile, index) => (
              <ProfileCard key={index} user={profile} />
            ))}
          </div>
        </Col>
      </Row>
    </Layout>
  );
}

export default Home;