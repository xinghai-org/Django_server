from django.shortcuts import render, HttpResponse
from django.contrib.auth import logout
from django.views.decorators.csrf import csrf_exempt
from api.models import ApiGoods, ApiStore,Oder,Star,ShoppingCart,History
import json
# Create your views here.

# 主页面处理
@csrf_exempt
def login(requests):
    if requests.method == "GET":
        if requests.user.username:
            shoppingCar = ShoppingCart.objects.filter(user=requests.user.id).count()
            return  render(requests,'index.html',{'shoppingCar':shoppingCar})
        else:
            return render(requests, 'login.html', {"spacing": ""})

# 商品详情页面
@csrf_exempt
def produce_info(request):
    if request.method == "GET":
        id = request.GET['id']
        goods = ApiGoods.objects.filter(id=int(id))[0]
        store = ApiStore.objects.filter(store_id=goods.store_id)[0]
        # 字符串格式问题
        data = {
            'goods_name':goods.goods_name,
            'price':goods.price,
            'introduction_media':goods.introduction_media,
            'specifications':goods.specifications,
            'parameters':goods.parameters,
            'service' :goods.service,
            'display_image':goods.display_image,
            'store_name':store.store_name,
        }
        return render(request,'produce_info.html',data)
    return render(request,'produce_info.html')

@csrf_exempt
def my(request):
    if request.method == "GET":
        # 判断用户有没有登入
        if request.user.username:
            # 载入数据
            oder = Oder.objects.filter(user=request.user.id)
            shoppingCar = ShoppingCart.objects.filter(user=request.user.id)
            history_all = History.objects.filter(user=request.user.id).order_by('-time').select_related('produce')
            star = Star.objects.filter(user=request.user.id).select_related('produce')

            if history_all.count() > 10:
                history = history_all[:10]
            else:
                history = history_all

            data = {
                '用户':request.user.username,
                '订单总数':oder.count(),
                '收藏总数':star.count(),
                '购物车总数':shoppingCar.count(),
                '足迹总数':history_all.count(),
                '收藏':[i for i in [{"店铺名称":ApiStore.objects.get(store_id = i.produce.store_id).store_name,"id":i.produce_id,"名称":i.produce.goods_name,"价格":i.produce.price,'图片':i.produce.conver_image,} for i in star]],
                '订单':[],
                '足迹':[i for i in [{"店铺名称":ApiStore.objects.get(store_id = i.produce.store_id).store_name,"id":i.produce_id,"名称":i.produce.goods_name,"价格":i.produce.price,'图片':i.produce.conver_image,} for i in history]],
            }

            return render(request,'my.html',data)
        else:
            return render(request, 'login.html')

@csrf_exempt
def search(request):
    return render(request,'search.html')