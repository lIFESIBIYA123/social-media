# ==========================================================
# ROUTERS
# ==========================================================

from rest_framework.routers import SimpleRouter
from rest_framework_nested.routers import NestedSimpleRouter

# ==========================================================
# VIEWSETS
# ==========================================================

from core.user.viewsets import UserViewSet
from core.auth.viewsets import RegisterViewSet, LoginViewSet, RefreshViewSet
from core.post.viewsets import PostViewSet
from core.comment.viewsets import CommentViewSet

# ==========================================================
# BASE ROUTER
# ==========================================================

router = SimpleRouter()

# ==========================================================
# AUTH ROUTES
# ==========================================================
# /auth/register/
# /auth/login/
# /auth/refresh/
# ==========================================================

router.register(r'auth/register', RegisterViewSet, basename='auth-register')
router.register(r'auth/login', LoginViewSet, basename='auth-login')
router.register(r'auth/refresh', RefreshViewSet, basename='auth-refresh')

# ==========================================================
# USER ROUTES
# ==========================================================
# /user/
# ==========================================================

router.register(r'user', UserViewSet, basename='user')

# ==========================================================
# POST ROUTES
# ==========================================================
# /post/
# ==========================================================

router.register(r'post', PostViewSet, basename='post')

# ==========================================================
# NESTED COMMENT ROUTES
# ==========================================================
# /post/{post_id}/comment/
# ==========================================================

posts_router = NestedSimpleRouter(router, r'post', lookup='post')
posts_router.register(r'comment', CommentViewSet, basename='post-comment')

# ==========================================================
# URL PATTERNS
# ==========================================================

urlpatterns = [
    *router.urls,
    *posts_router.urls,
]
