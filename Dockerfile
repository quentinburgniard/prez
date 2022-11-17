FROM nginx:1
RUN curl -fsSL https://deb.nodesource.com/setup_current.x | bash - && apt-get install -y nodejs
COPY . /usr/share/nginx/html/prez
RUN cd /usr/share/nginx/html/prez && npm install && npm run build && mv dist/* /usr/share/nginx/html && rm -dr /usr/share/nginx/html/prez && apt-get purge -y nodejs && rm -r /etc/apt/sources.list.d/nodesource.list