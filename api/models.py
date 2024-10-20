from django.db import models
from django.contrib.auth.models import User
# Create your models here.


class ApiGoods(models.Model):
    id = models.BigAutoField(primary_key=True)
    goods_name = models.CharField(unique=True, max_length=64)
    price = models.FloatField(blank=True, null=True)
    conver_image = models.CharField(max_length=255, blank=True, null=True, db_comment='封面图片')
    introduction_media = models.JSONField(blank=True, null=True, db_comment='介绍图片')
    specifications = models.JSONField(blank=True, null=True, db_comment='规格')
    parameters = models.JSONField(blank=True, null=True, db_comment='商品参数')
    service = models.JSONField(blank=True, null=True, db_comment='服务')
    display_image = models.JSONField(blank=True, null=True, db_comment='展示图片')
    store = models.ForeignKey('ApiStore', models.DO_NOTHING)

    class Meta:
        managed = True
        db_table = 'api_goods'


class ApiStore(models.Model):
    store_id = models.AutoField(primary_key=True)
    store_name = models.CharField(unique=True, max_length=255, blank=True, null=True, db_comment='店铺名称')

    class Meta:
        managed = True
        db_table = 'api_store'



class History(models.Model):
    user = models.ForeignKey(User, models.DO_NOTHING)
    produce = models.ForeignKey(ApiGoods, models.DO_NOTHING)
    time = models.DateTimeField(auto_now=True)

    class Meta:
        managed = True
        db_table = 'history'
        db_table_comment = '用户信息表'


class Oder(models.Model):
    user = models.ForeignKey(User, models.DO_NOTHING)
    produce = models.ForeignKey(ApiGoods, models.DO_NOTHING)
    color = models.JSONField(blank=True, null=True)
    num = models.IntegerField()
    addr = models.CharField(max_length=255)
    status = models.JSONField(blank=True, null=True)
    time = models.DateTimeField()
    size = models.JSONField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'oder'
        db_table_comment = '收藏'


class ShoppingCart(models.Model):
    user = models.ForeignKey(User, models.DO_NOTHING)
    produce = models.ForeignKey(ApiGoods, models.DO_NOTHING)
    color = models.JSONField(blank=True, null=True)
    time = models.DateTimeField(auto_now=True,blank=True, null=True)
    size = models.JSONField(blank=True, null=True)
    num = models.IntegerField()
    addr = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'shopping_cart'
        db_table_comment = '购物车'


class Star(models.Model):
    user = models.ForeignKey(User, models.DO_NOTHING)
    produce = models.ForeignKey(ApiGoods, models.DO_NOTHING)

    class Meta:
        managed = True
        db_table = 'star'