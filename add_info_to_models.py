import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE','myd.settings')
django.setup()

from api.models import ApiGoods,ApiStore
import json
