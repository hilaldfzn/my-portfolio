from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Article
from .serializers import ArticleSerializer, ArticleListSerializer, ArticleDetailSerializer

class ArticleViewSet(viewsets.ModelViewSet):
    serializer_class = ArticleSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['published', 'featured', 'tags']
    search_fields = ['title', 'excerpt', 'content', 'tags']
    ordering_fields = ['created_at', 'title', 'view_count']
    ordering = ['-created_at']

    def get_queryset(self):
        if self.action == 'list':
            return Article.objects.filter(published=True)
        return Article.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return ArticleListSerializer
        elif self.action == 'retrieve':
            return ArticleDetailSerializer
        return ArticleSerializer

    def retrieve(self, request, *args, **kwargs):
        """Override retrieve to increment view count"""
        instance = self.get_object()
        if instance.published:
            instance.increment_view_count()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_slug(self, request):
        """Get article by slug"""
        slug = request.query_params.get('slug')
        if not slug:
            return Response(
                {'error': 'Slug parameter is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            article = Article.objects.get(slug=slug, published=True)
            article.increment_view_count()
            serializer = ArticleDetailSerializer(article)
            return Response(serializer.data)
        except Article.DoesNotExist:
            return Response(
                {'error': 'Article not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured articles"""
        featured_articles = self.get_queryset().filter(featured=True)
        serializer = ArticleListSerializer(featured_articles, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def popular(self, request):
        """Get most popular articles by view count"""
        popular_articles = self.get_queryset().order_by('-view_count')[:10]
        serializer = ArticleListSerializer(popular_articles, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def tags(self, request):
        """Get list of all tags used across articles"""
        articles = self.get_queryset()
        tags = set()
        
        for article in articles:
            if article.tags:
                tags.update(article.tags)
        
        return Response(sorted(list(tags)))

    @action(detail=False, methods=['get'])
    def search(self, request):
        """Advanced search functionality"""
        query = request.query_params.get('q', '')
        tag = request.query_params.get('tag', '')
        
        articles = self.get_queryset()
        
        if query:
            articles = articles.filter(
                Q(title__icontains=query) |
                Q(excerpt__icontains=query) |
                Q(content__icontains=query)
            )
        
        if tag:
            articles = articles.filter(tags__icontains=tag)
        
        serializer = ArticleListSerializer(articles, many=True)
        return Response(serializer.data)