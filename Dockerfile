FROM nginx:alpine
COPY dist/angular-frontend /usr/share/nginx/html 
COPY nginx.conf /etc/nginx/nginx.conf  
