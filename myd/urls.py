"""
URL configuration for myd project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from myapp import views as web
from api import views as api
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', web.login),
    path('""', web.login),
    path('my/', web.my),
    path('search/', web.search),
    path('produce_info/', web.produce_info),
    path('api/', include('api.urls')),
]
