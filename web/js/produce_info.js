class show {
    constructor(datee) {
        this.date = datee
        this.showImg()
        this.auto_img()
        this.show_size()
        this.show_color()
        this.showServer()
        this.showProduceSize()
        this.showProduceAtrribute()
        this.showProduceImages()
    }


    // 展示主图片函数
    showImg() {
        const img = this.date.media.img1.img
        // 大图显示
        img.forEach(image => {
            const carousel = document.querySelector('#carousel')
            const imgTag = document.createElement('img')
            imgTag.src = image
            carousel.appendChild(imgTag)
        })
        // 小图显示
        const img2 = this.date.media.img2
        img2.forEach(image => {
            const img_list = document.querySelector('.produce_img_list').querySelector('.img_list')
            const img = document.createElement('li')
            img.innerHTML = `<img src=${image} >`
            img_list.appendChild(img)
        })
    }


    // 图片轮播
    auto_img() {
        const carouselImages = document.querySelector('#carousel').querySelectorAll('img');
        let i = 0;

        function auto() {
            // 隐藏当前显示的图片
            carouselImages[i].style.display = 'none';
            // 计算下一张图片的索引
            i++;
            if (i >= carouselImages.length) {
                i = 0; // 回到第一张图片
            }
            // 显示下一张图片
            carouselImages[i].style.display = 'block';
        }
        // 初始显示第一张图片
        carouselImages[i].style.display = 'block';
        // 每隔 1000 毫秒（即 1 秒）调用一次 auto 函数
        setInterval(auto, 2000);
    }


    // 显示颜色选项信息
    show_size() {
        const td = Object.keys(specifications.尺码)
        if (!td | specifications.尺码[td].length in ['', 0]) {
            document.querySelector('.produce_size').style.display = 'none'
            return
        }
        const list = specifications.尺码[td]
        const produce_size = document.querySelector('.produce_size')
        produce_size.querySelector('dt').innerText = td
        list.forEach(size => {
            const li = document.createElement('li')
            li.innerText = size
            document.querySelector('.produce_size').querySelector('ul').appendChild(li)
        })
    }


    show_color() {
        if ('图片' in specifications.颜色) {
            const produce_color = document.querySelector('.produce_color')
            produce_color.style.display = 'none';
            return
        }
        if (specifications.颜色.img.length <= 0) {
            const produce_color = document.querySelector('.produce_color')
            produce_color.style.display = 'none';
            return
        }
        const color = specifications.颜色
        const th = Object.keys(color)[1]
        const position = color[th]
        const img = color.img
        for (let i = 0; i < img.length; i++) {
            const produce_color = document.querySelector('.produce_color')
            const li = document.createElement('li')
            produce_color.querySelector('dt').innerText = th
            li.innerHTML = `
            <img src=${img[i]} "="" alt=" 你的浏览器坏掉了" class="produce_color_img">
            <p class=" produce_color_options">${position[i]}</p>
            `
            produce_color.querySelector('ul').appendChild(li)
        }

    }


    showServer() {
        const server = document.querySelector('.server').querySelector('ul')
        this.date.service.服务.forEach(f => {
            const li = document.createElement('li')
            li.innerText = f
            server.appendChild(li)
        })

    }


    showProduceSize() {
        if (parameters.尺码.length <= 1) {
            document.querySelector('.project_size').style.display = 'none';
            return
        }
        const size_table = document.querySelector('.size_table')
        let cs = 1
        parameters.尺码.forEach(li => {
            if (li.length <= 1) { return }
            const tr = document.createElement('tr')
            if (cs == 1) {
                tr.className = 'th'
                cs = 0
            }
            li.forEach(el => {
                const td = document.createElement('td')
                td.innerText = el
                tr.appendChild(td)
            })
            size_table.appendChild(tr)

        })

    }



    // 插入参数
    showProduceAtrribute() {
        const atrribute_info_list = document.querySelector('.atrribute_info_list')
        parameters.参数.forEach(line => {
            const tr = document.createElement('tr')
            const keys = Object.keys(line)
            tr.innerHTML = `
        <th class="biaoge1" >${keys[0]}</th>
        <td class="biaoge2" >${line[keys[0]]}</td>
        <th class="biaoge1" >${keys[1]}</th>
        <td class="biaoge2" >${line[keys[1]]}</td>
        `
            atrribute_info_list.appendChild(tr)
        })
    }


    // 介绍图片
    showProduceImages() {
        const produce_info_images_list = document.querySelector('.produce_info_images_list')
        display_image.展示图片.forEach(img => {
            const image = document.createElement('img')
            image.src = img
            produce_info_images_list.appendChild(image)
        })

    }
}




class server {
    constructor(date) {
        this.date = date
        // function
        this.show_star()
        this.star_event()

        // 购物车数据
        this.color_info = ''
        this.size_info = ''
        this.color_indt = ''
        this.size_indt = ''
        this.addr = ''
        this.produce_num = 1
        this.produce_price = 0

        this.address()
        this.option_btn()
        this.add_shoppingcar()
        this.price()
    }

    // 获取商品收藏状态
    star_status() {
        return fetch('/api/produce_star/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'header': 'get_status',
                'produce_id': location.search,
            }),
        }).then(response => response.json()).then(data => data['status'])
    }


    async show_star() {
        const status = await this.star_status()
        const star_img = document.querySelector('.star').querySelector('img')
        if (status) {
            star_img.src = this.date.star_star
        } else {
            star_img.src = this.date.star_img_svg
        }
    }

    // 添加收藏
    add_star() {
        fetch('/api/produce_star/', {
            method: 'POST',
            hearder: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                header: 'add_star',
                'produce_id': location.search,
            }),
        }).then(response => {
            console.log(response.status)
            if (response.status == 302) {
                location = "/"
                return
            }
            this.show_star()
        })
    }

    // 取消收藏
    minus_star() {
        fetch('/api/produce_star/', {
            method: 'POST',
            hearder: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                header: 'minus_star',
                'produce_id': location.search,
            }),
        }).then(response => {
            console.log(response.status)
            if (response.status == 302) {
                location = "/"
                return
            }
            this.show_star()
        })
    }

    star_event() {
        document.querySelector(".star").addEventListener('click', () => {
            this.star_status().then(response => {
                if (response) { this.minus_star() } else { this.add_star() }
                this.show_star()
            })
        })
    }

    address() {
        let addr1 = document.querySelector('#province').value
        let addr2 = document.querySelector('#city').value
        let addr3 = document.querySelector('#district').value
        this.addr = addr1 + "-" + addr2 + "-" + addr3
    }



    option_btn() {
        const produce_color = document.querySelector('.produce_color')
        this.color_indt = produce_color.querySelector('dt').innerText
        let pul = produce_color.querySelector('ul')

        const produce_size = document.querySelector('.produce_size')
        this.size_indt = produce_size.querySelector('dt').innerText
        let zul = produce_size.querySelector('ul')

        // 数据初始化
        if (pul.querySelector('li')) {
            pul.querySelector('li').style.boxShadow = 'inset -1px -1px 3px #ffffff, inset 1px 1px 4px 1px #020202'
            pul.querySelector('li').classList.add('myColor')
            this.color_info = pul.querySelector(".myColor").querySelector("p").innerText
        } 
        if(zul.querySelector('li')) {
            zul.querySelector('li').style.boxShadow = 'inset -1px -1px 3px #ffffff, inset 1px 1px 4px 1px #020202'
            zul.querySelector('li').classList.add('mySize')
            this.size_info = zul.querySelector(".mySize").innerText
        }

        pul.addEventListener('click', (li) => {
            li = li.target
            if (['IMG', 'P'].includes(li.nodeName)) {
                pul.querySelectorAll('li').forEach(li => {
                    li.classList.remove('myColor')
                    li.style.boxShadow = ''
                })
                li.parentNode.style.boxShadow = 'inset -1px -1px 3px #ffffff, inset 1px 1px 4px 1px #020202'
                li.parentNode.classList.add('myColor')
            }
            else if (li.nodeName == 'li') {
                pul.querySelectorAll('li').forEach(li => {
                    li.classList.remove('myColor')
                    li.style.boxShadow = ''
                })
                li.style.boxShadow = 'inset -1px -1px 3px #ffffff, inset 1px 1px 4px 1px #020202'
                li.parentNode.classList.add('myColor')
            }
            this.color_info = pul.querySelector(".myColor").querySelector("p").innerText
        })


        zul.addEventListener('click', (li) => {
            li = li.target
            if (li.nodeName == 'LI') {
                zul.querySelectorAll('li').forEach(li => {
                    li.classList.remove('mySize')
                    li.style.boxShadow = ''
                })
                li.style.boxShadow = 'inset -1px -1px 3px #ffffff, inset 1px 1px 4px 1px #020202'
                li.classList.add('mySize')
            }
            this.size_info = zul.querySelector(".mySize").innerText
        })
    }

    price() {
        document.querySelector('#plusMinusButton').addEventListener('click', (btn) => {
            const classname = btn.target.className
            const vl = document.querySelector('#plusMinusButton').querySelector('.value')
            let num = +document.querySelector('#plusMinusButton').querySelector('.value').innerText
            console.log(classname)
            if (classname == 'add' && num <= 49) { vl.innerText = num + 1 }
            if (classname == 'minus' && num >= 2) { vl.innerText = num - 1 }

            const old_price = +document.querySelector('.produce_price').innerText.substr(1)
            const price = document.querySelector('.push').querySelector('.produce_price')
            this.produce_num = vl.innerText
            this.produce_price = `￥${vl.innerText * old_price}`
            price.innerText = this.produce_price
            console.log(this.produce_num, this.produce_price)

        })
    }

    add_shoppingcar() {
        document.querySelector('.cart-button').addEventListener('click', () => {
            this.address()
            const cart_button = document.querySelector('.cart-button')
            fetch('/api/shoppingcar/', {
                method: 'POSt',
                header: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "header": 'add_shoppingcar',
                    'produce_id': location.search,
                    'color_t': this.color_indt,
                    'size_t': this.size_indt,
                    'color': this.color_info,
                    'size': this.size_info,
                    'num': this.produce_num,
                    'addr': this.addr,
                })
            }).then(response => {
                console.log(response.status)
                switch (response.status) {
                    case 203:
                        cart_button.innerText = '加入成功'
                        setTimeout(() => { cart_button.innerText = '加入购物车' }, 1000)
                        return
                    case 501:
                        location = '/'
                        return
                    case 502:
                        cart_button.innerText = '重复加入'
                        setTimeout(() => { cart_button.innerText = '加入购物车' }, 1000)
                        return
                }
            })
        })
    }
}


let datee = {
    "media": media,
    "specifications": specifications,
    "service": service,
    "parameters": parameters,
    "display_image": display_image,
    "star_star": star_star,
    "star_img_svg": star_img_svg,
}
// 显示数据
let shows = new show(datee)
// 更新界面
let MyServer = new server(datee)