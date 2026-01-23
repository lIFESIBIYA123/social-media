from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action

from core.abstract.viewsets import AbstractViewSet
from core.post.models import Post
from core.post.serializers import PostSerializer
from core.auth.permissions import UserPermission
from core.user.models import User


class PostViewSet(AbstractViewSet):
    http_method_names = ('post', 'get', 'put', 'delete')
    permission_classes = (UserPermission,)
    serializer_class = PostSerializer

    def get_queryset(self):
        queryset = Post.objects.all().select_related('author')
        
        # Filter by author's public_id if provided in query params
        author_public_id = self.request.query_params.get('author_public_id', None)
        if author_public_id is not None:
            try:
                author = User.objects.get_object_by_public_id(author_public_id)
                queryset = queryset.filter(author=author)
            except User.DoesNotExist:
                queryset = queryset.none()
        
        return queryset.order_by('-created')

    def get_object(self):
        obj = Post.objects.get_object_by_public_id(self.kwargs['pk'])
        self.check_object_permissions(self.request, obj)
        return obj

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def get_serializer_context(self):
        """Pass request context to serializer"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    # adding like and dislike actions
    
    @action(methods=['post'], detail=True)
    def like(self, request, *args, **kwargs):
        post = self.get_object()
        user = self.request.user
        user.like(post)
        serializer = self.serializer_class(post, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(methods=['post'], detail=True)
    def remove_like(self, request, *args, **kwargs):
        post = self.get_object()
        user = self.request.user
        user.remove_like(post)
        serializer = self.serializer_class(post, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)