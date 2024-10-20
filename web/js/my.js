class show {
    constructor(star, history) {
        this.star = star
        this.history = history
        this.show_star()
        this.show_history()


    }
    show_star() {
        if (this.star.length < 1) {
            return
        } else {
            document.querySelector('.alert').style.display = 'none'
        }

        const start_list = document.querySelector('#start_list')
        this.star.forEach(data => {
            const li = document.createElement('li')
            li.innerHTML = `
            <div class="img" ><img src="${data['图片']}" ></div>
            <div class="produce_info" >
                <div class="price" ><span>￥${data['价格']}</span></div>
                <div class="goods_name" >
                    <span>${data['店铺名称']}</span>
                    <span>${data['名称']}</span>
                    <div class="star_button" ><img src="/static/images/star_all.svg" ></div>
                </div>
            </div>
            `
            li.setAttribute('id', data['id'])
            start_list.appendChild(li)
        })
    }

    show_history() {
        if (this.history.length < 1) {
            return
        } else {
            document.querySelectorAll('.alert')[2].style.display = 'none'
        }

        const history_list = document.querySelector('.history_list')
        this.history.forEach(data => {
            const li = document.createElement('li')
            li.innerHTML = `
            <div class="img" ><img src="${data['图片']}" ></div>
            <div class="produce_info" >
                <div class="price" ><span>￥${data['价格']}</span></div>
                <div class="goods_name" >
                    <span>${data['店铺名称']}</span>
                    <span>${data['名称']}</span>

                </div>
            </div>
            `
            li.setAttribute('id', data['id'])
            history_list.appendChild(li)
        })


    }
}

class server {
    constructor() {
        this.click_star()
        this.click_history()
        this.refresh_history()
    }
    click_star() {
        document.querySelector('#start_list').addEventListener('click', event => {
            const li = event.target.closest("li")
            const id = li.id
            const img = event.target.closest('.star_button')
            if (img && document.querySelector('#start_list').contains(img)) {
                fetch('/api/produce_star/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'header': 'get_status',
                        'produce_id': `?=${id}`,
                    }),
                }).then(response => response.json()).then(data => {
                    console.log(data.status)
                    if (data.status) {
                        fetch('/api/produce_star/', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                'header': 'minus_star',
                                'produce_id': `?=${id}`,
                            })
                        }).then(() => {
                            img.querySelector('img').src = '/static/images/star.svg'
                        })
                    } else {
                        fetch('/api/produce_star/', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                'header': 'add_star',
                                'produce_id': `?=${id}`,
                            })
                        }).then(() => {
                            img.querySelector('img').src = '/static/images/star_all.svg'
                        })
                    }
                })
                return
            }

            if (li && document.querySelector('#start_list').contains(li)) {
                window.open(`/produce_info/?id=${id}`)
            }
        })
    }

    click_history() {
        document.querySelector('.history_list').addEventListener('click', event => {
            const li = event.target.closest("li")
            if (li && document.querySelector('.history_list').contains(li)) {
                const id = li.id
                window.open(`/produce_info/?id=${id}`)
            }
        })
    }

    refresh_history() {
        let T = true
        window.addEventListener('scroll', () => {
            // 网页页面高度
            const scrollHeight = document.documentElement.scrollHeight
            // 获取视口高度
            const clientHeight = document.documentElement.clientHeight
            // 获取偏移量
            const scrollTop = document.documentElement.scrollTop
            if (clientHeight + scrollTop > scrollHeight - 50) {

                if (T) {
                    T = false
                    const history_list = document.querySelector('.history_list')
                    const count = history_list.querySelectorAll('li').length
                    const page = ~~(count / 10) + 1
                    fetch('/api/refresh_history/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            'header': 'refresh_history',
                            'page': page
                        }),
                    }).then(response => {
                        const status = response.status
                        switch (status) {
                            case 201:
                                return response.json()
                            case 502:
                                return 502
                        }

                    }).then(dd => {
                        if (dd == 502){T = true;return}
                        const data = dd.data
                        data.forEach(data => {
                            const li = document.createElement('li')
                            li.innerHTML = `
                            <div class="img" ><img src="${data['图片']}" ></div>
                            <div class="produce_info" >
                            <div class="price" ><span>￥${data['价格']}</span></div>
                            <div class="goods_name" >
                            <span>${data['店铺名称']}</span>
                            <span>${data['名称']}</span>
                            </div>
                            </div>
                            `
                            li.setAttribute('id', data['id'])
                            history_list.appendChild(li)
                        })
                        T = true
                    })
                }
            }

        })
    }
}
const shows = new show(star, history)
const servers = new server()