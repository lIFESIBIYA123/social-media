import React from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import ProfileDetails from "../components/profile/ProfileDetails";
import useSWR from "swr";
import { fetcher } from "../helpers/axios";
import Post from "../components/posts/Post";
import { Row, Col } from "react-bootstrap";
import { getUser } from "../hooks/user.actions";

function Profile() {
    const { profileId } = useParams();
    const user = useSWR(`/user/${profileId}/`, fetcher);

    const posts = useSWR(`/post/?author_public_id=${profileId}`, fetcher, {
        refreshInterval: 20000
    });

    // Get the current logged-in user
    const currentUser = getUser();

    // check if the logged-in user is viewing their owwn profile
    const isOwnProfile = currentUser && user.data && currentUser.id === user.data.id;

    return (
        <Layout hasNavigationBack>
            <Row className="justify-content-evenly">
                <Col sm={9}>
                    <ProfileDetails 
                        user={user.data}
                        isOwnProfile={isOwnProfile} //owner prop
                    />
                    <div>
                        <Row className="my-4">
                            {posts.data?.results.map((post, idex) => (
                                <Post key={idex} post={post}
                                    refresh={posts.mutate} />
                            ))}
                        </Row>
                    </div>
                </Col>
            </Row>
        </Layout>
    );
}

export default Profile;