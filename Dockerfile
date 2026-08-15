# Static HTML mockups served by nginx.
# No build step — these are plain HTML/CSS/JS files.
FROM nginx:alpine

# Serve the two client mock sites from nginx's web root.
# Accessible at:  /wj-mock/  and  /alnasr-mock/
COPY wj-mock/     /usr/share/nginx/html/wj-mock/
COPY alnasr-mock/ /usr/share/nginx/html/alnasr-mock/

EXPOSE 80