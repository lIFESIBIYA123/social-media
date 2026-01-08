from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import viewsets
from core.user.serializers import UserSerializer
from core.user.models import User

class UserViewSet(viewsets.ModelViewSet):
    http_method_names = ('patch', 'get')
    permission_classes = (IsAuthenticated,) # replaced AllowAny 
    serializer_class = UserSerializer

    # gets the list of all users
    def get_queryset(self):
        if self.request.user.is_superuser:
            return User.objects.all()
        return User.objects.exclude(is_superuser=True)

    # get one user
    # This method is called when 
    # a GET or PUT request is made on the /user/id/ endpoint, with id representing the ID of 
    # the user.

    def get_object(self):
        obj = User.objects.get_object_by_public_id(self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj

    # There we have the User viewset – but there is no endpoint yet to make it work. Well, let’s add a 
    # router now.