from rest_framework import status
from core.fixtures.user import user
from core.fixtures.post import post

class TestPostViewSet:
    endpoint = '/api/post/'

    def test_list(self, client, user, post):
        client.force_authenticate(user=user)
        response = client.get(self.endpoint)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 1

    def test_retrieve(self, client, user, post):
        client.force_authenticate(user=user)
        response = client.get(self.endpoint + str(post.public_id) + "/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data['id'] == post.public_id.hex
        assert response.data['body'] == post.body
        assert response.data['author']['id'] == post.author.public_id.hex

    # or creation and deletion of the posts

    def test_create(self, client, user):
        client.force_authenticate(user=user)
        data = {
            "body": "Test Post Body",
            "author": user.public_id.hex
        }
        response = client.post(self.endpoint, data)
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['body'] == data['body']
        assert response.data['author']['id'] == user.public_id.hex

    def test_update(self, client, user, post):
        client.force_authenticate(user=user)
        data = {
            "body": "Test Post Body",
            "author": user.public_id.hex
        }
        response = client.put(self.endpoint + str(post.public_id) + "/", data)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['body'] == data['body']

    def test_delete(self, client, user, post):
        client.force_authenticate(user=user)
        response = client.delete(self.endpoint + str(post.public_id) + "/")
        assert response.status_code == status.HTTP_204_NO_CONTENT

        #  Now, for the anonymous users, we want them to 
        # access the resource in reading mode, so they can’t create, modify, or delete a resource. Let’s test and 
        # validate these features:
                

    def test_anonymous(self, client, post):
        response = client.get(self.endpoint)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["count"] == 1

    def test_retrieve_anonymous(self, client, post):
        response = client.get(self.endpoint + str(post.public_id) + "/")
        assert response.status_code == status.HTTP_200_OK
        assert response.data['id'] == post.public_id.hex
        assert response.data['body'] == post.body
        assert response.data['author']['id'] == post.author.public_id.hex

    # let’s test the forbidden methods:

    def test_create_anonymous(self, client):
        data = {
            "body": "Test Post Body",
            "author": "test_user"
        }
        response = client.post(self.endpoint, data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_update_anoymous(self, client, post):
        data = {
            "body": "Test Post Body",
            "author": "test_user"
        }
        response = client.put(self.endpoint + str(post.public_id) + "/", data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_delete_anonymous(self, client, post):
        response = client.delete(self.endpoint + str(post.public_id) + "/")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED