FROM jupyter/notebook
RUN pip install --upgrade pip

# install other packages required for tutorial
ADD requirements.txt /
RUN pip install -r /requirements.txt && rm -rf /root/.cache/pip/*
