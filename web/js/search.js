// 用户信息

create_tr().then(a => a)
// 页面商品点击事件
document.querySelector('table').addEventListener('click', event => {
    let on_click = event.target
    if (on_click.className != "shoppingCart") {
        if (on_click.parentNode.nodeName == "DIV") {
            const id = on_click.parentNode.parentNode.getAttribute('id')
            const time = new Date().toLocaleString()
            fetch('/api/put_history/', {
                method: 'POST',
                body: JSON.stringify({ 'id': id, 'date': time })
            })
            window.open(`/produce_info/?id=${id}`)
        }
    }
    else {
        console.log('no')
    }
})


// 页面刷新事件
window.onscroll = () => {
    let a = true
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10 && a) {
        // console.log(window.innerHeight + window.scrollY)
        create_tr()
    }
};


async function create_tr() {
    a = false
    const page = document.querySelector('.content').querySelectorAll('tr').length

    // 请求元素
    let produce_info = await fetch('/api/get_search/', {
        method: 'post',
        body:JSON.stringify({
            'search':'5G',
            'page':page,
        }),
    }).then(response => response.json()).then(data => data.goods_info)

    // 制作html
    console.log(produce_info)
    const arr = []
    produce_info.forEach(a => {
        const td = document.createElement('td')
        const html = `
        <div>
        <img src=${a.conver_image} class="img" />
        <p class="produceName">${a.goods_name}</p>
        <p class="price">￥${a.price}</p>
        <img src="${Image_url}" class="shoppingCart" />
        </div>
        `
        td.innerHTML = html
        td.setAttribute("id", a.id)
        arr.push(td)
    })
    console.log(arr)

    // 显示元素
    const table = document.querySelector('.content')
    for (let i = 0; i < 2; i++) {
        const tr = document.createElement('tr')
        for (let e = 0; e < 4; e++) {
            tr.appendChild(arr[e + i * 4])
        }
        table.appendChild(tr)
    }
    a = true
    return 1
    
}