from django.shortcuts import render,HttpResponse, redirect, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import login, authenticate,logout
from django.contrib.auth.models import User
from api.models import ApiGoods,History,Star,ShoppingCart, ApiStore
import json

# Create your views here.

@csrf_exempt
def produce_info(request):
    if request.method == "POST":
        data = ApiGoods.objects.order_by('?')[:8]
        data = {"goods_info":[{'goods_name':i.goods_name,'price':i.price,"conver_image":i.conver_image,"id":i.id} for i in data]}
        return HttpResponse(json.dumps(data))


@csrf_exempt
def to_web(request):
    if request.method == "GET":
        id = request.GET['id']
    return HttpResponse(json.dumps({'url':f'/produce_info/?id={id}'}))


# 用户注册接口
@csrf_exempt
def create_usr(request):
    if request.method == "POST":
        try:
            name = request.POST.get('username')
            password = request.POST.get('password')
            if User.objects.filter(username=name).exists():
                return render(request,'login.html',{"warning":"用户名已存在"})
            else:
                User.objects.create_user(username=name,password=password).save()
                return render(request,'login.html',{"warning":"注册成功,请登入"})
        except:
            return render(request,'login.html',{"warning":"有错误,请注意格式"})

# 用户登入接口
@csrf_exempt
def login_usr(request):
    if request.user.username:
        return  HttpResponseRedirect('/')
    if request.method == "POST":
        name = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(username=name,password=password)
        if user is not None:
            login(request,user)
            return  HttpResponseRedirect('/')
        else:
            return  render(request,'login.html',{"warning":"账号或密码错误"})

@csrf_exempt
def get_userinfo(request):
    print(request.user)
    return HttpResponse(json.dumps({'username':request.user.username}))

# 历史记录插入接口
@csrf_exempt
def put_history(request):
    response = json.loads(request.body)
    user = request.user
    produce_id = response.get('id')
    History.objects.update_or_create(user=user,produce_id=produce_id,defaults={"user":user,"produce_id":produce_id})
    con = History.objects.filter(user=user)
    if con.count() >= 99:
        [i.delete() for i in con.order_by('time')[:10]]

# 历史记录添加
@csrf_exempt
def refresh_history(request):
    if not request.method == 'POST':
        return HttpResponse('',status=500)
    
    print(request.body)
    body = json.loads(request.body)
    header = body['header']
    if header == 'refresh_history':
        page = body['page'] * 10
        try:
            history_all = History.objects.filter(user=request.user.id).order_by('-time').select_related('produce')
            if history_all.count() > page + 10:
                history_all = history_all[page - 9:page + 1]
            elif page + 10 > history_all.count() > page:
                history_all = history_all[page - 9:]
            else:
                raise '错误'
        except:
            return HttpResponse('',status=502)
        print(history_all)
        history = [i for i in [{"店铺名称":ApiStore.objects.get(store_id = i.produce.store_id).store_name,"id":i.produce_id,"名称":i.produce.goods_name,"价格":i.produce.price,'图片':i.produce.conver_image,} for i in history_all]]
        return HttpResponse(json.dumps({'data':history}),status=201)
    return HttpResponse('',status=501)

# 收藏商品处理接口
@csrf_exempt
def produce_star(request):
    # 基本数据
    user = request.user
    body = json.loads(request.body)
    header = body['header']
    produce = int(body['produce_id'].split('=')[1])
    print(produce,header)
    # 检测收藏状态
    if header == 'get_status':
        if user.id is None:
            return HttpResponse(json.dumps({"status":False}))
        else:
            if Star.objects.filter(user=user,produce=produce).exists():
                return HttpResponse(json.dumps({"status":True}))
            else:
                return HttpResponse(json.dumps({"status":False}))
    elif not user.username:
        return  HttpResponse(json.dumps({"status":False}),status = 302)
    elif header == 'add_star':
        Star.objects.get_or_create(user=user,produce_id=produce, defaults={"user_id":user.id,'produce_id':produce})
        return HttpResponse(json.dumps({"status":True}))
    elif header == 'minus_star':
        Star.objects.filter(user=user,produce_id=produce).delete()
        return HttpResponse(json.dumps({"status":True}))
    else:
        return HttpResponse('error aip name',200)
    

# 购物车处理接口
@csrf_exempt
def shoppingcar(request):
    
    if (not request.user.username) or (request.method != "POST"):
        return HttpResponse('/',status=501)

    user = request.user
    body = json.loads(request.body)
    header = body['header']
    

    if header == 'add_shoppingcar':
        produce_id = int(body['produce_id'].split('=')[1])
        data = {
            "user_id":user.id,
            "produce_id":produce_id,
            'color':{body['color_t']:body['color']},
            'size':{body['size_t']:body['size']},
            'num':body['num'],
            'addr':body['addr']
        }
        # 查询价格
        price = ApiGoods.objects.get(id= data['produce_id']).price
        print(data)
        # 加入购物车
        da = ShoppingCart.objects.get_or_create(user=user,produce_id=data['produce_id'],color=data["color"],size=data['size'],defaults=data)
        if not da[1]:
            return HttpResponse('/',status=502)
        return HttpResponse('/',status=203)
    return HttpResponse('/',status=203)
    

# 搜索
@csrf_exempt
def get_search(request):
    if request.method != 'POST':
        return HttpResponse('',status=203)
    search = json.loads(request.body)['search']
    page = json.loads(request.body)['page']
    print(search,page * 4)
    data = ApiGoods.objects.filter(goods_name__contains=search)
    if data.count() > 8:
        data = data[:8]

    data = {"goods_info":[{'goods_name':i.goods_name,'price':i.price,"conver_image":i.conver_image,"id":i.id} for i in data]}
    return HttpResponse(json.dumps(data))
    