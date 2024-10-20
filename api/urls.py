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
from api import views
from django.urls import path, include

urlpatterns = [
    path('get_produce_info/',views.produce_info),
    path('to_web/',views.to_web),
    path('create_usr/',views.create_usr),
    path('login_usr/',views.login_usr),
    path('get_userinfo/',views.get_userinfo),
    path('put_history/',views.put_history),
    path('produce_star/',views.produce_star),
    path('shoppingcar/',views.shoppingcar),
    path('refresh_history/',views.refresh_history),
    path('get_search/',views.get_search),
]
