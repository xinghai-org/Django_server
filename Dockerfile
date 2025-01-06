FROM docker.1ms.run/python:3.9

WORKDIR /django

COPY ./requirements.txt .

RUN pip install -r requirements.txt -i https://mirrors.tuna.tsinghua.edu.cn/pypi/web/simple

COPY . .

EXPOSE 10002

CMD ["python","manage.py","runserver","[::]:10002"]
