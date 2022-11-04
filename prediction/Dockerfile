FROM python:alpine
RUN apk add gcc openblas gfortran
COPY . .
WORKDIR /
RUN pip install -r requirements-pro.txt
CMD python app.py
