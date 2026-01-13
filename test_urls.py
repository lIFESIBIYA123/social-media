import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'CoreRoot.settings')
django.setup()

from django.urls import get_resolver

resolver = get_resolver()

print("\n=== ALL REGISTERED URLS ===\n")

def show_urls(urlpatterns, prefix=''):
    for pattern in urlpatterns:
        if hasattr(pattern, 'url_patterns'):
            show_urls(pattern.url_patterns, prefix + str(pattern.pattern))
        else:
            print(prefix + str(pattern.pattern))

show_urls(resolver.url_patterns)