import React from "react";
import { Button, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function ProfileDetails(props) {
    const { user, isOwnProfile } = props;
    const navigate = useNavigate();

    if (!user) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <div className="d-flex flex-row border-bottom p-5">
                <Image
                    src={user.avatar}
                    roundedCircle
                    width={110}
                    height={110}
                    className="me-5 border border-primary border-2"
                />
                <div className="d-flex flex-column justify-content-start align-self-center mt-2">
                    <p className="fs-4 m-0">
                        {user.username}
                    </p>
                    <p className="fs-5">
                        {user.bio ? user.bio :
                            ""}
                    </p>
                    <p className="fs-6">
                        <small>{user.posts_count} Posts</small>
                    </p>
                    {isOwnProfile && (
                        <Button 
                            variant="primary"
                            size="sm"
                            className="w-50"
                            onClick={() =>
                                navigate(`/profile/${user.id}/edit/`)
                            }
                        >
                            Edit
                        </Button>
                    )}
                    
                </div>
            </div>
        </div>
    );
}

export default ProfileDetails;